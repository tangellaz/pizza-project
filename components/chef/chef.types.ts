import { mapToppings } from "../../lib/utils";

export type ChefProps = {
  toppings: toppingData[];
  pizzas?: pizzaData[];
  assembledPizzas?: mapToppings;
};
