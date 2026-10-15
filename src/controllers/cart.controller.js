
import { getCartByUserId } from "../services/cart.service.js";

// Lấy giỏ hàng của người dùng
export const getCart = async (req, res) => {
  try {
    // Lấy userId từ thông tin xác thực JWT
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Không xác định được người dùng",
      });
    }

    const cart = await getCartByUserId(userId);

    return res.status(200).json({
      message: "Lấy giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    console.error("Lỗi lấy giỏ hàng:", error);

    return res.status(500).json({
      message: "Lỗi khi lấy giỏ hàng",
    });
  }
};
