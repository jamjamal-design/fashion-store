import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;

export function getCloudinaryFolder(entity: string) {
  return `fashion-store/${entity}`;
}

export function buildCloudinaryAssetUrl(
  cloudName: string,
  publicId: string,
  version?: string,
) {
  const versionPrefix = version ? `v${version}/` : "";

  return `https://res.cloudinary.com/${cloudName}/image/upload/${versionPrefix}${publicId}`;
}