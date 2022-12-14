import React, {useState, useEffect} from 'react'
import styles from './ListItem.module.css'

import { 
  toppingData,
  pizzaData,
} from '../prisma/utils'

type ListItemInputs = {
  editItem: () => void,
  deleteItem: () => void,
  name:string, 
  item:pizzaData|toppingData
}

const ListItem = ({editItem,deleteItem,name,item}:ListItemInputs) => {
  
  return(
    <div className={styles.container}>
      {name}

      <button className={styles.actionBtn}
      onClick={()=>editItem()}
      aria-label="Edit" title="Edit">
        <img src="/pencil.svg" decoding="async" width="24" height="24" alt="Edit"/>
      </button>

      <button className={styles.actionBtn}
      onClick={()=>deleteItem()}
      aria-label="Delete" title="Delete">
        <img src="/trash-can.svg" decoding="async" width="24" height="24" alt="Delete"/>
      </button>

    </div>
  )
}
export default ListItem;