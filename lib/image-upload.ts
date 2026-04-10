export const MAX_IMAGE_UPLOAD_BYTES = 50 * 1024 * 1024;

const COMPRESSIBLE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const MB = 1024 * 1024;

const formatMb = (bytes: number): string => `${(bytes / MB).toFixed(1)}MB`;

const buildJpegName = (name: string): string => {
  const base = name.includes(".") ? name.slice(0, name.lastIndexOf(".")) : name;
  return `${base || "upload"}.jpg`;
};

const loadImage = async (file: File): Promise<HTMLImageElement> => {
  const url = URL.createObjectURL(file);

  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Unable to read image file"));
      image.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> => new Promise((resolve, reject) => {
  canvas.toBlob(
    (blob) => {
      if (!blob) {
        reject(new Error("Image compression failed"));
        return;
      }
      resolve(blob);
    },
    "image/jpeg",
    quality,
  );
});

const compressToLimit = async (file: File, maxBytes: number): Promise<File | null> => {
  const image = await loadImage(file);

  let quality = 0.9;
  let scale = 1;

  for (let attempt = 0; attempt < 10; attempt++) {
    const width = Math.max(1, Math.floor(image.naturalWidth * scale));
    const height = Math.max(1, Math.floor(image.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to initialize image canvas");

    context.drawImage(image, 0, 0, width, height);

    const compressed = await canvasToBlob(canvas, quality);
    if (compressed.size <= maxBytes) {
      return new File([compressed], buildJpegName(file.name), {
        type: "image/jpeg",
      });
    }

    if (attempt % 2 === 0 && quality > 0.45) {
      quality -= 0.1;
    } else {
      scale *= 0.85;
    }
  }

  return null;
};

export interface PreparedImageResult {
  file: File | null;
  error: string | null;
  compressed: boolean;
}

export async function prepareImageForUpload(
  file: File,
  maxBytes: number = MAX_IMAGE_UPLOAD_BYTES,
): Promise<PreparedImageResult> {
  if (!file.type.startsWith("image/")) {
    return {
      file: null,
      error: "Only image files are allowed.",
      compressed: false,
    };
  }

  if (file.size <= maxBytes) {
    return {
      file,
      error: null,
      compressed: false,
    };
  }

  if (!COMPRESSIBLE_IMAGE_TYPES.has(file.type.toLowerCase())) {
    return {
      file: null,
      error: `Image is ${formatMb(file.size)}. Max allowed is ${formatMb(maxBytes)}. Please upload JPEG, PNG, or WebP for auto-compression.`,
      compressed: false,
    };
  }

  try {
    const compressedFile = await compressToLimit(file, maxBytes);

    if (!compressedFile) {
      return {
        file: null,
        error: `Could not compress image below ${formatMb(maxBytes)}. Please choose a smaller file.`,
        compressed: false,
      };
    }

    return {
      file: compressedFile,
      error: null,
      compressed: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image compression failed";
    return {
      file: null,
      error: message,
      compressed: false,
    };
  }
}
