import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

interface ColAndVal {
  col_name: string;
  value: string | number | boolean | object;
}

// Add record function
export const createTopping = async (topping: string) => {
  return await prisma.toppings
    .create({
      data: {
        topping_name: topping,
      },
    })
    .then((result: any) => result)
    .catch((err: any) => err);
};

export const createPizza = async (pizza: string) => {
  return await prisma.pizzas
    .create({
      data: {
        pizza_name: pizza,
      },
    })
    .then((result: any) => result)
    .catch((err: any) => err);
};

export const createManyToppings = async (
  dataObj: { topping_name: string }[]
) => {
  return await prisma.toppings
    .createMany({ data: dataObj })
    .then((result: any) => result)
    .catch((err: any) => err);
};

export const createManyPizzas = async (dataObj: { pizza_name: string }[]) => {
  return await prisma.pizzas
    .createMany({ data: dataObj })
    .then((result: any) => result)
    .catch((err: any) => err);
};

export const createManyComponents = async (
  dataObj: { pizza_id: number; topping_id: number }[]
) => {
  return await prisma.pizza_components
    .createMany({ data: dataObj })
    .then((result: any) => result)
    .catch((err: any) => err);
};

export const findAll = async () => {
  return await prisma.pizza_components
    .findMany({
      where: {},
      include: {
        pizzas: { select: { pizza_name: true } },
        toppings: { select: { topping_name: true } },
      },
    })
    .then((result: any) => result)
    .catch((err: any) => err);
};

export const findManyToppings = async () => {
  return await prisma.toppings
    .findMany()
    .then((result: any) => result)
    .catch((err: any) => err);
};

export const findManyPizzas = async () => {
  return await prisma.pizzas
    .findMany()
    .then((result: any) => result)
    .catch((err: any) => err);
};

// Unused
export const findManyComponents = async (
  where: ColAndVal,
  select: ColAndVal
) => {
  const criteria = {
    select: { [select.col_name]: select.value },
    where: { [where.col_name]: where.value },
  };

  return await prisma.pizza_components
    .findMany(criteria)
    .then((result: any) => result)
    .catch((err: any) => err);
};

export const updateTopping = async (where: ColAndVal, data: ColAndVal) => {
  return await prisma.toppings
    .update({
      where: {
        [where.col_name]: where.value,
      },
      data: {
        [data.col_name]: data.value,
      },
    })
    .then((result: any) => result)
    .catch((err: any) => err);
};

export const updatePizza = async (where: ColAndVal, data: ColAndVal) => {
  return await prisma.pizzas
    .update({
      where: {
        [where.col_name]: where.value,
      },
      data: {
        [data.col_name]: data.value,
      },
    })
    .then((result: any) => result)
    .catch((err: any) => err);
};

export const deleteTopping = async (where: { topping_id: number }) => {
  return await prisma.toppings
    .delete({
      where: where,
    })
    .then((result: any) => result)
    .catch((err: any) => err);
};

export const deletePizza = async (where: { pizza_id: number }) => {
  return await prisma.pizzas
    .delete({
      where: where,
    })
    .then((result: any) => result)
    .catch((err: any) => err);
};

// // Delete records
export const deleteManyPizzas = async (where?: ColAndVal) => {
  return await prisma.pizzas
    .deleteMany({
      where: where ? { [where.col_name]: where.value } : {},
    })
    .then((result: any) => result)
    .catch((err: any) => err);
};

export const deleteManyComponents = async (where?: ColAndVal) => {
  return await prisma.pizza_components
    .deleteMany({
      where: where ? { [where.col_name]: where.value } : {},
    })
    .then((result: any) => result)
    .catch((err: any) => err);
};
