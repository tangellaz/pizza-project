import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

type IgnorePrismaBuiltins<S extends string> = string extends S
  ? string
  : S extends ""
  ? S
  : S extends `$${infer T}`
  ? never
  : S;

export type PrismaModelName = IgnorePrismaBuiltins<keyof PrismaClient>;

export interface ColAndVal {
  col_name: string;
  value: string | number | boolean | object;
}

// Create dynamic for multi column
export const createDynamic = async (
  table: PrismaModelName,
  arr: ColAndVal[]
) => {
  // const dataObj = {}
  // arr.map((obj:{col_name:string;value:string|number}) => Object.assign(dataObj,{[obj.col_name]: obj.value}))
  const dataObj = arr.reduce(
    (accumObj, currObj) =>
      Object.assign(accumObj, { [currObj.col_name]: currObj.value }),
    {}
  );

  //@ts-ignore
  return await prisma[table]
    .create({
      data: dataObj,
    })
    .then((result: any) => result)
    .catch((err: any) => err);
};

// // Create many dynamic for multi column
// // Note: createMany is not supported in sqlite
// export const createManyDynamic = (table:PrismaModelName,arr:ColAndVal[][]) => {
//   arr.map(async(dataArray)=>await createDynamic(table,dataArray))
// }

// Create many dynamic for multi column
export const createManyDynamic = async (
  table: PrismaModelName,
  arr: ColAndVal[][]
) => {
  let dataObj: { [key: string]: string | number }[] = [];
  arr.map((entry) => {
    const entryObj = entry.reduce(
      (accumObj, currObj) =>
        Object.assign(accumObj, { [currObj.col_name]: currObj.value }),
      {}
    );
    dataObj.push(entryObj);
  });
  //@ts-ignore
  return await prisma[table]
    .createMany({ data: dataObj })
    .then((result: any) => result)
    .catch((err: any) => err);
};

// // Find records
// const toppings = await prisma.toppings.findMany()
// // console.log(prisma)
// console.log(toppings)

export const findAllDynamic = async (table: PrismaModelName) => {
  //@ts-ignore
  return await prisma[table]
    .findMany()
    .then((result: any) => result)
    .catch((err: any) => err);
};

export const findManyDynamic = async (
  table: PrismaModelName,
  where?: ColAndVal,
  select?: ColAndVal
) => {
  const criteria = select
    ? {
        select: { [select.col_name]: select.value },
        where: where ? { [where.col_name]: where.value } : {},
      }
    : { where: where ? { [where.col_name]: where.value } : {} };
  //@ts-ignore
  return await prisma[table]
    .findMany(criteria)
    .then((result: any) => result)
    .catch((err: any) => err);
};

// // Update record by unique field
export const updateDynamic = async (
  table: PrismaModelName,
  where: ColAndVal,
  data: ColAndVal
) => {
  //@ts-ignore
  return await prisma[table]
    .update({
      where: {
        [where.col_name]: where.value,
      },
      data: {
        [data.col_name]: data.value,
      },
    })
    .then((result: any) => console.log("updated", result))
    .catch((err: any) => console.log(err));
};
// // Update many. Might not need...
export const updateManyDynamic = async (
  table: PrismaModelName,
  where: ColAndVal,
  data: ColAndVal
) => {
  //@ts-ignore
  return await prisma[table]
    .updateMany({
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

// // Delete record on unique field
// const deleteTopping = await prisma.toppings.delete({
//   where: {
//     topping_id: 1,
//   },
// })
// console.log(toppings)

// // Delete record on unique field
export const deleteDynamic = async (
  table: PrismaModelName,
  where: ColAndVal
) => {
  //@ts-ignore
  return await prisma[table]
    .delete({
      where: {
        [where.col_name]: where.value,
      },
    })
    .then((result: any) => result)
    .catch((err: any) => err);
};

// // Delete records
export const deleteManyDynamic = async (
  table: PrismaModelName,
  where: ColAndVal
) => {
  //@ts-ignore
  return await prisma[table]
    .deleteMany({
      where: where ? { [where.col_name]: where.value } : {},
    })
    .then((result: any) => result)
    .catch((err: any) => err);
};

// // Delete records
// // Unused... DELETE FXN
export const deleteManyDynamica = async (
  table: PrismaModelName,
  whereCriteria: ColAndVal[]
) => {
  const dataObj = whereCriteria.reduce(
    (accumObj, currObj) =>
      Object.assign(accumObj, { [currObj.col_name]: currObj.value }),
    {}
  );
  //@ts-ignore
  return await prisma[table]
    .deleteMany({
      where: dataObj,
    })
    .then((result: any) => result)
    .catch((err: any) => err);
};

/* ----------------------------------------- */
/* ---------- Replacement methods ---------- */
/* ----------------------------------------- */

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
