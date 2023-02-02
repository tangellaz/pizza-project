import { mapToppings } from "../../lib/utils";

export type ModalProps = {
  show: boolean;
  closeModal: () => void;
  selectedPizza: pizzaData;
  selectedToppings?: toppingData[];
  availableToppings: toppingData[];
  // pizzas: pizzaData[]; //error handling
  // assembledPizzas?: mapToppings; //error handling
};
