import React, {useState, useEffect} from 'react'
import LoadingModal from './LoadingModal'
import ListItem from './ListItem'
import EditTopping from './EditTopping'
import styles from './UserComponent.module.css'

import { 
  toppingData,
  pizzaData,
  componentData,
} from '../prisma/utils'

import {
  deleteTopping,
  deletePizza,
} from '../src/api'

interface mapToppings {
  [key: string]: toppingData[]
}
type ownerInputs = {
  toppings: toppingData[],
  refreshData: () => void,
  loading: boolean
}

const OwnerComponent= ({toppings, refreshData, loading}:ownerInputs) => {
  const [toppingSelect, setToppingSelect] = useState<toppingData[]>()
  const [editToppingId, setEditToppingId] = useState<number>(NaN)

  const handleDeleteTopping = async(toppingToDelete: toppingData) => {
    await deleteTopping(toppingToDelete)
    refreshData()
  }

  return (
    <div className={styles.container}>
      <h3>Owner</h3>

      <ul className={styles.listEdit}>{toppings.map((topping:toppingData)=>
        <li key={topping.topping_id}>
          {topping.topping_id!=editToppingId
            ? <ListItem editItem={()=>setEditToppingId(topping.topping_id)} deleteItem={()=>handleDeleteTopping(topping)} name={topping.topping_name} item={topping}/>
            : <EditTopping topping={topping} action='save' setEditToppingId={setEditToppingId} refreshData={refreshData}/>
          }
        </li>
      )}
        <li>
          <EditTopping topping={{topping_id:-999,topping_name:''}} action='add' setEditToppingId={setEditToppingId} refreshData={refreshData}/>
        </li>
      </ul>

      <LoadingModal show={loading}/>
    </div>
  )
}
export default OwnerComponent;