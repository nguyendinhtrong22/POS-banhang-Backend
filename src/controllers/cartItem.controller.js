import {
  addCartItem,
  updateCartItem,
  removeCartItem,
} from "../services/cartItem.service.js";

// Thêm sản phẩm vào giỏ hàng
export const addItem = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Không xác định được nhân viên đăng nhập",
      });
    }

    const { productId, quantity } = req.body;

    const item = await addCartItem(userId, productId, quantity);

    return res.status(201).json({
      message: "Thêm sản phẩm vào giỏ hàng thành công",
      item,
    });
  } catch (error) {
    console.error("Lỗi thêm sản phẩm:", error);

    const status = error.message.includes("Không tìm thấy") ? 404 : 400;

    return res.status(status).json({
      message: error.message || "Lỗi khi thêm sản phẩm vào giỏ hàng",
    });
  }
};

// Cập nhật số lượng sản phẩm
export const updateItem = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Không xác định được nhân viên đăng nhập",
      });
    }

    const { quantity } = req.body;
    const item = await updateCartItem(userId, req.params.id, quantity);

    return res.status(200).json({
      message: "Cập nhật số lượng thành công",
      item,
    });
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error);

    const status = error.message.includes("Không tìm thấy") ? 404 : 400;

    return res.status(status).json({
      message: error.message || "Lỗi khi cập nhật sản phẩm",
    });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeItem = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Không xác định được nhân viên đăng nhập",
      });
    }

    const result = await removeCartItem(userId, req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error);

    const status = error.message.includes("Không tìm thấy") ? 404 : 400;

    return res.status(status).json({
      message: error.message || "Lỗi khi xóa sản phẩm khỏi giỏ hàng",
    });
  }
};