import { render, screen } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import EditTopping from "./edit-topping";
import { EditToppingProps } from "./edit-topping.types";
// import { server } from "../../mocks/api/server";
// import { rest } from "msw";

const Props: EditToppingProps = {
  topping: { topping_name: "pepperoni", topping_id: 0 },
  action: "add",
  setEditToppingId: jest.fn(),
  refreshData: jest.fn(),
  toppings: [
    { topping_name: "pepperoni", topping_id: 0 },
    { topping_name: "cheese", topping_id: 1 },
  ],
};

// const apiData = [
//   { topping_name: "pepperoni", topping_id: 0 },
//   { topping_name: "cheese", topping_id: 1 },
// ];

describe("EditTopping", () => {
  test("renders correctly", () => {
    // server.use(
    //   rest.get(`*`, (req, res, ctx) => {
    //     const arg = req.url.searchParams.getAll("page");
    //     console.log(arg);
    //     return res(ctx.json(apiData));
    //   })
    // );
    renderWithProviders(
      <EditTopping
        topping={Props.topping}
        action={Props.action}
        setEditToppingId={Props.setEditToppingId}
        refreshData={Props.refreshData}
        toppings={Props.toppings}
      />
    );
    const EditToppingInputValue = screen.getByRole("textbox");
    expect(EditToppingInputValue).toBeInTheDocument();
  });
});
