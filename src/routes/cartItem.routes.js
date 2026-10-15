import express from "express";
import {
  addItem,
  updateItem,
  removeItem,
} from "../controllers/cartItem.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; // Import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, addItem);
router.put("/:id", authMiddleware, updateItem);
router.delete("/:id", authMiddleware, removeItem);

export default router;