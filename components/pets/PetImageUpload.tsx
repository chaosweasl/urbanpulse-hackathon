"use client";

import { useState, useCallback } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PetImageUploadProps {
  onUpload: (url: string) => void;
  className?: string;
}

export function PetImageUpload({ onUpload, className }: PetImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const ext = file.name.split('.').pop();
      const random = Math.random().toString(36).substring(2, 15);
      const filePath = `pet-photos/${user.id}-${random}.${ext}`;

      const { error: uploadError, data } = await supabase.storage
        .from('pets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('pets')
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrlData.publicUrl);
      onUpload(publicUrlData.publicUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className={cn("relative w-full rounded-3xl border-2 border-dashed p-6 transition-colors",
      previewUrl ? "border-primary bg-primary/5" : "border-border/50 bg-muted/20 hover:bg-muted/30",
      className
    )}>
      {isUploading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Uploading photo...</p>
        </div>
      ) : previewUrl ? (
        <div className="relative flex flex-col items-center">
          <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-2xl">
            <Image src={previewUrl} alt="Pet preview" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={() => { setPreviewUrl(null); onUpload(""); }}
            className="absolute -top-3 -right-3 rounded-full bg-destructive p-2 text-destructive-foreground shadow-lg hover:scale-105 transition-transform"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="flex flex-col items-center justify-center py-8 text-center cursor-pointer"
        >
          <label className="flex flex-col items-center cursor-pointer w-full h-full">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-bold text-foreground">Click or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onChange}
            />
          </label>
        </div>
      )}
      {error && <p className="text-xs text-destructive text-center mt-4 font-medium">{error}</p>}
    </div>
  );
}
