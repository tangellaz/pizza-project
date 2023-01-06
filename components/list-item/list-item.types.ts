export type ListItemProps = {
  editItem: () => void;
  deleteItem: () => void;
  name: string;
  item: pizzaData | toppingData;
};
