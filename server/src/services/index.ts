import bcrypt from "bcrypt";
// import crypto from "crypto";
import cloudinary from "../config/cloudinary";
import { Readable } from "stream";
import jwt from "jsonwebtoken";
import { AdminModel, CategoryModel, OrderModel, ProductModel } from "../models";
import type { AdminRole } from "../types";

type CrudModel = {
  find: () => any;
  findById: (id: string) => any;
  create: (payload: unknown) => any;
  findByIdAndUpdate: (id: string, payload: unknown, options: unknown) => any;
  findByIdAndDelete: (id: string) => any;
};

function createCrudService(model: CrudModel) {
  return {
    list() {
      return model.find();
    },
    getById(id: string) {
      return model.findById(id);
    },
    create(payload: unknown) {
      return model.create(payload);
    },
    update(id: string, payload: unknown) {
      return model.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    },
    remove(id: string) {
      return model.findByIdAndDelete(id);
    },
  };
}

export const adminService = createCrudService(AdminModel as unknown as CrudModel);
export const categoryService = createCrudService(CategoryModel as unknown as CrudModel);
export const productService = createCrudService(ProductModel as unknown as CrudModel);
export const orderService = createCrudService(OrderModel as unknown as CrudModel);

// Public product listing (only active products)
export const publicProductService = {
  list(filters?: { category?: string; featured?: boolean; search?: string }) {
    const query: Record<string, unknown> = { isActive: true };

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.featured) {
      query.featured = true;
    }

    if (filters?.search) {
      const searchRegex = { $regex: filters.search, $options: "i" };
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { badge: searchRegex },
      ];
    }

    return ProductModel.find(query).sort({ createdAt: -1 });
  },
  getBySlug(slug: string) {
    return ProductModel.findOne({ slug, isActive: true });
  },
  getByCategory(category: string) {
    return ProductModel.find({ category, isActive: true }).sort({ createdAt: -1 });
  },
  getFeatured(limit = 4) {
    return ProductModel.find({ featured: true, isActive: true })
      .sort({ rating: -1 })
      .limit(limit);
  },
};

// Public category listing
export const publicCategoryService = {
  list() {
    return CategoryModel.find({ isActive: true }).sort({ name: 1 });
  },
  getBySlug(slug: string) {
    return CategoryModel.findOne({ slug, isActive: true });
  },
};

export const uploadService = {
  getTargetFolder(entity: string) {
    return `fashion-store/${entity}`;
  },
};

export type CloudinaryUploadInput = {
  buffer: Buffer;
  fileName: string;
  folder?: string;
};

export async function uploadToCloudinary({
  buffer,
  fileName,
  folder,
}: CloudinaryUploadInput) {
  const resolvedFolder =
    folder ?? uploadService.getTargetFolder("products");

  return new Promise<{
    url: string;
    publicId: string;
    folder: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: resolvedFolder,
        public_id: fileName.replace(/\.[^/.]+$/, ""),
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          folder: resolvedFolder,
        });
      }
    );

    Readable.from(buffer).pipe(stream);
  });
}
// function getCloudinaryConfig() {
//   const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
//   const apiKey = process.env.CLOUDINARY_API_KEY;
//   const apiSecret = process.env.CLOUDINARY_API_SECRET;

//   if (!cloudName || !apiKey || !apiSecret) {
//     throw new Error("Cloudinary environment variables are required");
//   }

//   return {
//     cloudName,
//     apiKey,
//     apiSecret,
//   };
// }

// function buildCloudinarySignature(params: Record<string, string>, apiSecret: string) {
//   const serialized = Object.entries(params)
//     .filter(([, value]) => Boolean(value))
//     .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
//     .map(([key, value]) => `${key}=${value}`)
//     .join("&");

//   return crypto.createHash("sha1").update(`${serialized}${apiSecret}`).digest("hex");
// }

// export async function uploadToCloudinary({buffer, fileName, mimeType, folder,}: CloudinaryUploadInput) {
//   const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
//   const timestamp = String(Math.floor(Date.now() / 1000));
//   const resolvedFolder = folder ?? uploadService.getTargetFolder("products");
//   const signature = buildCloudinarySignature(
//     {
//       folder: resolvedFolder,
//       timestamp,
//     },
//     apiSecret,
//   );

  // const formData = new FormData();
  // formData.append("file", new Blob([new Uint8Array(buffer)], { type: mimeType }), fileName);
  // formData.append("api_key", apiKey);
  // formData.append("timestamp", timestamp);
  // formData.append("folder", resolvedFolder);
  // formData.append("signature", signature);

  // const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
  //   method: "POST",
  //   body: formData,
  // });

  // if (!response.ok) {
  //   const message = await response.text();
  //   throw new Error(message || "Cloudinary upload failed");
  // }

  // const data = (await response.json()) as {
  //   secure_url: string;
  //   public_id: string;
  //   folder?: string;
  // };

  // return {
  //   url: data.secure_url,
  //   publicId: data.public_id,
  //   folder: data.folder ?? resolvedFolder,
  // };
// }

export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await AdminModel.findOne({ email });

  if (!admin) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.passwordHash);

  if (!isValid) {
    return null;
  }

  return admin;
}

function getAdminJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;

  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is required");
  }

  return secret;
}

export function signAdminToken(payload: { adminId: string; email: string; role: AdminRole }) {
  const secret = getAdminJwtSecret();
  const expiresIn = (process.env.ADMIN_JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"];

  return jwt.sign(payload, secret, {
    expiresIn,
  });
}

export function verifyAdminToken(token: string) {
  const secret = getAdminJwtSecret();

  return jwt.verify(token, secret) as {
    adminId: string;
    email: string;
    role: AdminRole;
    iat?: number;
    exp?: number;
  };
}