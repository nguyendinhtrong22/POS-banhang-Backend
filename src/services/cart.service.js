
import prisma from "../config/prisma.js";

// Lấy giỏ hàng theo userId
export const getCartByUserId = async (userId) => {
  const id = Number(userId);

  // Kiểm tra nhân viên có tồn tại không
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("Không tìm thấy nhân viên");
  }

  // Tìm giỏ hàng của nhân viên
  let cart = await prisma.cart.findUnique({
    where: { userId: id },
    include: {
      items: {
        include: {
          product: {
            include: {
              inventory: true,
            },
          },
        },
      },
    },
  });

  // Nếu chưa có thì tạo giỏ hàng mới
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                inventory: true,
              },
            },
          },
        },
      },
    });
  }

  // Tính tổng tiền tạm tính
  const totalAmount = cart.items.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  return {
    ...cart,
    totalAmount,
  };
};
