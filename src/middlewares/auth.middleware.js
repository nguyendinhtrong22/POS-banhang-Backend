import { verifyToken } from "../utils/jwt.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token không tồn tại",
      });
    }

    const decoded = verifyToken(token);

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};