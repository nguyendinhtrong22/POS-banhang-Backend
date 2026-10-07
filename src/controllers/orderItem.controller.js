import {
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByOrderId,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} from "../services/orderItem.service.js";

// Lấy danh sách chi tiết đơn hàng
export const getOrderItems = async (req, res) => {
  try {
    const orderItems = await getAllOrderItems();

    res.status(200).json({
      message: "Lấy danh sách chi tiết đơn hàng thành công",
      data: orderItems,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi khi lấy danh sách chi tiết đơn hàng",
      error: error.message,
    });
  }
};

// Lấy chi tiết đơn hàng theo ID
export const getOrderItem = async (req, res) => {
  try {
    const orderItem = await getOrderItemById(req.params.id);

    if (!orderItem) {
      return res.status(404).json({
        message: "Không tìm thấy chi tiết đơn hàng",
      });
    }

    res.status(200).json({
      message: "Lấy chi tiết đơn hàng thành công",
      data: orderItem,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi khi lấy chi tiết đơn hàng",
      error: error.message,
    });
  }
};

// Lấy chi tiết theo Order ID
export const getItemsByOrder = async (req, res) => {
  try {
    const orderItems = await getOrderItemsByOrderId(
      req.params.orderId
    );

    res.status(200).json({
      message: "Lấy danh sách sản phẩm trong đơn hàng thành công",
      data: orderItems,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi khi lấy chi tiết đơn hàng",
      error: error.message,
    });
  }
};

// Tạo chi tiết đơn hàng
export const create = async (req, res) => {
  try {
    const {
      orderId,
      productId,
      quantity,
      price,
    } = req.body;

    if (!orderId || !productId || !quantity || price === undefined) {
      return res.status(400).json({
        message:
          "orderId, productId, quantity và price là bắt buộc",
      });
    }

    const orderItem = await createOrderItem({
      orderId,
      productId,
      quantity,
      price,
    });

    res.status(201).json({
      message: "Tạo chi tiết đơn hàng thành công",
      data: orderItem,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi khi tạo chi tiết đơn hàng",
      error: error.message,
    });
  }
};

// Cập nhật chi tiết đơn hàng
export const update = async (req, res) => {
  try {
    const existingOrderItem = await getOrderItemById(
      req.params.id
    );

    if (!existingOrderItem) {
      return res.status(404).json({
        message: "Không tìm thấy chi tiết đơn hàng",
      });
    }

    const orderItem = await updateOrderItem(
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Cập nhật chi tiết đơn hàng thành công",
      data: orderItem,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi khi cập nhật chi tiết đơn hàng",
      error: error.message,
    });
  }
};

// Xóa chi tiết đơn hàng
export const remove = async (req, res) => {
  try {
    const existingOrderItem = await getOrderItemById(
      req.params.id
    );

    if (!existingOrderItem) {
      return res.status(404).json({
        message: "Không tìm thấy chi tiết đơn hàng",
      });
    }

    await deleteOrderItem(req.params.id);

    res.status(200).json({
      message: "Xóa chi tiết đơn hàng thành công",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi khi xóa chi tiết đơn hàng",
      error: error.message,
    });
  }
};