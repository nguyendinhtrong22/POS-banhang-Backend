
import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../src/config/prisma.js";

async function main() {
  console.log("===== BẮT ĐẦU SEED DỮ LIỆU POS =====");

  // 1. Tạo vai trò nếu chưa tồn tại
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "Quản trị viên hệ thống",
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: "STAFF" },
    update: {},
    create: {
      name: "STAFF",
      description: "Nhân viên bán hàng",
    },
  });

  // 2. Tạo tài khoản nếu chưa tồn tại.
  // Tài khoản hiện có được giữ nguyên, bao gồm mật khẩu và vai trò.
  const passwordHash = await bcrypt.hash("123456", 10);

  async function ensureUser({ username, email, roleId }) {
    const byUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (byUsername) return byUsername;

    const byEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (byEmail) return byEmail;

    return prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        roleId,
      },
    });
  }

  const admin = await ensureUser({
    username: "admin@gmail.com",
    email: "admin@gmail.com",
    roleId: adminRole.id,
  });

  const staff = await ensureUser({
    username: "staff01",
    email: "staff01@pos.local",
    roleId: staffRole.id,
  });

  console.log("Admin:", admin.email);
  console.log("Nhân viên:", staff.email);

  // 3. Tạo danh mục
  const categoryData = [
    {
      name: "Đồ uống",
      description: "Nước giải khát và nước đóng chai",
    },
    {
      name: "Đồ ăn nhanh",
      description: "Các loại mì và đồ ăn nhanh",
    },
    {
      name: "Bánh kẹo",
      description: "Bánh quy và đồ ăn vặt",
    },
  ];

  const categories = {};

  for (const data of categoryData) {
    categories[data.name] = await prisma.category.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
  }

  // 4. Tạo sản phẩm và tồn kho
  const productData = [
    {
      name: "Nước Ngọt Pepsi Lon 330ml",
      description: "Nước giải khát có gas Pepsi",
      price: "12000",
      sku: "PEPSI-330ML",
      categoryName: "Đồ uống",
      quantity: 50,
    },
    {
      name: "Coca-Cola Lon 330ml",
      description: "Nước giải khát Coca-Cola",
      price: "10000",
      sku: "COCA-330ML",
      categoryName: "Đồ uống",
      quantity: 40,
    },
    {
      name: "Nước Suối 500ml",
      description: "Nước uống đóng chai 500ml",
      price: "7000",
      sku: "NUOC-SUOI-500",
      categoryName: "Đồ uống",
      quantity: 100,
    },
    {
      name: "Mì Ăn Liền",
      description: "Mì ăn liền gói",
      price: "5000",
      sku: "MI-GOI-001",
      categoryName: "Đồ ăn nhanh",
      quantity: 30,
    },
    {
      name: "Bánh Quy",
      description: "Bánh quy đóng gói",
      price: "20000",
      sku: "BANH-QUY-001",
      categoryName: "Bánh kẹo",
      quantity: 25,
    },
  ];

  const products = {};

  for (const data of productData) {
    const product = await prisma.product.upsert({
      where: { sku: data.sku },
      update: {},
      create: {
        name: data.name,
        description: data.description,
        price: data.price,
        sku: data.sku,
        categoryId: categories[data.categoryName].id,
      },
    });

    products[data.sku] = product;

    // Chỉ tạo tồn kho khi sản phẩm chưa có bản ghi tồn kho.
    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        quantity: data.quantity,
      },
    });
  }

  // 5. Tạo khách hàng
  const customerData = [
    {
      name: "Nguyễn Văn An",
      phone: "0901000001",
      email: "an@example.com",
    },
    {
      name: "Trần Thị Bình",
      phone: "0901000002",
      email: "binh@example.com",
    },
    {
      name: "Lê Văn Cường",
      phone: "0901000003",
      email: "cuong@example.com",
    },
  ];

  const customers = {};

  for (const data of customerData) {
    customers[data.phone] = await prisma.customer.upsert({
      where: { phone: data.phone },
      update: {},
      create: data,
    });
  }

  // 6. Tạo giỏ hàng cho nhân viên
  const cart = await prisma.cart.upsert({
    where: { userId: staff.id },
    update: {},
    create: { userId: staff.id },
  });

  const cartItems = [
    { sku: "PEPSI-330ML", quantity: 2 },
    { sku: "NUOC-SUOI-500", quantity: 1 },
  ];

  for (const item of cartItems) {
    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: products[item.sku].id,
        },
      },
      update: {},
      create: {
        cartId: cart.id,
        productId: products[item.sku].id,
        quantity: item.quantity,
      },
    });
  }

  // 7. Tạo đơn hàng mẫu nếu chưa có đơn tương ứng.
  // Không cập nhật tồn kho tại đây để tránh thay đổi số lượng hiện có.
  async function ensureSampleOrder({ customer, items }) {
    const orderItems = items.map((item) => ({
      productId: products[item.sku].id,
      quantity: item.quantity,
      price: products[item.sku].price,
    }));

    // Tính tổng từ giá thực tế trong database,
    // tránh sai tổng tiền nếu sản phẩm đã tồn tại với giá khác.
    const total = orderItems.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);

    const existingOrders = await prisma.order.findMany({
      where: {
        userId: admin.id,
        customerId: customer.id,
        status: "COMPLETED",
      },
      include: { items: true },
    });

    const orderExists = existingOrders.some((order) => {
      if (Number(order.totalAmount) !== total) return false;
      if (order.items.length !== orderItems.length) return false;

      return orderItems.every((expected) =>
        order.items.some(
          (actual) =>
            actual.productId === expected.productId &&
            actual.quantity === expected.quantity &&
            Number(actual.price) === Number(expected.price)
        )
      );
    });

    if (orderExists) {
      console.log(
        `Đơn hàng mẫu của ${customer.name} đã tồn tại, bỏ qua.`
      );
      return;
    }

    await prisma.order.create({
      data: {
        userId: admin.id,
        customerId: customer.id,
        totalAmount: String(total),
        status: "COMPLETED",
        items: {
          create: orderItems,
        },
      },
    });

    console.log(`Đã tạo đơn hàng mẫu cho ${customer.name}.`);
  }

  await ensureSampleOrder({
    customer: customers["0901000001"],
    items: [
      { sku: "PEPSI-330ML", quantity: 2 },
      { sku: "NUOC-SUOI-500", quantity: 1 },
    ],
  });

  await ensureSampleOrder({
    customer: customers["0901000002"],
    items: [
      { sku: "COCA-330ML", quantity: 3 },
      { sku: "BANH-QUY-001", quantity: 1 },
    ],
  });

  console.log("===== SEED DỮ LIỆU POS HOÀN TẤT =====");
}

main()
  .catch((error) => {
    console.error("Lỗi seed dữ liệu:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
