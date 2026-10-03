import express from "express";

import {
  getCategories,
  getCategory,
  create,
  update,
  remove,
} from "../controllers/category.controller.js";

const router = express.Router();

// GET /api/categories
router.get("/", getCategories);

// GET /api/categories/:id
router.get("/:id", getCategory);

// POST /api/categories
router.post("/", create);

// PUT /api/categories/:id
router.put("/:id", update);

// DELETE /api/categories/:id
router.delete("/:id", remove);

export default router;