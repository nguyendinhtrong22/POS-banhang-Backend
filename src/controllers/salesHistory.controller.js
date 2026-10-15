import {
  getSalesHistory,
  getSalesHistoryById,
} from "../services/salesHistory.service.js";

// Lấy danh sách lịch sử bán hàng
export const getSalesHistoryList = async (req, res) => {
  try {
    const orders = await getSalesHistory();

    return res.status(200).json({
      message: "Lấy lịch sử bán hàng thành công",
      total: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Lỗi lấy lịch sử bán hàng:", error);

    return res.status(500).json({
      message: "Lỗi server khi lấy lịch sử bán hàng",
    });
  }
};

// Xem chi tiết đơn hàng
export const getSalesHistoryDetail = async (req, res) => {
  try {
    const order = await getSalesHistoryById(req.params.id);

    return res.status(200).json({
      message: "Lấy chi tiết đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết đơn hàng:", error);

    const status = error.message.includes("Không tìm thấy")
      ? 404
      : 400;

    return res.status(status).json({
      message: error.message || "Lỗi khi lấy chi tiết đơn hàng",
    });
  }
};