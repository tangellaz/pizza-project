import { rest } from "msw";

export const handlers = [
  rest.post("http://localhost:3000/api/users/owner", (req, res, ctx) => {
    // successful response
    return res(ctx.status(201), ctx.json({}));
  }),
  rest.get("http://localhost:3000/api/users/chef", (req, res, ctx) => {
    // successful response
    return res(
      ctx.status(200),
      ctx.json({
        toppings: [
          { topping_id: 1, topping_name: "pepperoni" },
          { topping_id: 3, topping_name: "sausage" },
          { topping_id: 22, topping_name: "balloons" },
          { topping_id: 23, topping_name: "barfaroni" },
          { topping_id: 2, topping_name: "cheese" },
        ],
        pizzas: [
          { pizza_id: 1, pizza_name: "pepperoni" },
          { pizza_id: 2, pizza_name: "cheese" },
          { pizza_id: 3, pizza_name: "meat lover" },
          { pizza_id: 15, pizza_name: "mypizza" },
        ],
        components: [
          { component_id: 61, pizza_id: 1, topping_id: 1 },
          { component_id: 62, pizza_id: 1, topping_id: 2 },
          { component_id: 63, pizza_id: 2, topping_id: 2 },
          { component_id: 64, pizza_id: 3, topping_id: 1 },
          { component_id: 65, pizza_id: 3, topping_id: 2 },
          { component_id: 66, pizza_id: 3, topping_id: 3 },
          { component_id: 102, pizza_id: 15, topping_id: 1 },
          { component_id: 103, pizza_id: 15, topping_id: 2 },
          { component_id: 104, pizza_id: 15, topping_id: 3 },
          { component_id: 105, pizza_id: 15, topping_id: 22 },
          { component_id: 106, pizza_id: 15, topping_id: 23 },
        ],
      })
    );
  }),
];
