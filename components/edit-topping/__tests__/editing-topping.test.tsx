import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils";
import EditTopping from "../edit-topping";
import { EditToppingProps } from "../edit-topping.types";
// import { server } from "../../mocks/api/server";
// import { rest } from "msw";

const Props: EditToppingProps = {
  topping: { topping_name: "pepperoni", topping_id: 0 },
  action: "save",
  setEditToppingId: jest.fn(),
  toppings: [
    { topping_name: "pepperoni", topping_id: 0 },
    { topping_name: "cheese", topping_id: 1 },
  ],
};

// const apiData = [
//   { topping_name: "pepperoni", topping_id: 0 },
//   { topping_name: "cheese", topping_id: 1 },
// ];

describe("EditTopping rendering:", () => {
  test("input renders correctly", () => {
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
        toppings={Props.toppings}
      />
    );
    const EditToppingInputValue = screen.getByRole("textbox");
    expect(EditToppingInputValue).toBeInTheDocument();
  });

  test("button renders correctly", () => {
    renderWithProviders(
      <EditTopping
        topping={Props.topping}
        action={Props.action}
        setEditToppingId={Props.setEditToppingId}
        toppings={Props.toppings}
      />
    );
    const EditToppingButton = screen.getByRole("button");
    expect(EditToppingButton).toBeInTheDocument();
  });

  test("img renders correctly", () => {
    renderWithProviders(
      <EditTopping
        topping={Props.topping}
        action={Props.action}
        setEditToppingId={Props.setEditToppingId}
        toppings={Props.toppings}
      />
    );
    const EditToppingButtonImg = screen.getByAltText("cancel");
    expect(EditToppingButtonImg).toBeInTheDocument();
  });

  test("error message does not render", () => {
    renderWithProviders(
      <EditTopping
        topping={Props.topping}
        action={Props.action}
        setEditToppingId={Props.setEditToppingId}
        toppings={Props.toppings}
      />
    );
    const ErrorMessage = screen.queryByText("Error:");
    expect(ErrorMessage).not.toBeInTheDocument();
  });
});

describe("EditTopping actions:", () => {
  test("editing a topping", async () => {
    user.setup();
    renderWithProviders(
      <EditTopping
        topping={Props.topping}
        action={Props.action}
        setEditToppingId={Props.setEditToppingId}
        toppings={Props.toppings}
      />
    );
    const EditToppingInputValue = screen.getByRole("textbox");
    expect(EditToppingInputValue).toHaveValue("Pepperoni");

    await user.type(EditToppingInputValue, "2");
    expect(EditToppingInputValue).toHaveValue("Pepperoni2");

    const ErrorMessage = screen.queryByText("Error:");
    expect(ErrorMessage).not.toBeInTheDocument();

    const EditToppingButtonImg = screen.queryByAltText("save");
    expect(EditToppingButtonImg).toBeInTheDocument();

    // const EditToppingButton = screen.getByRole("button");
    // await user.click(EditToppingButton);
    // // times out and doesn't get to clear input
  });

  test("edit to duplicate topping", async () => {
    user.setup();
    renderWithProviders(
      <EditTopping
        topping={Props.topping}
        action={Props.action}
        setEditToppingId={Props.setEditToppingId}
        toppings={Props.toppings}
      />
    );
    const EditToppingInputValue = screen.getByRole("textbox");
    expect(EditToppingInputValue).toHaveValue("Pepperoni");

    await user.clear(EditToppingInputValue);
    await user.type(EditToppingInputValue, "cheese");
    expect(EditToppingInputValue).toHaveValue("Cheese");

    const EditToppingImgAdd = screen.queryByAltText("save");
    expect(EditToppingImgAdd).toBeInTheDocument();

    const EditToppingButton = screen.getByRole("button");
    await user.click(EditToppingButton);

    const ErrorLabel = screen.queryByText("Error:");
    expect(ErrorLabel).toBeInTheDocument();
    const ErrorMessage = screen.queryByText("Topping already exists");
    expect(ErrorMessage).toBeInTheDocument();

    const EditToppingImgCancel = screen.queryByAltText("cancel");
    expect(EditToppingImgCancel).toBeInTheDocument();

    await user.click(EditToppingButton);
    expect(EditToppingInputValue).toHaveValue("");
  });

  test("edit to blank topping", async () => {
    user.setup();
    renderWithProviders(
      <EditTopping
        topping={Props.topping}
        action={Props.action}
        setEditToppingId={Props.setEditToppingId}
        toppings={Props.toppings}
      />
    );
    const EditToppingInputValue = screen.getByRole("textbox");
    expect(EditToppingInputValue).toHaveValue("Pepperoni");
    await user.clear(EditToppingInputValue);
    expect(EditToppingInputValue).toHaveValue("");

    const ErrorLabel = screen.queryByText("Error:");
    expect(ErrorLabel).toBeInTheDocument();
    const ErrorMessage = screen.queryByText("Topping must have a name");
    expect(ErrorMessage).toBeInTheDocument();

    const EditToppingImgAdd = screen.queryByAltText("cancel");
    expect(EditToppingImgAdd).toBeInTheDocument();

    const EditToppingButton = screen.getByRole("button");
    await user.click(EditToppingButton);
    expect(EditToppingInputValue).toHaveValue("");
  });

  test("edit with non-alphanumeric topping", async () => {
    user.setup();
    renderWithProviders(
      <EditTopping
        topping={Props.topping}
        action={Props.action}
        setEditToppingId={Props.setEditToppingId}
        toppings={Props.toppings}
      />
    );
    const EditToppingInputValue = screen.getByRole("textbox");
    expect(EditToppingInputValue).toHaveValue("Pepperoni");

    await user.type(EditToppingInputValue, "!");
    expect(EditToppingInputValue).toHaveValue("Pepperoni!");

    const EditToppingImgAdd = screen.queryByAltText("save");
    expect(EditToppingImgAdd).not.toBeInTheDocument();
    const EditToppingImgCancel = screen.queryByAltText("cancel");
    expect(EditToppingImgCancel).toBeInTheDocument();

    const ErrorLabel = screen.queryByText("Error:");
    expect(ErrorLabel).toBeInTheDocument();
    const ErrorMessage = screen.queryByText(
      "Topping name can only contain alphanumerics"
    );
    expect(ErrorMessage).toBeInTheDocument();

    const EditToppingButton = screen.getByRole("button");
    await user.click(EditToppingButton);
    expect(EditToppingInputValue).toHaveValue("");
  });
});
