import bcrypt from "bcrypt";
import prisma from "../src/config/prisma.js";

const seed = async () => {
  const passwordHash = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: {
      email: "admin@gmail.com",
    },
    update: {
      passwordHash,
    },
    create: {
      username: "admin@gmail.com",
      email: "admin@gmail.com",
      passwordHash,
      roleId: 1,
    },
  });

  console.log("Tạo tài khoản thành công:", user.email);
};

seed()
  .catch((error) => {
    console.error("Seed lỗi:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });