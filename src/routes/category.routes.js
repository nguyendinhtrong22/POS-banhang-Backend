import express from "express";

import {
  getCategories,
  getCategory,
  create,
  update,
  remove,
} from "../controllers/category.controller.js";

import {
  authMiddleware,
  authorizeRole,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// ADMIN và STAFF: xem danh sách danh mục
router.get(
  "/",
  authMiddleware,
  authorizeRole("ADMIN", "STAFF"),
  getCategories
);

// ADMIN và STAFF: xem chi tiết danh mục
router.get(
  "/:id",
  authMiddleware,
  authorizeRole("ADMIN", "STAFF"),
  getCategory
);

// Chỉ ADMIN: tạo danh mục
router.post(
  "/",
  authMiddleware,
  authorizeRole("ADMIN"),
  create
);

// Chỉ ADMIN: cập nhật danh mục
router.put(
  "/:id",
  authMiddleware,
  authorizeRole("ADMIN"),
  update
);

// Chỉ ADMIN: xóa danh mục
router.delete(
  "/:id",
  authMiddleware,
  authorizeRole("ADMIN"),
  remove
);

export default router;
