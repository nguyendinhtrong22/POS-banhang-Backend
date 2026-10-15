
import prisma from "../config/prisma.js";

// Thêm sản phẩm vào giỏ hàng
export const addCartItem = async (userId, productId, quantity) => {
  const uid = Number(userId);
  const pid = Number(productId);
  const qty = Number(quantity);

  if (
    !Number.isInteger(uid) ||
    uid <= 0 ||
    !Number.isInteger(pid) ||
    pid <= 0 ||
    !Number.isInteger(qty) ||
    qty <= 0
  ) {
    throw new Error("Thông tin người dùng, sản phẩm hoặc số lượng không hợp lệ");
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Kiểm tra nhân viên
    const user = await tx.user.findUnique({
      where: { id: uid },
    });

    if (!user) {
      throw new Error("Không tìm thấy nhân viên");
    }

    // 2. Tìm hoặc tạo giỏ hàng
    let cart = await tx.cart.findUnique({
      where: { userId: uid },
    });

    if (!cart) {
      cart = await tx.cart.create({
        data: { userId: uid },
      });
    }

    // 3. Kiểm tra sản phẩm và tồn kho
    const product = await tx.product.findUnique({
      where: { id: pid },
      include: { inventory: true },
    });

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    if (!product.inventory) {
      throw new Error("Sản phẩm chưa có thông tin tồn kho");
    }

    // 4. Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = await tx.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: pid,
        },
      },
    });

    const newQuantity = (existingItem?.quantity ?? 0) + qty;

    if (newQuantity > product.inventory.quantity) {
      throw new Error(
        `Sản phẩm "${product.name}" không đủ tồn kho`
      );
    }

    // 5. Tạo mới hoặc cộng thêm số lượng
    return await tx.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: pid,
        },
      },
      create: {
        cartId: cart.id,
        productId: pid,
        quantity: qty,
      },
      update: {
        quantity: newQuantity,
      },
      include: {
        product: true,
      },
    });
  });
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (
  userId,
  cartItemId,
  quantity
) => {
  const uid = Number(userId);
  const itemId = Number(cartItemId);
  const qty = Number(quantity);

  if (
    !Number.isInteger(uid) ||
    uid <= 0 ||
    !Number.isInteger(itemId) ||
    itemId <= 0 ||
    !Number.isInteger(qty) ||
    qty <= 0
  ) {
    throw new Error("Thông tin đầu vào không hợp lệ");
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId: uid },
    },
    include: {
      product: {
        include: { inventory: true },
      },
    },
  });

  if (!item) {
    throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
  }

  if (
    !item.product.inventory ||
    qty > item.product.inventory.quantity
  ) {
    throw new Error("Số lượng vượt quá tồn kho hoặc chưa có thông tin tồn kho");
  }

  return await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: qty },
    include: { product: true },
  });
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeCartItem = async (userId, cartItemId) => {
  const uid = Number(userId);
  const itemId = Number(cartItemId);

  if (
    !Number.isInteger(uid) ||
    uid <= 0 ||
    !Number.isInteger(itemId) ||
    itemId <= 0
  ) {
    throw new Error("Thông tin đầu vào không hợp lệ");
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId: uid },
    },
  });

  if (!item) {
    throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return { message: "Xóa sản phẩm khỏi giỏ hàng thành công" };
};
