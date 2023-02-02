import type { NextApiRequest, NextApiResponse } from "next";

// all imports for ease of copy-paste
import {
  // createTopping,
  createPizza,
  // createManyToppings,
  // createManyPizzas,
  createManyComponents,
  findAll,
  findManyToppings,
  findManyPizzas,
  // findManyComponents,
  // updateTopping,
  updatePizza,
  // deleteTopping,
  // deletePizza,
  // deleteManyPizzas,
  deleteManyComponents,
} from "../../../prisma/utils";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    // GET unused
    case "GET":
      try {
        // throw new Error('Random error') //Error testing
        const toppingsList = await findManyToppings();
        const pizzasList = await findManyPizzas();

        const combinations = await findAll();

        // cleaning up nested objects from database
        const combinedList: combinedData = combinations.map(
          (link: {
            pizza_id: number;
            pizzas: { pizza_name: string };
            topping_id: number;
            toppings: { topping_name: string };
          }) => {
            return {
              pizza_id: link.pizza_id,
              pizza_name: link.pizzas.pizza_name,
              topping_id: link.topping_id,
              topping_name: link.toppings.topping_name,
            };
          }
        );

        return res.status(200).json({
          toppings: toppingsList,
          pizzas: pizzasList,
          combinedList: combinedList,
        });
      } catch (error) {
        return res.status(403).json({ error: "Error occured." });
      }

    case "POST":
      try {
        // throw new Error('Random error') //Error testing
        const data = req.body;
        if (data.pizza.pizza_id === -999) {
          // create new pizza to get pizza_id
          const pizza: pizzaData = await createPizza(data.pizza.pizza_name);

          // data.toppings.map(async(topping:toppingData)=>
          //   await createDynamic('pizza_components',[
          //     {col_name:'pizza_id',value:pizza.pizza_id},
          //     {col_name:'topping_id',value:topping.topping_id}
          //   ])
          // )

          // link toppings to pizza
          const relationArray = data.toppings.map((topping: toppingData) => ({
            pizza_id: pizza.pizza_id,
            topping_id: topping.topping_id,
          }));
          await createManyComponents(relationArray);
        } else {
          // updating

          await updatePizza(
            { col_name: "pizza_id", value: data.pizza.pizza_id },
            { col_name: "pizza_name", value: data.pizza.pizza_name }
          );

          await deleteManyComponents({
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

          // link toppings to pizza
          const relationArray = data.toppings.map((topping: toppingData) => ({
            pizza_id: data.pizza_id,
            topping_id: topping.topping_id,
          }));
          await createManyComponents(relationArray);
        }

        return res.status(201).json({});
      } catch (error) {
        return res.status(403).json({ error: "Error occured." });
      }

    case "DELETE":
      try {
        // throw new Error('Random error') //Error testing
        const data = req.body;
        await deletePizza({ pizza_id: data.pizza_id });

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
