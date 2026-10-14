import prisma from "../config/prisma.js";

export const createSale = async (data) => {
  const { customerId, userId, items } = data;

  return await prisma.$transaction(async (tx) => {
    // 1. Kiểm tra User
    const user = await tx.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      throw new Error("Không tìm thấy nhân viên");
    }

    // 2. Kiểm tra Customer nếu có
    if (customerId !== undefined && customerId !== null) {
      const customer = await tx.customer.findUnique({
        where: {
          id: Number(customerId),
        },
      });

      if (!customer) {
        throw new Error("Không tìm thấy khách hàng");
      }
    }

    let totalAmount = 0;
    const orderItems = [];

    // 3. Kiểm tra từng sản phẩm
    for (const item of items) {
      const product = await tx.product.findUnique({
        where: {
          id: Number(item.productId),
        },
        include: {
          inventory: true,
        },
      });

      if (!product) {
        throw new Error(
          `Không tìm thấy sản phẩm ID ${item.productId}`
        );
      }

      // 4. Kiểm tra tồn kho
      if (!product.inventory) {
        throw new Error(
          `Sản phẩm "${product.name}" chưa có thông tin tồn kho`
        );
      }

      if (product.inventory.quantity < Number(item.quantity)) {
        throw new Error(
          `Sản phẩm "${product.name}" không đủ tồn kho`
        );
      }
      // 5. Tính tiền
      const quantity = Number(item.quantity);
      const price = Number(product.price);

      const itemTotal = price * quantity;

      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity,
        price: product.price,
      });
    }

    // 6. Tạo Order
    const order = await tx.order.create({
      data: {
        customerId:
          customerId !== undefined && customerId !== null
            ? Number(customerId)
            : null,

        userId: Number(userId),

        totalAmount,

        status: "COMPLETED",
      },
    });

    // 7. Tạo OrderItem + trừ tồn kho
    for (const item of orderItems) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
      });

      await tx.inventory.update({
        where: {
          productId: item.productId,
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // 8. Lấy lại Order đầy đủ thông tin
    return await tx.order.findUnique({
      where: {
        id: order.id,
      },
      include: {
        customer: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  });
};