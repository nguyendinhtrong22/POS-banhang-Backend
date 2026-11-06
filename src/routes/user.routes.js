import express from "express";
import { authMiddleware,
  authorizeRole
 } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Xác thực thành công",
    user: req.user,
  });
});
// API kiểm thử: chỉ ADMIN được truy cập
router.get(
  "/admin-test",
  authMiddleware,
  authorizeRole("ADMIN"),
  (req, res) => {
    return res.status(200).json({
      message: "Bạn có quyền ADMIN",
      user: req.user,
    });
  }
);

export default router;