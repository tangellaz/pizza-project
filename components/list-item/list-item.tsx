import { useState, useEffect } from "react";
import styles from "./list-item.module.css";

import { ListItemProps } from "./list-item.types";
const ListItem = ({ editItem, deleteItem, name, item }: ListItemProps) => {
  return (
    <div className={styles.container}>
      <span>{name}</span>

      <button
        className={styles.actionBtn}
        onClick={() => editItem()}
        aria-label="Edit"
        title="Edit"
      >
        <img
          src="/pencil.svg"
          decoding="async"
          width="24"
          height="24"
          alt="Edit"
        />
      </button>

      <button
        className={styles.actionBtn}
        onClick={() => deleteItem()}
        aria-label="Delete"
        title="Delete"
      >
        <img
          src="/trash-can.svg"
          decoding="async"
          width="24"
          height="24"
          alt="Delete"
        />
      </button>
    </div>
  );
};
export default ListItem;
