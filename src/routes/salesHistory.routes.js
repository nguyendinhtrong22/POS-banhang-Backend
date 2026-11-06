import express from "express";
import {
  getSalesHistoryList,
  getSalesHistoryDetail,
  } from "../controllers/salesHistory.controller.js";

import { 
  authMiddleware,
  authorizeRole
 } from "../middlewares/auth.middleware.js"; 
const router = express.Router();

router.get("/", authMiddleware, authorizeRole("ADMIN", "STAFF"), getSalesHistoryList);
router.get("/:id", authMiddleware, authorizeRole("ADMIN", "STAFF"), getSalesHistoryDetail);

export default router;