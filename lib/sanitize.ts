// ─── XSS Sanitization Utilities ─────────────────────────
//
// Strips HTML tags and dangerous patterns from user-submitted strings.
// Applied via Zod transforms in validators to sanitize at the boundary.

/**
 * Strip all HTML tags from a string.
 * Handles script/style blocks, event handlers, and general tags.
 */
export function stripHtml(input: string): string {
  return input
    // Remove <script>...</script> and <style>...</style> blocks entirely
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    // Remove all remaining HTML tags
    .replace(/<[^>]*>/g, "")
    // Collapse multiple spaces into one
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Recursively sanitize all string values in an object.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    const value = result[key];
    if (typeof value === "string") {
      (result as Record<string, unknown>)[key] = stripHtml(value);
    } else if (Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = value.map((item) =>
        typeof item === "string" ? stripHtml(item) : item
      );
    } else if (value && typeof value === "object") {
      (result as Record<string, unknown>)[key] = sanitizeObject(
        value as Record<string, unknown>
      );
    }
  }
  return result;
}
