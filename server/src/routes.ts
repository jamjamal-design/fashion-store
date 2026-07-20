import { upload } from "./middleware/upload";
import { Router } from "express";
import {
  adminController,
  categoryController,
  loginAdminController,
  orderController,
  productController,
  uploadCloudinaryController,
  publicProductController,
  publicCategoryController,
} from "./controllers";
import { authenticateAdmin, requireAdminRole } from "./middleware";

export function createApiRouter() {
  const router = Router();

  router.get("/health", (_, response) => {
    response.json({ ok: true });
  });

  // ── Public Routes (no auth) ──
  router.get("/public/products", publicProductController.list);
  router.get("/public/products/featured", publicProductController.getFeatured);
  router.get("/public/products/category/:category", publicProductController.getByCategory);
  router.get("/public/products/slug/:slug", publicProductController.getBySlug);

  router.get("/public/categories", publicCategoryController.list);
  router.get("/public/categories/slug/:slug", publicCategoryController.getBySlug);

  // ── Auth Routes ──
  router.post("/admin/login", loginAdminController);
  router.post("/uploads/cloudinary", authenticateAdmin, upload.array("images", 10), uploadCloudinaryController);

  // ── Admin: Products (authenticated) ──
  router.route("/products").get(authenticateAdmin, productController.list).post(authenticateAdmin, productController.create);
  router
    .route("/products/:id")
    .get(authenticateAdmin, productController.getById)
    .patch(authenticateAdmin, productController.update)
    .delete(authenticateAdmin, productController.remove);

  // ── Admin: Categories (authenticated) ──
  router.route("/categories").get(authenticateAdmin, categoryController.list).post(authenticateAdmin, categoryController.create);
  router
    .route("/categories/:id")
    .get(authenticateAdmin, categoryController.getById)
    .patch(authenticateAdmin, categoryController.update)
    .delete(authenticateAdmin, categoryController.remove);

  // ── Admin: Orders (authenticated) ──
  router.route("/orders").get(authenticateAdmin, orderController.list).post(authenticateAdmin, orderController.create);
  router
    .route("/orders/:id")
    .get(authenticateAdmin, orderController.getById)
    .patch(authenticateAdmin, orderController.update)
    .delete(authenticateAdmin, orderController.remove);

  // ── Admin: Admin users (owner only) ──
  router
    .route("/admins")
    .get(authenticateAdmin, requireAdminRole(["owner"]), adminController.list)
    .post(authenticateAdmin, requireAdminRole(["owner"]), adminController.create);
  router
    .route("/admins/:id")
    .get(authenticateAdmin, requireAdminRole(["owner"]), adminController.getById)
    .patch(authenticateAdmin, requireAdminRole(["owner"]), adminController.update)
    .delete(authenticateAdmin, requireAdminRole(["owner"]), adminController.remove);

  return router;
}