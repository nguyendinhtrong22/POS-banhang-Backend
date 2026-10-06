import {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from "../services/customer.service.js"

// Lấy danh sách khách hàng
export const getCustomers = async (req, res) => {
  try {
    const customers = await getAllCustomers();

    res.status(200).json({
      customers,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// Lấy khách hàng theo ID
export const getCustomer = async (req, res) => {
  try {
    const customer = await getCustomerById(
      req.params.id
    );

    if (!customer) {
      return res.status(404).json({
        message: "Không tìm thấy khách hàng",
      });
    }

    res.status(200).json({
      customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi server",
    });
  }
};
// Tạo khách hàng mới
export const create = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Tên khách hàng là bắt buộc",
      });
    }

    const customer = await createCustomer({
      name,
      phone,
      email,
    });

    res.status(201).json({
      message: "Tạo khách hàng thành công",
      customer,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Số điện thoại đã tồn tại",
      });
    }

    res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// Cập nhật khách hàng
export const update = async (req, res) => {
  try {
    const existingCustomer =
      await getCustomerById(req.params.id);

    if (!existingCustomer) {
      return res.status(404).json({
        message: "Không tìm thấy khách hàng",
      });
    }

    const customer = await updateCustomer(
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Cập nhật khách hàng thành công",
      customer,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Số điện thoại đã tồn tại",
      });
    }

    res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// Xóa khách hàng
export const remove = async (req, res) => {
  try {
    const existingCustomer =
      await getCustomerById(req.params.id);

    if (!existingCustomer) {
      return res.status(404).json({
        message: "Không tìm thấy khách hàng",
      });
    }

    await deleteCustomer(req.params.id);

    res.status(200).json({
      message: "Xóa khách hàng thành công",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi server",
    });
  }
};