// Run this file using >npx ts-node script.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type ColAndVal = {
  col_name: string;
  value: string | number | boolean | object;
};

async function main() {
  // Add record function
  const createTopping = async (topping: string) => {
    return await prisma.toppings
      .create({
        data: {
          topping_name: topping,
        },
      })
      .then((result: any) => console.log("result", result))
      .catch((err: any) => console.log(err));
  };
  // createTopping('BlehBleh')

  const createPizza = async (pizza: string) => {
    return await prisma.pizzas
      .create({
        data: {
          pizza_name: pizza,
        },
      })
      .then((result: any) => console.log("result", result))
      .catch((err: any) => console.log(err));
  };
  // createPizza('pepperoni')

  const createManyToppings = async (dataObj: { topping_name: string }[]) => {
    return await prisma.toppings
      .createMany({ data: dataObj })
      .then((result: any) => result)
      .catch((err: any) => err);
  };
  // console.log(
  //   await createManyToppings([
  //     { topping_name: "pepperoni" },
  //     { topping_name: "sausage" },
  //   ])
  // );

  const createManyPizzas = async (dataObj: { pizza_name: string }[]) => {
    return await prisma.pizzas
      .createMany({ data: dataObj })
      .then((result: any) => result)
      .catch((err: any) => err);
  };
  // console.log(
  //   await createManyPizzas([
  //     { pizza_name: "pepperoni" },
  //     { pizza_name: "meat lover" },
  //   ])
  // );

  const createManyComponents = async (
    dataObj: { pizza_id: number; topping_id: number }[]
  ) => {
    return await prisma.pizza_components
      .createMany({ data: dataObj })
      .then((result: any) => console.log("created", result))
      .catch((err: any) => console.log(err));
  };
  // console.log(
  //   await createManyComponents([
  //     {
  //       pizza_id: 1,
  //       topping_id: 1,
  //     },
  //     {
  //       pizza_id: 1,
  //       topping_id: 2,
  //     },
  //     {
  //       pizza_id: 2,
  //       topping_id: 2,
  //     },
  //     {
  //       pizza_id: 3,
  //       topping_id: 1,
  //     },
  //     {
  //       pizza_id: 3,
  //       topping_id: 2,
  //     },
  //     {
  //       pizza_id: 3,
  //       topping_id: 3,
  //     },
  //   ])
  // );
  console.log(
    await createManyComponents([
      {
        pizza_id: 3,
        topping_id: 3,
      },
      {
        pizza_id: 3,
        topping_id: 39,
      },
    ])
  );

  const findAll = async () => {
    return await prisma.pizza_components
      .findMany({
        where: {},
        include: {
          pizzas: true,
          toppings: true,
        },
      })
      .then((result: any) => result)
      .catch((err: any) => err);
  };
  console.log("findAll", await findAll());

  const findManyToppings = async () => {
    return await prisma.toppings
      .findMany()
      .then((result: any) => result)
      .catch((err: any) => err);
  };
  // console.log(await findManyToppings());

  const findManyPizzas = async () => {
    return await prisma.pizzas
      .findMany()
      .then((result: any) => result)
      .catch((err: any) => err);
  };
  // console.log(await findManyPizzas());

  const findManyComponents = async (where: ColAndVal, select: ColAndVal) => {
    const criteria = {
      select: { [select.col_name]: select.value },
      where: { [where.col_name]: where.value },
    };

    return await prisma.pizza_components
      .findMany(criteria)
      .then((result: any) => result)
      .catch((err: any) => err);
  };
  // console.log(await findManyComponents(
  //   { col_name: "topping_id", value: 1 },
  //   { col_name: "pizza_id", value: true })
  // );

  const updateTopping = async (where: ColAndVal, data: ColAndVal) => {
    return await prisma.toppings
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
  // console.log(
  //   updateTopping(
  //     { col_name: "topping_id", value: 1 },
  //     { col_name: "topping_name", value: "bleh" }
  //   )
  // );

  const updatePizza = async (where: ColAndVal, data: ColAndVal) => {
    return await prisma.pizzas
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
  // console.log(await updatePizza(
  //   { col_name: "pizza_id", value: 1 },
  //   { col_name: "pizza_name", value: "bleh" }
  // ))

  const deleteTopping = async (where: { topping_id: number }) => {
    return await prisma.toppings
      .delete({
        where: where,
      })
      .then((result: any) => console.log("deleted", result))
      .catch((err: any) => console.log(err));
  };
  // console.log(await deleteTopping({ topping_id: 34 }));

  const deletePizza = async (where: { pizza_id: number }) => {
    return await prisma.pizzas
      .delete({
        where: where,
      })
      .then((result: any) => console.log("deleted", result))
      .catch((err: any) => console.log(err));
  };
  // console.log(await deletePizza({ pizza_id: 1 }));

  // // Delete records
  const deleteManyPizzas = async (where?: ColAndVal) => {
    return await prisma.pizzas
      .deleteMany({
        where: where ? { [where.col_name]: where.value } : {},
      })
      .then((result: any) => console.log("deleted", result))
      .catch((err: any) => console.log(err));
  };
  // console.log(
  //   await deleteManyPizzas({
  //     col_name: "pizza_id",
  //     value: { in: [1, 2, 3] },
  //   })
  // );

  const deleteManyComponents = async (where?: ColAndVal) => {
    return await prisma.pizza_components
      .deleteMany({
        where: where ? { [where.col_name]: where.value } : {},
      })
      .then((result: any) => console.log("deleted", result))
      .catch((err: any) => console.log(err));
  };
  // console.log(
  //   await deleteManyComponents({
  //     col_name: "pizza_id",
  //     value: { in: [1] },
  //   })
  // );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
