import prisma from "./config/prisma.js";

async function testPrisma() {
  try {
    const user = await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@gmail.com",
        passwordHash: "123456",
        roleId: 1,
      },
    });

    console.log("User created:", user);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();