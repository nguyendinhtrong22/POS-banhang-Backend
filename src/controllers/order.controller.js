import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/order.service.js";

// Lấy danh sách đơn hàng
export const getOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();

    res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công",
      data: orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};

// Lấy đơn hàng theo ID
export const getOrder = async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.status(200).json({
      message: "Lấy thông tin đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi khi lấy đơn hàng",
      error: error.message,
    });
  }
};

// Tạo đơn hàng
export const create = async (req, res) => {
  try {
    const {
      customerId,
      userId,
      totalAmount,
      status,
    } = req.body;

    if (!userId || totalAmount === undefined) {
      return res.status(400).json({
        message: "userId và totalAmount là bắt buộc",
      });
    }

    const order = await createOrder({
      customerId,
      userId,
      totalAmount,
      status,
    });

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi khi tạo đơn hàng",
      error: error.message,
    });
  }
};

// Cập nhật đơn hàng
export const update = async (req, res) => {
  try {
    const existingOrder = await getOrderById(req.params.id);

    if (!existingOrder) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    const order = await updateOrder(
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Cập nhật đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi khi cập nhật đơn hàng",
      error: error.message,
    });
  }
};

// Xóa đơn hàng
export const remove = async (req, res) => {
  try {
    const existingOrder = await getOrderById(req.params.id);

    if (!existingOrder) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    await deleteOrder(req.params.id);

    res.status(200).json({
      message: "Xóa đơn hàng thành công",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi khi xóa đơn hàng",
      error: error.message,
    });
  }
};