export type EditToppingProps = {
  topping: toppingData;
  action: "save" | "add" | "cancel";
  setEditToppingId: React.Dispatch<React.SetStateAction<number>>;
};
