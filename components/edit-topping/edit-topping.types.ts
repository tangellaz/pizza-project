export type EditToppingProps = {
  topping: toppingData;
  action: "save" | "add";
  setEditToppingId: React.Dispatch<React.SetStateAction<number>>;
  refreshData: () => void;
  toppings: toppingData[]; //error handling
};
