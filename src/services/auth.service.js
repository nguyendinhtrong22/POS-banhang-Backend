import prisma from "../config/prisma.js";
import { comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

export const loginService = async (username, password) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new Error("Username hoặc password không đúng");
  }

  const isPasswordCorrect = await comparePassword(
    password,
    user.passwordHash
  );

  if (!isPasswordCorrect) {
    throw new Error("Username hoặc password không đúng");
  }

  const token = generateToken({
    userId: user.id,
    role: user.role.name,
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
    },
  };
};