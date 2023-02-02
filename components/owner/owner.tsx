import React, { useState, useEffect } from "react";
import Image from "next/image";
import ListItem from "../list-item/list-item";
import EditTopping from "../edit-topping/edit-topping";
import styles from "../UserComponent.module.css";

import { useDeleteToppingMutation } from "../../lib/api";
import { useAppSelector } from "../../redux/hooks";

import { handleRequest } from "../../lib/api";
import { titleCase } from "../../lib/utils";

const Owner = () => {
  const toppings = useAppSelector((state) => state.toppings);
  const [toppingSelect, setToppingSelect] = useState<toppingData[]>();
  const [editToppingId, setEditToppingId] = useState<number>(NaN);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const [deleteTopping] = useDeleteToppingMutation();

  const handleDeleteTopping = async (toppingToDelete: toppingData) => {
    if (
      confirmDelete ||
      window.confirm(
        "Caution:\nTopping deletion also deletes pizzas with this topping. This message will not appear again this session.\n\nContinue?"
      )
    ) {
      // const res = await handleRequest('owner','DELETE',toppingToDelete)
      // if (res?res.ok:false) {
      //   refreshData()
      // }
      await deleteTopping(toppingToDelete);
    }
    setConfirmDelete(true);
  };

  return (
    <div className={styles.container}>
      <h3>Owner</h3>
      <p>Create, edit, and delete toppings</p>

      <div className={styles.addTopping}>
        <EditTopping
          topping={{ topping_id: -999, topping_name: "" }}
          action="add"
          setEditToppingId={setEditToppingId}
          toppings={toppings}
        />
      </div>
      <ul className={styles.listEdit}>
        {toppings.length === 0 ? (
          <div className={styles.emptyMessage}>
            <Image src="/add_item.svg" alt="" width={200} height={100} />
            <p>
              No toppings here...
              <br />
              Get started by entering new toppings below
            </p>
          </div>
        ) : (
          toppings &&
          toppings.map((topping: toppingData) => (
            <li key={topping.topping_id}>
              {topping.topping_id != editToppingId ? (
                <ListItem
                  editItem={() => setEditToppingId(topping.topping_id)}
                  deleteItem={() => handleDeleteTopping(topping)}
                  name={titleCase(topping.topping_name)}
                  item={topping}
                />
              ) : (
                <EditTopping
                  topping={topping}
                  action="save"
                  setEditToppingId={setEditToppingId}
                  toppings={toppings}
                />
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
export default Owner;
