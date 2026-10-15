import prisma from "../config/prisma.js";

// Lấy danh sách lịch sử bán hàng
export const getSalesHistory = async () => {
  const orders = await prisma.order.findMany({
    where: {
      status: "COMPLETED",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return orders;
};

// Xem chi tiết đơn hàng theo ID
export const getSalesHistoryById = async (orderId) => {
  const id = Number(orderId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID đơn hàng không hợp lệ");
  }

  const order = await prisma.order.findFirst({
    where: {
      id,
      status: "COMPLETED",
    },
    include: {
      customer: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Không tìm thấy đơn hàng đã hoàn thành");
  }

  return order;
};