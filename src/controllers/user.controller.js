import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile", authenticate, (req, res) => {
  return res.status(200).json({
    message: "Xác thực thành công",
    user: req.user,
  });
});

export default router;