import type { Request, Response } from "express";
import {
  adminService,
  categoryService,
  orderService,
  productService,
  signAdminToken,
  uploadToCloudinary,
  verifyAdminCredentials,
  publicProductService,
  publicCategoryService,
} from "../services";

type CrudService = {
  list: () => unknown;
  getById: (id: string) => unknown;
  create: (payload: unknown) => unknown;
  update: (id: string, payload: unknown) => unknown;
  remove: (id: string) => unknown;
};

function createCrudController(service: CrudService) {
  function serializeRecord(record: unknown) {
    if (!record || typeof record !== "object") {
      return record;
    }

    const plainRecord = record as Record<string, unknown> & { toObject?: () => Record<string, unknown> };
    const source = typeof plainRecord.toObject === "function" ? plainRecord.toObject() : plainRecord;
    const { _id, __v, ...rest } = source;

    return {
      id: String(_id ?? source.id ?? ""),
      ...rest,
    };
  }

  function serializeMany(records: unknown) {
    return Array.isArray(records) ? records.map(serializeRecord) : serializeRecord(records);
  }

  return {
    async list(_: Request, response: Response) {
      const records = await service.list();
      response.json(serializeMany(records));
    },
    async getById(request: Request, response: Response) {
      const record = await service.getById(String(request.params.id));
      response.json(serializeRecord(record));
    },
    async create(request: Request, response: Response) {
      const record = await service.create(request.body);
      response.status(201).json(serializeRecord(record));
    },
    async update(request: Request, response: Response) {
      const record = await service.update(String(request.params.id), request.body);
      response.json(serializeRecord(record));
    },
    async remove(request: Request, response: Response) {
      const record = await service.remove(String(request.params.id));
      response.json(serializeRecord(record));
    },
  };
}

export const adminController = createCrudController(adminService);
export const categoryController = createCrudController(categoryService);
export const productController = createCrudController(productService);
export const orderController = createCrudController(orderService);

// ── Public Controllers (no auth required) ──

export const publicProductController = {
  async list(request: Request, response: Response) {
    const { category, featured, search } = request.query;
    const filters: { category?: string; featured?: boolean; search?: string } = {};

    if (typeof category === "string") filters.category = category;
    if (featured === "true") filters.featured = true;
    if (typeof search === "string") filters.search = search;

    const records = await publicProductService.list(filters);
    response.json(records.map(serializeProduct));
  },

  async getBySlug(request: Request, response: Response) {
    const record = await publicProductService.getBySlug(String(request.params.slug));
    if (!record) {
      response.status(404).json({ message: "Product not found" });
      return;
    }
    response.json(serializeProduct(record));
  },

  async getFeatured(request: Request, response: Response) {
    const limit = Number(request.query.limit) || 4;
    const records = await publicProductService.getFeatured(limit);
    response.json(records.map(serializeProduct));
  },

  async getByCategory(request: Request, response: Response) {
    const records = await publicProductService.getByCategory(String(request.params.category));
    response.json(records.map(serializeProduct));
  },
};

export const publicCategoryController = {
  async list(_: Request, response: Response) {
    const records = await publicCategoryService.list();
    response.json(records.map(serializeCategory));
  },

  async getBySlug(request: Request, response: Response) {
    const record = await publicCategoryService.getBySlug(String(request.params.slug));
    if (!record) {
      response.status(404).json({ message: "Category not found" });
      return;
    }
    response.json(serializeCategory(record));
  },
};

function serializeProduct(record: unknown) {
  if (!record || typeof record !== "object") return record;

  const plainRecord = record as Record<string, unknown> & { toObject?: () => Record<string, unknown> };
  const source = typeof plainRecord.toObject === "function" ? plainRecord.toObject() : plainRecord;
  const { _id, __v, ...rest } = source;

  return {
    id: String(_id ?? source.id ?? ""),
    ...rest,
  };
}

function serializeCategory(record: unknown) {
  if (!record || typeof record !== "object") return record;

  const plainRecord = record as Record<string, unknown> & { toObject?: () => Record<string, unknown> };
  const source = typeof plainRecord.toObject === "function" ? plainRecord.toObject() : plainRecord;
  const { _id, __v, ...rest } = source;

  return {
    id: String(_id ?? source.id ?? ""),
    ...rest,
  };
}

// ── Auth Controller ──

export async function loginAdminController(request: Request, response: Response) {
  const { email, password } = request.body ?? {};

  if (!email || !password) {
    response.status(400).json({ message: "Email and password are required" });
    return;
  }

  const admin = await verifyAdminCredentials(email, password);

  if (!admin) {
    response.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = signAdminToken({
    adminId: String(admin._id),
    email: admin.email,
    role: admin.role,
  });

  response.json({
    token,
    admin: {
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
    },
  });
}

// ── Upload Controller (multiple images) ──

export async function uploadCloudinaryController(
  request: Request,
  response: Response
) {
  const files = request.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    response.status(400).json({
      message: "Images are required",
    });
    return;
  }

  const folder = request.body.folder;

  const results = [];

  for (const file of files) {
    const result = await uploadToCloudinary({
      buffer: file.buffer,
      fileName: file.originalname,
      folder,
    });

    results.push(result);
  }

  response.status(201).json({
    images: results,
  });
}