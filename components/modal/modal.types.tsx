export type ModalProps = {
  show: boolean;
  closeModal: () => void;
  selectedPizza: pizzaData;
  selectedToppings?: toppingData[];
};
