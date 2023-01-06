import { useState, useEffect } from "react";
import styles from "./edit-topping.module.css";

import { handleRequest } from "../../lib/api"; //delete
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
  refreshData,
  toppings,
}: EditToppingProps) => {
  const [value, setValue] = useState<string>(topping.topping_name);
  const [btnAction, setBtnAction] = useState<string>(action);
  const [error, setError] = useState<string>("");

  const [editTopping] = useEditToppingMutation();

  useEffect(() => {
    topping.topping_name != "" ? setValue(topping.topping_name) : null;
  }, []);

  useEffect(() => {
    // if (value is not changed and not blank) OR (value is blank and not a new entry)
    // if((value===topping?.topping_name&&value!='')||(value===''&&topping?.topping_id!=-999)) {
    if (value === topping?.topping_name && value != "") {
      setBtnAction("cancel");
      setError("");
    } else if (value === "" && topping?.topping_id != -999) {
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
      // const res = await handleRequest('owner','POST',data)
      // if (res?res.ok:false) {
      //   setError('')
      //   setValue('')
      //   setEditToppingId(NaN)
      //   refreshData()
      // }
      await editTopping(data);
      setError("");
      setValue("");
      setEditToppingId(NaN);
    }
    // // if no change or blank, do not post
    // if(name != '' && name != toppingToSubmit.topping_name){
    //   const data = {
    //     topping_id: toppingToSubmit.topping_id,
    //     topping_name: name
    //   }
    //   await handleRequest('owner','POST',toppingToSubmit)
    //   setError('')
    //   refreshData()
    // }
    // // clean up
    // setValue('')
    // setEditToppingId(NaN)
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
