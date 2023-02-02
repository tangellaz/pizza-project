import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./modal.module.css";

import { useEditPizzaMutation } from "../../lib/api";
import { useAppSelector } from "../../redux/hooks";

import {
  pizzaNameExists,
  pizzaComboExists,
  titleCase,
  purgeWhitespace,
  isAlphaNumeric,
} from "../../lib/utils";

import { ModalProps } from "./modal.types";

const Modal = ({
  show,
  closeModal,
  selectedPizza,
  selectedToppings,
}: ModalProps) => {
  const assembledPizzas = useAppSelector((state) => state.assembledPizzas);
  const availableToppings = useAppSelector((state) => state.toppings);

  const pizzas = useAppSelector((state) => state.pizzas);
  const [editPizza] = useEditPizzaMutation();
  const [error, setError] = useState<string>("");

  // Utility Components
  const [isBrowser, setIsBrowser] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  let inputRef = useRef<HTMLInputElement>(null);

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    closeModal();
    setError("");
  };

  const overlayClickHandler = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (overlayRef.current == e.target) {
      closeModal();
      setError("");
    }
  };

  useEffect(() => {
    setIsBrowser(true);
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    const body = document.body;
    if (show) {
      setPizzaName(selectedPizza?.pizza_name); //set pizzaName on show. Remove text flicker.
      //@ts-ignore
      inputRef.current && inputRef.current.focus();
      body.style.overflowY = "hidden";
    } else {
      setPizzaName(""); //clear pizzaName on close. Remove text flicker.
      body.style.overflowY = "auto";
    }
  }, [show]);

  const [pizzaName, setPizzaName] = useState<string>("");
  useEffect(() => {
    setPizzaName(selectedPizza?.pizza_name);
  }, [selectedPizza]);

  useEffect(() => {
    if (pizzaNameExists(pizzas, selectedPizza, pizzaName)) {
      setError("Pizza name already exists");
    } else if (!isAlphaNumeric(pizzaName)) {
      setError("Pizza name can only contain alphanumerics");
      // } else if (pizzaName === '' && selectedPizza?.pizza_id != -999) {
      //   setError('Pizzas must have a name')
    } else {
      setError("");
    }
  }, [pizzaName]);

  // Data Handling Components
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // initialize data to send
    const data: { pizza: pizzaData; toppings: toppingData[] } = {
      pizza: { pizza_id: -999, pizza_name: "" },
      toppings: [],
    };

    // if to handle data type of e.target
    if (e.target instanceof HTMLFormElement) {
      const formData = new FormData(e.target);
      const entry = formData.entries();
      for (const [key, value] of entry) {
        /* key of type number is pizza name. Ex:
              key value
              1 pepperoni <-- pizza name
              pepperoni 1
              cheese 2
          */
        if (Number.isFinite(parseInt(key))) {
          data.pizza = {
            pizza_id: parseInt(key),
            pizza_name: purgeWhitespace(value.toString().toLowerCase()),
          };
        } else {
          data.toppings.push({
            topping_id: parseInt(value.toString()),
            topping_name: key.toLowerCase(),
          });
        }
      }
    }
    // Error handling
    if (pizzaNameExists(pizzas, selectedPizza, pizzaName)) {
      setError("Pizza name already exists");
    } else if (!isAlphaNumeric(pizzaName)) {
      setError("Pizza name can only contain alphanumerics");
    } else if (!data.pizza.pizza_name) {
      setError("Pizzas must have a name");
    } else if (data.toppings.length === 0) {
      setError("Pizzas must have toppings");
    } else if (pizzaComboExists(data, assembledPizzas)) {
      setError("Pizza already exists with selected toppings");
    } else {
      editPizza(data);
      setError("");
      // setPizzaName('')
      closeModal();
    }
  };

  if (isBrowser) {
    return ReactDOM.createPortal(
      show ? (
        <div
          className={styles.overlay}
          ref={overlayRef}
          onClick={(e) => overlayClickHandler(e)}
        >
          <div className={styles.card}>
            <button
              onClick={handleCloseClick}
              aria-label="close pop-up"
              title="close pop-up button"
            >
              <img
                src="/exit.svg"
                decoding="async"
                width="24"
                height="24"
                alt=""
              />
            </button>

            <form id="update-form" onSubmit={handleSubmit}>
              <label
                htmlFor={selectedPizza?.pizza_name}
                className={styles.nameInputLabel}
              >
                Pizza name:
                <input
                  type="text"
                  className={styles.nameInput}
                  id={selectedPizza?.pizza_name}
                  name={selectedPizza?.pizza_id.toString()}
                  ref={inputRef}
                  // defaultValue={titleCase(selectedPizza?.pizza_name)}
                  value={titleCase(pizzaName)}
                  onChange={(event) => setPizzaName(event.target.value)}
                />
              </label>
              {error ? (
                <p className={styles.error}>
                  <span>Error:</span>
                  <span>{error}</span>
                </p>
              ) : null}
              <fieldset>
                <legend>Select from available toppings:</legend>
                {availableToppings?.map((topping) => (
                  <div className={styles.selection} key={topping.topping_name}>
                    <label htmlFor={topping.topping_name}>
                      <input
                        type="checkbox"
                        defaultChecked={selectedToppings?.some(
                          (ele) => ele.topping_id === topping.topping_id
                        )}
                        name={topping.topping_name}
                        key={topping.topping_name + topping.topping_id}
                        id={topping.topping_name}
                        value={topping.topping_id}
                      />
                      <span>{titleCase(topping.topping_name)}</span>
                    </label>
                  </div>
                ))}
              </fieldset>
            </form>
            <button form="update-form" type="submit">
              {selectedPizza?.pizza_name ? "Update" : "Create"}
            </button>
          </div>
        </div>
      ) : null,
      document.getElementById("modal-root")!
    );
  } else {
    return null;
  }
};
export default Modal;
