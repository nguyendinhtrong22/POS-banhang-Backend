import { createSale } from "../services/sales.service.js";

export const create = async (req, res) => {
  try {
    const {
      customerId,
      userId,
      items,
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!userId) {
      return res.status(400).json({
        message: "userId là bắt buộc",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Danh sách sản phẩm không được để trống",
      });
    }

    for (const item of items) {
      if (!item.productId || !item.quantity) {
        return res.status(400).json({
          message:
            "Mỗi sản phẩm phải có productId và quantity",
        });
      }

      if (Number(item.quantity) <= 0) {
        return res.status(400).json({
          message:
            "Số lượng sản phẩm phải lớn hơn 0",
        });
      }
    }

    const order = await createSale({
      customerId,
      userId,
      items,
    });

    res.status(201).json({
      message: "Bán hàng thành công",
      data: order,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};