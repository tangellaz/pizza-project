import React, { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "../modal/modal";
import LoadingModal from "../loading-modal/loading-modal";
import ListItem from "../list-item/list-item";
import EditTopping from "../edit-topping/edit-topping";
import styles from "../UserComponent.module.css";

import { handleRequest } from "../../lib/api";
import { useDeletePizzaMutation } from "../../lib/api";
import { mapToppings, titleCase } from "../../lib/utils";

import { ChefProps } from "./chef.types";

const Chef = ({
  toppings,
  pizzas = [],
  refreshData,
  assembledPizzas,
  loading,
}: ChefProps) => {
  const [pizzaSelect, setPizzaSelect] = useState<pizzaData>({
    pizza_id: -999,
    pizza_name: "",
  });
  const [toppingSelect, setToppingSelect] = useState<toppingData[]>();

  const [editToppingId, setEditToppingId] = useState<number>(NaN);

  const [showModal, setShowModal] = useState(false);

  const [deletePizza] = useDeletePizzaMutation();

  const handleEditPizza = (pizzaToEdit: pizzaData) => {
    const toppingsSelected = assembledPizzas
      ? assembledPizzas[pizzaToEdit.pizza_id]
      : [];
    setPizzaSelect(pizzaToEdit);
    setToppingSelect(toppingsSelected);
    setShowModal(true);
  };
  const handleDeletePizza = async (pizzaToDelete: pizzaData) => {
    await deletePizza(pizzaToDelete);
    // const res = await handleRequest('chef','DELETE',pizzaToDelete)
    // if (res?res.ok:false) {
    //   refreshData()
    // }
  };

  return (
    <div className={styles.container}>
      <h3>Chef</h3>
      <p>Create, edit, and delete pizzas</p>

      <button
        className={styles.createPizzaBtn}
        onClick={() => handleEditPizza({ pizza_id: -999, pizza_name: "" })}
      >
        Create new pizza
      </button>
      <ul className={styles.listEdit}>
        {pizzas.length === 0 ? (
          <div className={styles.emptyMessage}>
            <Image src="/add_item.svg" alt="" width={200} height={100} />
            <p>
              No pizzas here...
              <br />
              Get started by creating a new pizza below
            </p>
          </div>
        ) : (
          pizzas &&
          pizzas.map((pizza: pizzaData) => (
            <li key={pizza.pizza_id}>
              <ListItem
                editItem={() => handleEditPizza(pizza)}
                deleteItem={() => handleDeletePizza(pizza)}
                name={titleCase(pizza.pizza_name)}
                item={pizza}
              />
              <ul className={styles.listDisplay}>
                {assembledPizzas
                  ? assembledPizzas[pizza.pizza_id].map((topping, i) => (
                      <li key={pizza.pizza_id + topping.topping_id}>
                        {titleCase(topping.topping_name)}
                        {i != assembledPizzas[pizza.pizza_id].length - 1
                          ? ", "
                          : ""}
                      </li>
                    ))
                  : null}
              </ul>
            </li>
          ))
        )}
      </ul>

      <LoadingModal show={loading} />
      <Modal
        closeModal={() => setShowModal(false)}
        show={showModal}
        selectedPizza={pizzaSelect}
        selectedToppings={toppingSelect}
        availableToppings={toppings}
        refreshData={refreshData}
        pizzas={pizzas}
        assembledPizzas={assembledPizzas}
      />
    </div>
  );
};
export default Chef;
