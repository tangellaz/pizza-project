import React, {useState, useEffect} from 'react'
import Modal from './Modal'
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
type Props = {
  user: string,
  toppings: toppingData[],
  pizzas?: pizzaData[],
  components?: componentData[],
  refreshData: () => void
  assembledPizzas: mapToppings
}

const UserComponent: React.FC<Props> = ({user, toppings, pizzas=[], components=[], refreshData, assembledPizzas}) => {

  const [pizzaSelect, setPizzaSelect] = useState<pizzaData>()
  const [toppingSelect, setToppingSelect] = useState<toppingData[]>()

  const [editToppingId, setEditToppingId] = useState<number>(NaN)

  const [showModal, setShowModal] = useState(false)

  const editPizza = (pizzaToEdit: pizzaData) => {
    const toppingsSelected = assembledPizzas?assembledPizzas[pizzaToEdit.pizza_id]:[]

    setPizzaSelect(pizzaToEdit)
    setToppingSelect(toppingsSelected)
    setShowModal(true)
  }
  const deleterPizza = async(pizzaToDelete: pizzaData) => {
    await deletePizza(pizzaToDelete)
    refreshData()
  }
  const deleterTopping = async(toppingToDelete: toppingData) => {
    await deleteTopping(toppingToDelete)
    refreshData()
  }

  return (
  <div className={styles.container}>
    <p>{user} component</p>

    {
      user.toLowerCase()==='chef' ?
        <>
          <ul className={styles.listEdit}>{pizzas.map((pizza:pizzaData)=>
              <li key={pizza.pizza_id}>
                <ListItem editItem={()=>editPizza(pizza)} deleteItem={()=>deleterPizza(pizza)} name={pizza.pizza_name} item={pizza}/>
                <ul className={styles.listDisplay}>
                  {console.log('assembledPizzas[pizza.pizza_id]',assembledPizzas?assembledPizzas[pizza.pizza_id]:null)}
                  {
                    assembledPizzas ? assembledPizzas[pizza.pizza_id].map((topping,i)=>
                      <li key={pizza.pizza_id+topping.topping_id}>
                        {topping.topping_name}
                        {i!=assembledPizzas[pizza.pizza_id].length-1?', ':''}
                      </li>
                    )
                    :null
                  }
                </ul>
              </li>
            )}
          </ul>
          <button className={styles.createPizzaBtn} onClick={()=>editPizza({pizza_id:-999,pizza_name:''})}>Create new pizza</button>
        </>
      :
        <ul className={styles.listEdit}>{toppings.map((topping:toppingData)=>
          <li key={topping.topping_id}>
            {topping.topping_id!=editToppingId?
              <ListItem editItem={()=>setEditToppingId(topping.topping_id)} deleteItem={()=>deleterTopping(topping)} name={topping.topping_name} item={topping}/>
              :
              <EditTopping topping={topping} action='save' setEditToppingId={setEditToppingId} refreshData={refreshData}/>
            }
          </li>
        )}
          <li>
            <EditTopping topping={{topping_id:-999,topping_name:''}} action='add' setEditToppingId={setEditToppingId} refreshData={refreshData}/>
          </li>
        </ul>

    }
    <Modal onClose={()=>setShowModal(false)} show={showModal} selectedPizza={pizzaSelect} selectedToppings={toppingSelect} availableToppings={toppings} refreshData={refreshData}/>
    {/*<button onClick={()=>setShowModal(true)}>Click to Show Modal</button>*/}
  </div>
  )
}
export default UserComponent;