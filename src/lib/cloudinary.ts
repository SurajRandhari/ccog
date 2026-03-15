import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_DOCUMENT_TYPES = ["application/pdf"];
const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DOCUMENT_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB

export type MediaType = "image" | "video" | "audio" | "document";

export function validateFile(
  mimeType: string,
  sizeBytes: number
): { valid: boolean; error?: string; type: MediaType } {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    if (sizeBytes > MAX_IMAGE_SIZE) {
      return {
        valid: false,
        error: "Image must be less than 10MB",
        type: "image",
      };
    }
    return { valid: true, type: "image" };
  }

  if (ALLOWED_DOCUMENT_TYPES.includes(mimeType)) {
    if (sizeBytes > MAX_DOCUMENT_SIZE) {
      return {
        valid: false,
        error: "Document must be less than 25MB",
        type: "document",
      };
    }
    return { valid: true, type: "document" };
  }

  if (ALLOWED_AUDIO_TYPES.includes(mimeType)) {
    if (sizeBytes > MAX_AUDIO_SIZE) {
      return {
        valid: false,
        error: "Audio must be less than 50MB",
        type: "audio",
      };
    }
    return { valid: true, type: "audio" };
  }

  return { valid: false, error: "File type not allowed", type: "document" };
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    resourceType?: "image" | "video" | "raw" | "auto";
  } = {}
) {
  const { folder = "ccog", resourceType = "auto" } = options;

  return new Promise<{
    publicId: string;
    url: string;
    secureUrl: string;
    width?: number;
    height?: number;
    format: string;
    bytes: number;
    duration?: number;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"));
            return;
          }
          resolve({
            publicId: result.public_id,
            url: result.url,
            secureUrl: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
            duration: result.duration,
          });
        }
      )
      .end(buffer);
  });
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}
