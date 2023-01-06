import { useState, useEffect } from "react";
import styles from "./edit-topping.module.css";

import { useEditToppingMutation } from "../../lib/api";

import {
  toppingExists,
  titleCase,
  purgeWhitespace,
  isAlphaNumeric,
} from "../../lib/utils";

import { EditToppingProps } from "./edit-topping.types";

const EditTopping = ({
  topping,
  action,
  setEditToppingId,
  toppings,
}: EditToppingProps) => {
  const [value, setValue] = useState<string>(topping.topping_name);
  const [btnAction, setBtnAction] = useState<string>(action);
  const [error, setError] = useState<string>("");

  const [editTopping] = useEditToppingMutation();

  useEffect(() => {
    topping.topping_name != "" ? setValue(topping.topping_name) : null;

    const cancel = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBtnAction(action);
        setError("");
        setValue("");
        setEditToppingId(NaN);
      }
    };
    window.addEventListener("keydown", cancel);
    return () => window.removeEventListener("keydown", cancel);
  }, []);

  useEffect(() => {
    if (value.toLowerCase() === topping?.topping_name && value != "") {
      // value is not changed and not blank
      setBtnAction("cancel");
      setError("");
    } else if (value === "" && topping?.topping_id != -999) {
      // value is blank and not a new entry
      setBtnAction("cancel");
      setError("Topping must have a name");
    } else if (!isAlphaNumeric(value)) {
      setBtnAction("cancel");
      setError("Topping name can only contain alphanumerics");
    } else {
      setBtnAction(action);
      setError("");
    }
  }, [value]);

  const handleSubmit = async (toppingToSubmit: toppingData, name: string) => {
    if (btnAction === "cancel") {
      setBtnAction(action);
      setError("");
      setValue("");
      setEditToppingId(NaN);
    } else if (name === "") {
      setError("Topping must have a name");
      setBtnAction("cancel");
    } else if (toppingExists(toppings, toppingToSubmit, name)) {
      setError("Topping already exists");
      setBtnAction("cancel");
    } else {
      const data = {
        topping_id: toppingToSubmit.topping_id,
        topping_name: purgeWhitespace(name.toLowerCase()),
      };
      await editTopping(data);
      setError("");
      setValue("");
      setEditToppingId(NaN);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <input
          type="text"
          id={topping?.topping_name}
          name={topping?.topping_id.toString()}
          // defaultValue={topping?.topping_name}
          value={titleCase(value)}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => {
            e.key === "Enter"
              ? handleSubmit(topping, value ? value : topping?.topping_name)
              : null;
          }}
        />
        <button
          className={styles.actionBtn}
          onClick={() => {
            handleSubmit(topping, value ? value : topping?.topping_name);
          }}
          aria-label={btnAction}
          title={btnAction}
        >
          {
            <img
              src={btnAction === "cancel" ? `/exit.svg` : `/${action}.svg`}
              decoding="async"
              width="24"
              height="24"
              alt={btnAction}
            />
          }
        </button>
      </div>
      {error ? (
        <p className={styles.error}>
          <span>Error:</span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
};
export default EditTopping;
