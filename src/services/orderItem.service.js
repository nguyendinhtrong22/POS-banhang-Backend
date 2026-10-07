import prisma from "../config/prisma.js";

// Lấy tất cả chi tiết đơn hàng
export const getAllOrderItems = async () => {
  return await prisma.orderItem.findMany({
    include: {
      order: true,
      product: true,
    },
    orderBy: {
      id: "asc",
    },
  });
};

// Lấy chi tiết đơn hàng theo ID
export const getOrderItemById = async (id) => {
  return await prisma.orderItem.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      order: true,
      product: true,
    },
  });
};

// Lấy các sản phẩm trong một đơn hàng
export const getOrderItemsByOrderId = async (orderId) => {
  return await prisma.orderItem.findMany({
    where: {
      orderId: Number(orderId),
    },
    include: {
      product: true,
    },
    orderBy: {
      id: "asc",
    },
  });
};

// Tạo chi tiết đơn hàng
export const createOrderItem = async (data) => {
  return await prisma.orderItem.create({
    data: {
      orderId: Number(data.orderId),
      productId: Number(data.productId),
      quantity: Number(data.quantity),
      price: data.price,
    },
    include: {
      order: true,
      product: true,
    },
  });
};

// Cập nhật chi tiết đơn hàng
export const updateOrderItem = async (id, data) => {
  return await prisma.orderItem.update({
    where: {
      id: Number(id),
    },
    data: {
      productId:
        data.productId !== undefined
          ? Number(data.productId)
          : undefined,

      quantity:
        data.quantity !== undefined
          ? Number(data.quantity)
          : undefined,

      price:
        data.price !== undefined
          ? data.price
          : undefined,
    },
    include: {
      order: true,
      product: true,
    },
  });
};

// Xóa chi tiết đơn hàng
export const deleteOrderItem = async (id) => {
  return await prisma.orderItem.delete({
    where: {
      id: Number(id),
    },
  });
};