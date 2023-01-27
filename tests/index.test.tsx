import Home from "../pages/index";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";

import { propType } from "../lib/utils";

const Props = {
  toppings: [
    { topping_id: 1, topping_name: "pepperoni" },
    { topping_id: 2, topping_name: "cheese" },
    { topping_id: 3, topping_name: "sausage" },
  ],
  pizzas: [
    { pizza_id: 1, pizza_name: "pepperoni" },
    { pizza_id: 2, pizza_name: "cheese" },
    { pizza_id: 3, pizza_name: "meat lover" },
  ],
  components: [
    { component_id: 1, pizza_id: 1, topping_id: 1 },
    { component_id: 2, pizza_id: 1, topping_id: 2 },
    { component_id: 3, pizza_id: 2, topping_id: 2 },
    { component_id: 4, pizza_id: 3, topping_id: 1 },
    { component_id: 5, pizza_id: 3, topping_id: 2 },
    { component_id: 6, pizza_id: 3, topping_id: 3 },
  ],
};

describe("Home page", () => {
  test("Title renders", () => {
    renderWithProviders(Home(Props));
    const H1Tag = screen.getByRole("heading", { level: 1 });
    expect(H1Tag).toBeInTheDocument();
  });
});
