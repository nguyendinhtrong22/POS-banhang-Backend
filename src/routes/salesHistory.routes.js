import express from "express";
import {
  getSalesHistoryList,
  getSalesHistoryDetail,
} from "../controllers/salesHistory.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; // Import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getSalesHistoryList);
router.get("/:id", authMiddleware, getSalesHistoryDetail);

export default router;