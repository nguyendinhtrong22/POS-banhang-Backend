import express from "express";

import {
  getCustomers,
  getCustomer,
  create,
  update,
  remove,

} from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/", getCustomers);
router.get("/:id", getCustomer);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;