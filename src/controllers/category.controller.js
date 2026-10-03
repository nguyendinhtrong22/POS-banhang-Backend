import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service.js";

// Lấy danh sách Category
export const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();

    return res.status(200).json({
      message: "Lấy danh sách Category thành công",
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// Lấy Category theo ID
export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        message: "Không tìm thấy Category",
      });
    }

    return res.status(200).json({
      message: "Lấy Category thành công",
      data: category,
    });
  } catch (error) {
    console.error("Get category error:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// Thêm Category
export const create = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Tên Category không được để trống",
      });
    }

    const category = await createCategory({
      name: name.trim(),
      description,
    });

    return res.status(201).json({
      message: "Tạo Category thành công",
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Tên Category đã tồn tại",
      });
    }

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// Cập nhật Category
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Tên Category không được để trống",
      });
    }

    const existingCategory = await getCategoryById(id);

    if (!existingCategory) {
      return res.status(404).json({
        message: "Không tìm thấy Category",
      });
    }

    const category = await updateCategory(id, {
      name: name.trim(),
      description,
    });

    return res.status(200).json({
      message: "Cập nhật Category thành công",
      data: category,
    });
  } catch (error) {
    console.error("Update category error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Tên Category đã tồn tại",
      });
    }

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// Xóa Category
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCategory = await getCategoryById(id);

    if (!existingCategory) {
      return res.status(404).json({
        message: "Không tìm thấy Category",
      });
    }

    await deleteCategory(id);

    return res.status(200).json({
      message: "Xóa Category thành công",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};