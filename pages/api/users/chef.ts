import type { NextApiRequest, NextApiResponse } from "next";

import {
  toppingData,
  pizzaData,
  componentData,
  findAllDynamic,
  findManyDynamic,
  createDynamic,
  createManyDynamic,
  updateDynamic,
  updateManyDynamic,
  deleteDynamic,
  deleteManyDynamic,
  deleteManyDynamica,
} from "../../../prisma/utils";

const printData = async () => {
  console.log("pizzas:\n", await findAllDynamic("pizzas"));
  console.log("toppings:\n", await findAllDynamic("toppings"));
  console.log("pizza_components:\n", await findAllDynamic("pizza_components"));
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        // throw new Error('Random error') //Error testing
        const toppingsList = await findAllDynamic("toppings");
        const pizzasList = await findAllDynamic("pizzas");
        const pizzaComponents = await findAllDynamic("pizza_components");

        return res
          .status(200)
          .json({
            toppings: toppingsList,
            pizzas: pizzasList,
            components: pizzaComponents,
          });
      } catch (error) {
        return res.status(403).json({ error: "Error occured." });
      }

    case "POST":
      try {
        // throw new Error('Random error') //Error testing
        const data = req.body;
        if (data.pizza.pizza_id === -999) {
          const pizza: pizzaData = await createDynamic("pizzas", [
            { col_name: "pizza_name", value: data.pizza.pizza_name },
          ]);

          // data.toppings.map(async(topping:toppingData)=>
          //   await createDynamic('pizza_components',[
          //     {col_name:'pizza_id',value:pizza.pizza_id},
          //     {col_name:'topping_id',value:topping.topping_id}
          //   ])
          // )

          const relationArray = data.toppings.map((topping: toppingData) => [
            { col_name: "pizza_id", value: pizza.pizza_id },
            { col_name: "topping_id", value: topping.topping_id },
          ]);
          await createManyDynamic("pizza_components", relationArray);
        } else {
          await updateDynamic(
            "pizzas",
            { col_name: "pizza_id", value: data.pizza.pizza_id },
            { col_name: "pizza_name", value: data.pizza.pizza_name }
          );

          await deleteManyDynamic("pizza_components", {
            col_name: "pizza_id",
            value: data.pizza.pizza_id,
          });

          // data.toppings.map(async(topping:toppingData)=>
          //   console.log(await createDynamic('pizza_components',[
          //     {col_name:'pizza_id',value:data.pizza.pizza_id},
          //     {col_name:'topping_id',value:topping.topping_id}
          //   ])
          //   )
          // )
          const relationArray = data.toppings.map((topping: toppingData) => [
            { col_name: "pizza_id", value: data.pizza.pizza_id },
            { col_name: "topping_id", value: topping.topping_id },
          ]);
          await createManyDynamic("pizza_components", relationArray);
        }

        return res.status(201).json({});
      } catch (error) {
        return res.status(403).json({ error: "Error occured." });
      }

    case "DELETE":
      try {
        // throw new Error('Random error') //Error testing
        const data = req.body;
        await deleteDynamic("pizzas", {
          col_name: "pizza_id",
          value: data.pizza_id,
        });

        // throw new Error('Random error') //Error testing
        return res.status(200).json([]);
      } catch (error) {
        return res.status(403).json({ error: "Error occured." });
      }

    default:
      return res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
