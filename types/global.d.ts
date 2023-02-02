export {};

declare global {
  type toppingData = { topping_id: number; topping_name: string };
  type pizzaData = { pizza_id: number; pizza_name: string };
  type componentData = {
    pizza_id: number | null;
    topping_id: number | null;
  };
  type combinedData = toppingData & pizzaData;

  type propType = {
    toppings: toppingData[];
    pizzas: pizzaData[];
    combinedList: combinedData[];
  };

  type mapToppings = {
    [key: string]: toppingData[];
  };
}
