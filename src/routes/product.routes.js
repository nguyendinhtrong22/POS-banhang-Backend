
import express from "express";

import {
  getProducts,
  getProduct,
  create,
  update,
  remove,
} from "../controllers/product.controller.js";

import {
  authMiddleware,
  authorizeRole,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// ADMIN và STAFF: xem danh sách sản phẩm
router.get(
  "/",
  authMiddleware,
  authorizeRole("ADMIN", "STAFF"),
  getProducts
);

// ADMIN và STAFF: xem chi tiết sản phẩm
router.get(
  "/:id",
  authMiddleware,
  authorizeRole("ADMIN", "STAFF"),
  getProduct
);

// Chỉ ADMIN: thêm sản phẩm
router.post(
  "/",
  authMiddleware,
  authorizeRole("ADMIN"),
  create
);

// Chỉ ADMIN: cập nhật sản phẩm
router.put(
  "/:id",
  authMiddleware,
  authorizeRole("ADMIN"),
  update
);

// Chỉ ADMIN: xóa sản phẩm
router.delete(
  "/:id",
  authMiddleware,
  authorizeRole("ADMIN"),
  remove
);

export default router;
