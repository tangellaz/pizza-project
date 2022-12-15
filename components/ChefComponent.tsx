import React, {useState, useEffect} from 'react'
import Modal from './Modal'
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
import {mapToppings} from '../lib/utils'

type chefInputs = {
  toppings: toppingData[],
  pizzas?: pizzaData[],
  refreshData: () => void,
  assembledPizzas?: mapToppings,
  loading: boolean
}

const ChefComponent = ({toppings, pizzas=[], refreshData, assembledPizzas, loading}:chefInputs) => {

  const [pizzaSelect, setPizzaSelect] = useState<pizzaData>({pizza_id:-999,pizza_name:''})
  const [toppingSelect, setToppingSelect] = useState<toppingData[]>()

  const [editToppingId, setEditToppingId] = useState<number>(NaN)

  const [showModal, setShowModal] = useState(false)

  const handleEditPizza = (pizzaToEdit: pizzaData) => {
    const toppingsSelected = assembledPizzas?assembledPizzas[pizzaToEdit.pizza_id]:[]
    setPizzaSelect(pizzaToEdit)
    setToppingSelect(toppingsSelected)
    setShowModal(true)
  }
  const handleDeletePizza = async(pizzaToDelete: pizzaData) => {
    // await deletePizza(pizzaToDelete)
    await handleRequest('chef','DELETE',pizzaToDelete)
    refreshData()
  }

  return (
    <div className={styles.container}>
      <h3>Chef</h3>
      
      <ul className={styles.listEdit}>{pizzas.map((pizza:pizzaData)=>
          <li key={pizza.pizza_id}>
            <ListItem editItem={()=>handleEditPizza(pizza)} deleteItem={()=>handleDeletePizza(pizza)} name={pizza.pizza_name} item={pizza}/>
            <ul className={styles.listDisplay}>
              {assembledPizzas ?
                assembledPizzas[pizza.pizza_id].map((topping,i)=>
                    <li key={pizza.pizza_id+topping.topping_id}>
                      {topping.topping_name}
                      {i!=assembledPizzas[pizza.pizza_id].length-1 ? ', ' : '' }
                    </li>
                  )
                : null
              }
            </ul>
          </li>
        )}
      </ul>
      <button className={styles.createPizzaBtn} onClick={()=>handleEditPizza({pizza_id:-999,pizza_name:''})}>Create new pizza</button>
      
      <LoadingModal show={loading}/>
      <Modal closeModal={()=>setShowModal(false)} show={showModal} selectedPizza={pizzaSelect} selectedToppings={toppingSelect} availableToppings={toppings} refreshData={refreshData} pizzas={pizzas} assembledPizzas={assembledPizzas}/>
    </div>
  )
}
export default ChefComponent;