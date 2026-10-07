import express from "express";

import {
  getOrderItems,
  getOrderItem,
  getItemsByOrder,
  create,
  update,
  remove,
} from "../controllers/orderItem.controller.js";

const router = express.Router();

router.get("/", getOrderItems);

router.get("/order/:orderId", getItemsByOrder);

router.get("/:id", getOrderItem);

router.post("/", create);

router.put("/:id", update);

router.delete("/:id", remove);

export default router;