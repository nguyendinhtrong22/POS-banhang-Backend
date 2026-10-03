import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";

// Lấy danh sách Product
export const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();

    return res.status(200).json({
      message: "Lấy danh sách Product thành công",
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// Lấy Product theo ID
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy Product",
      });
    }

    return res.status(200).json({
      message: "Lấy Product thành công",
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// Thêm Product
export const create = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      sku,
      categoryId,
    } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Tên Product không được để trống",
      });
    }

    if (!sku || sku.trim() === "") {
      return res.status(400).json({
        message: "SKU không được để trống",
      });
    }

    if (price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({
        message: "Giá Product không hợp lệ",
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        message: "categoryId không được để trống",
      });
    }

    const product = await createProduct({
      name: name.trim(),
      description,
      price: Number(price),
      sku: sku.trim(),
      categoryId: Number(categoryId),
    });

    return res.status(201).json({
      message: "Tạo Product thành công",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "SKU đã tồn tại",
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Category không tồn tại",
      });
    }

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
// Cập nhật Product
export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      sku,
      categoryId,
    } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Tên Product không được để trống",
      });
    }

    if (!sku || sku.trim() === "") {
      return res.status(400).json({
        message: "SKU không được để trống",
      });
    }

    if (price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({
        message: "Giá Product không hợp lệ",
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        message: "categoryId không được để trống",
      });
    }

    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Không tìm thấy Product",
      });
    }

    const product = await updateProduct(id, {
      name: name.trim(),
      description,
      price: Number(price),
      sku: sku.trim(),
      categoryId: Number(categoryId),
    });

    return res.status(200).json({
      message: "Cập nhật Product thành công",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "SKU đã tồn tại",
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Category không tồn tại",
      });
    }

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// Xóa Product
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Không tìm thấy Product",
      });
    }

    await deleteProduct(id);

    return res.status(200).json({
      message: "Xóa Product thành công",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};