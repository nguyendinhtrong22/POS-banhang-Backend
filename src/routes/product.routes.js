import express from "express";

import {
  getProducts,
  getProduct,
  create,
  update,
  remove,
} from "../controllers/product.controller.js";

const router = express.Router();

// GET /api/products
router.get("/", getProducts);

// GET /api/products/:id
router.get("/:id", getProduct);

// POST /api/products
router.post("/", create);

// PUT /api/products/:id
router.put("/:id", update);

// DELETE /api/products/:id
router.delete("/:id", remove);

export default router;