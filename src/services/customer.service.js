import prisma from "../config/prisma.js";

export const createCustomer = async (data) => {
  return await prisma.customer.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
    },
  });
};

export const getAllCustomers = async () => {
  return await prisma.customer.findMany({
    orderBy: {
      id: "asc",
    },
  });
};

export const getCustomerById = async (id) => {
  return await prisma.customer.findUnique({
    where: {
      id: Number(id),
    },
  });
};

export const updateCustomer = async (id, data) => {
  return await prisma.customer.update({
    where: {
      id: Number(id),
    },
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
    },
  });
};

export const deleteCustomer = async (id) => {
  return await prisma.customer.delete({
    where: {
      id: Number(id),
    },
  });
};