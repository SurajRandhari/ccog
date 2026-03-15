import slugify from "slugify";

/**
 * Generate a URL-safe slug from a title string.
 * Used at the application layer before saving to MongoDB.
 */
export function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true });
}
