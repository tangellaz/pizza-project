import type { NextApiRequest, NextApiResponse } from "next";

import {
  findAll,
  findManyToppings,
  findManyPizzas,
  // findManyComponents,
} from "../../prisma/utils";

// const printData = async () => {
//   console.log("pizzas:\n", await findManyPizzas());
//   console.log("toppings:\n", await findManyToppings);
//   console.log("pizza_components:\n", await findManyComponents());
// };

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
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

    default:
      return res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
