import { mapToppings } from "../../lib/utils";

export type ChefProps = {
  toppings: toppingData[];
  pizzas?: pizzaData[];
  refreshData: () => void;
  assembledPizzas?: mapToppings;
  loading: boolean;
};
