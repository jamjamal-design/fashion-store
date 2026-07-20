const serverBaseUrl = (process.env.NEXT_PUBLIC_SERVER_URL ?? "https://fashion-store-g8s0.onrender.com").replace(/\/$/, "");

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  folder: string;
};

export async function uploadImageToServerCloudinary(file: File, folder = "fashion-store/products", token?: string) {
  const formData = new FormData();

  formData.append("images", file);
  formData.append("folder", folder);

  const response = await fetch(`${serverBaseUrl}/api/uploads/cloudinary`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Upload failed with status ${response.status}`);
  }

  const result = (await response.json()) as { images: CloudinaryUploadResult[] };
  const firstImage = result.images[0];

  if (!firstImage) {
    throw new Error("Upload did not return an image");
  }

  return firstImage;
}
