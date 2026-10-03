import prisma from "../config/prisma.js";

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      id: "asc",
    },
  });
};

export const getCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: {
      id: Number(id),
    },
  });
};

export const createCategory = async (data) => {
  return await prisma.category.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });
};

export const updateCategory = async (id, data) => {
  return await prisma.category.update({
    where: {
      id: Number(id),
    },
    data: {
      name: data.name,
      description: data.description,
    },
  });
};

export const deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: {
      id: Number(id),
    },
  });
};