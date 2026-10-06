import prisma from "../config/prisma.js";

// Lấy danh sách đơn hàng
export const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      customer: true,
      user: true,
      items: true,
    },
    orderBy: {
      id: "asc",
    },
  });
};

// Lấy đơn hàng theo ID
export const getOrderById = async (id) => {
  return await prisma.order.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      customer: true,
      user: true,
      items: true,
    },
  });
};

// Tạo đơn hàng
export const createOrder = async (data) => {
  return await prisma.order.create({
    data: {
      customerId:
        data.customerId !== undefined && data.customerId !== null
          ? Number(data.customerId)
          : null,

      userId: Number(data.userId),

      totalAmount: data.totalAmount,

      status: data.status || "PENDING",
    },
    include: {
      customer: true,
      user: true,
      items: true,
    },
  });
};

// Cập nhật đơn hàng
export const updateOrder = async (id, data) => {
  return await prisma.order.update({
    where: {
      id: Number(id),
    },
    data: {
      customerId:
        data.customerId !== undefined
          ? data.customerId === null
            ? null
            : Number(data.customerId)
          : undefined,

      userId:
        data.userId !== undefined
          ? Number(data.userId)
          : undefined,

      totalAmount:
        data.totalAmount !== undefined
          ? data.totalAmount
          : undefined,

      status:
        data.status !== undefined
          ? data.status
          : undefined,
    },
    include: {
      customer: true,
      user: true,
      items: true,
    },
  });
};

// Xóa đơn hàng
export const deleteOrder = async (id) => {
  return await prisma.order.delete({
    where: {
      id: Number(id),
    },
  });
};