import type { NextApiRequest, NextApiResponse } from "next";

import {
  createTopping,
  findManyToppings,
  findManyComponents,
  updateTopping,
  deleteTopping,
  deleteManyPizzas,
} from "../../../prisma/utils";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    // GET Unused
    case "GET":
      try {
        // throw new Error('Random error') //Error testing
        const toppingsList = await findManyToppings();
        return res.status(200).json({ toppings: toppingsList });
      } catch (error) {
        return res.status(403).json({ error: "Error occured." });
      }

    case "POST":
      try {
        // throw new Error('Random error') //Error testing
        const data = req.body;
        // console.log(req.body)
        if (data.topping_id === -999) {
          await createTopping(data.topping_name);
        } else {
          await updateTopping(
            { col_name: "topping_id", value: data.topping_id },
            { col_name: "topping_name", value: data.topping_name }
          );
        }
        return res.status(201).json({});
      } catch (error) {
        return res.status(403).json({ error: "Error occured." });
      }

    case "DELETE":
      try {
        // throw new Error('Random error') //Error testing
        const data = req.body;

        // Find all pizzas containing topping
        const pizzaIds = await findManyComponents(
          { col_name: "topping_id", value: data.topping_id },
          { col_name: "pizza_id", value: true }
        );

        // convert list of pizza ids to list
        const pizzaIdsList = pizzaIds.map(
          (pizza: { pizza_id: number }) => pizza.pizza_id
        );

        await deleteManyPizzas({
          col_name: "pizza_id",
          value: { in: pizzaIdsList },
        });

        await deleteTopping({ topping_id: data.topping_id });

        return res.status(200).json([]);
      } catch (error) {
        return res.status(403).json({ error: "Error occured." });
      }

    default:
      return res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
