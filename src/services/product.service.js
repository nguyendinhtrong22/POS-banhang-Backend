import prisma from "../config/prisma.js";

// Lấy danh sách Product
export const getAllProducts = async () => {
  return await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      id: "asc",
    },
  });
};

// Lấy Product theo ID
export const getProductById = async (id) => {
  return await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      category: true,
    },
  });
};

// Thêm Product
export const createProduct = async (data) => {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      sku: data.sku,
      categoryId: data.categoryId,
    },
    include: {
      category: true,
    },
  });
};

// Cập nhật Product
export const updateProduct = async (id, data) => {
  return await prisma.product.update({
    where: {
      id: Number(id),
    },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      sku: data.sku,
      categoryId: data.categoryId,
    },
    include: {
      category: true,
    },
  });
};

// Xóa Product
export const deleteProduct = async (id) => {
  return await prisma.product.delete({
    where: {
      id: Number(id),
    },
  });
};