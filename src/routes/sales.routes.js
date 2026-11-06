import express from "express";

import {
  create,
} from "../controllers/sales.controller.js";

import {
  authMiddleware,
  authorizeRole,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// ADMIN và STAFF: thực hiện bán hàng
router.post(
  "/",
  authMiddleware,
  authorizeRole("ADMIN", "STAFF"),
  create
);
export default router;