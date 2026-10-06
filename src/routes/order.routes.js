import express from "express";

import {
  getOrders,
  getOrder,
  create,
  update,
  remove,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", getOrders);

router.get("/:id", getOrder);

router.post("/", create);

router.put("/:id", update);

router.delete("/:id", remove);

export default router;