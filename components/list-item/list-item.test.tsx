import { render, screen } from "@testing-library/react";
import ListItem from "./list-item";
import { ListItemProps } from "./list-item.types";

const Props: ListItemProps = {
  editItem: jest.fn(),
  deleteItem: jest.fn(),
  name: "Pepperoni",
  item: { topping_name: "pepperoni", topping_id: 0 },
};

describe("ListItem render:", () => {
  test("span item label renders correctly", () => {
    render(
      <ListItem
        editItem={Props.editItem}
        deleteItem={Props.deleteItem}
        name={Props.name}
        item={Props.item}
      />
    );
    const ItemLabel = screen.getByText(Props.name);
    expect(ItemLabel).toBeInTheDocument();
    expect(ItemLabel).toHaveTextContent(Props.name);
  });

  test("Edit button renders correctly", () => {
    render(
      <ListItem
        editItem={Props.editItem}
        deleteItem={Props.deleteItem}
        name={Props.name}
        item={Props.item}
      />
    );
    const EditButton = screen.getByLabelText(/edit/i);
    expect(EditButton).toBeInTheDocument();
  });

  test("Edit button img renders correctly", () => {
    render(
      <ListItem
        editItem={Props.editItem}
        deleteItem={Props.deleteItem}
        name={Props.name}
        item={Props.item}
      />
    );
    const EditButtonImg = screen.getByAltText(/edit/i);
    expect(EditButtonImg).toBeInTheDocument();
  });

  test("Delete button renders correctly", () => {
    render(
      <ListItem
        editItem={Props.editItem}
        deleteItem={Props.deleteItem}
        name={Props.name}
        item={Props.item}
      />
    );
    const DeleteButton = screen.getByLabelText(/delete/i);
    expect(DeleteButton).toBeInTheDocument();
  });

  test("Edit button img renders correctly", () => {
    render(
      <ListItem
        editItem={Props.editItem}
        deleteItem={Props.deleteItem}
        name={Props.name}
        item={Props.item}
      />
    );
    const DeleteButtonImg = screen.getByAltText(/delete/i);
    expect(DeleteButtonImg).toBeInTheDocument();
  });
});
