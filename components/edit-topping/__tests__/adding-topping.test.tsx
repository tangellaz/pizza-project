import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils";
import EditTopping from "../edit-topping";
import { EditToppingProps } from "../edit-topping.types";

const Props: EditToppingProps = {
  topping: { topping_name: "", topping_id: -999 },
  action: "add",
  setEditToppingId: jest.fn(),
  refreshData: jest.fn(),
  toppings: [
    { topping_name: "pepperoni", topping_id: 0 },
    { topping_name: "cheese", topping_id: 1 },
  ],
};

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
        refreshData={Props.refreshData}
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
        refreshData={Props.refreshData}
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
        refreshData={Props.refreshData}
        toppings={Props.toppings}
      />
    );
    const EditToppingImgAdd = screen.queryByAltText("add");
    expect(EditToppingImgAdd).toBeInTheDocument();

    const EditToppingImgCancel = screen.queryByAltText("cancel");
    expect(EditToppingImgCancel).not.toBeInTheDocument();

    const EditToppingImgSave = screen.queryByAltText("save");
    expect(EditToppingImgSave).not.toBeInTheDocument();
  });

  test("error message does not render", () => {
    renderWithProviders(
      <EditTopping
        topping={Props.topping}
        action={Props.action}
        setEditToppingId={Props.setEditToppingId}
        refreshData={Props.refreshData}
        toppings={Props.toppings}
      />
    );
    const ErrorMessage = screen.queryByText("Error:");
    expect(ErrorMessage).not.toBeInTheDocument();
  });
});

describe("EditTopping actions:", () => {
  test("adding a topping", async () => {
    user.setup();
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
    await user.type(EditToppingInputValue, "queso");
    expect(EditToppingInputValue).toHaveValue("Queso");

    const EditToppingButtonImg = screen.queryByAltText("add");
    expect(EditToppingButtonImg).toBeInTheDocument();

    const EditToppingButton = screen.getByRole("button");
    await user.click(EditToppingButton);

    const ErrorMessage = screen.queryByText("Error:");
    expect(ErrorMessage).not.toBeInTheDocument();

    // expect(EditToppingInputValue).toHaveValue("");
  });

  test("adding same topping", async () => {
    user.setup();
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
    await user.type(EditToppingInputValue, "cheese");
    expect(EditToppingInputValue).toHaveValue("Cheese");

    const EditToppingImgAdd = screen.queryByAltText("add");
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

  test("adding blank topping", async () => {
    user.setup();
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
    expect(EditToppingInputValue).toHaveValue("");

    const EditToppingImgAdd = screen.queryByAltText("add");
    expect(EditToppingImgAdd).toBeInTheDocument();

    const EditToppingButton = screen.getByRole("button");
    await user.click(EditToppingButton);

    const ErrorLabel = screen.queryByText("Error:");
    expect(ErrorLabel).toBeInTheDocument();
    const ErrorMessage = screen.queryByText("Topping must have a name");
    expect(ErrorMessage).toBeInTheDocument();

    const EditToppingImgCancel = screen.queryByAltText("cancel");
    expect(EditToppingImgCancel).toBeInTheDocument();

    await user.click(EditToppingButton);
    expect(EditToppingInputValue).toHaveValue("");
  });

  test("adding non-alphanumeric topping", async () => {
    user.setup();
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
    await user.type(EditToppingInputValue, "cheese!");
    expect(EditToppingInputValue).toHaveValue("Cheese!");

    const EditToppingImgAdd = screen.queryByAltText("add");
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
