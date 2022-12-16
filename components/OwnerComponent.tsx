import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import LoadingModal from './LoadingModal'
import ListItem from './ListItem'
import EditTopping from './EditTopping'
import styles from './UserComponent.module.css'

import { 
  toppingData,
  pizzaData,
  componentData,
} from '../prisma/utils'

import {handleRequest} from '../lib/api'
import {titleCase} from '../lib/utils'

type ownerInputs = {
  toppings: toppingData[],
  refreshData: () => void,
  loading: boolean
}

const OwnerComponent= ({toppings, refreshData, loading}:ownerInputs) => {
  const [toppingSelect, setToppingSelect] = useState<toppingData[]>()
  const [editToppingId, setEditToppingId] = useState<number>(NaN)
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

  const handleDeleteTopping = async(toppingToDelete: toppingData) => {
    if(confirmDelete || window.confirm("Caution:\nTopping deletion also deletes pizzas with this topping. This message will not appear again this session.\n\nContinue?")){
      await handleRequest('owner','DELETE',toppingToDelete)
      refreshData()
    }
    setConfirmDelete(true)
  }

  return (
    <div className={styles.container}>
      <h3>Owner</h3>
      <p>Create, edit, and delete toppings</p>

      <ul className={styles.listEdit}>
        <li className={styles.addTopping}>
          <EditTopping topping={{topping_id:-999,topping_name:''}} action='add' setEditToppingId={setEditToppingId} refreshData={refreshData} toppings={toppings}/>
        </li>
      {
        toppings.length===0?
        <div className={styles.emptyMessage}>
          <Image src="/add_item.svg" alt="" width={200} height={100}/>
          <p>No toppings here...<br/>Get started by entering new toppings below</p>
        </div>
        : toppings.map((topping:toppingData)=>
        <li key={topping.topping_id}>
          {topping.topping_id!=editToppingId ?
            <ListItem editItem={()=>setEditToppingId(topping.topping_id)} deleteItem={()=>handleDeleteTopping(topping)} name={titleCase(topping.topping_name)} item={topping}/>
            : <EditTopping topping={topping} action='save' setEditToppingId={setEditToppingId} refreshData={refreshData} toppings={toppings}/>
          }
        </li>
        )
      }

      </ul>

      <LoadingModal show={loading}/>
    </div>
  )
}
export default OwnerComponent;