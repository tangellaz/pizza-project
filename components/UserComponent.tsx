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

type Props = {
  user: string,
  toppings: toppingData[],
  pizzas?: pizzaData[],
  components?: componentData[],
  refreshData: () => void
}
interface mapToppings {
  [key: string]: toppingData[]
}

const UserComponent: React.FC<Props> = ({user, toppings, pizzas=[], components=[], refreshData}) => {

  const [assembledPizzas,setAssembledPizzas] = useState<mapToppings>()

  const [pizzaSelect, setPizzaSelect] = useState<pizzaData>()
  const [toppingSelect, setToppingSelect] = useState<toppingData[]>()

  const [editToppingId, setEditToppingId] = useState<number>(NaN)
  // const [topping,setTopping] = useState<toppingData>({topping_id: -999, topping_name:''})
  // const [editValue,setEditValue] = useState<string>('')

  const [showModal, setShowModal] = useState(false)

  // const pizzaAssembler = (toppings:toppingData[],pizzas:pizzaData[],components:componentData[]) => {
  //   const assembledPizzasList = pizzas.map( (pizza:pizzaData) => {
  //     // pizza_components: Filter toppings per pizza by pizza_id
  //     const pizzaComponentObjects = components.filter(component => component.pizza_id===pizza.pizza_id)
      
  //     // map toppings to pizzas
  //     const pizzaToppings = pizzaComponentObjects.map(component => 
  //       toppings.find(({topping_id})=>topping_id===component.topping_id)
  //     )

  //     // Extract topping names
  //     const toppingList = pizzaToppings.map(topping=>topping.topping_name)

  //     return {[pizza.pizza_name]: toppingList}
  //   })
      
  //   return assembledPizzasList
  // }

  const pizzaAssembler = (toppings:toppingData[],pizzas:pizzaData[],components:componentData[]) => {
    // interface mapToppings{
    //   [key: string]: string[]
    // }
    let mapToppings: mapToppings = {}
    
    // create map object of empty arrays
    pizzas.map(pizza=>{mapToppings[pizza.pizza_id] = []})
    
    // map through component data,
    //   find the topping element
    //   push topping to mapToppings array
    components.map(component=>{
      const topping = toppings.find(topping => component.topping_id===topping.topping_id)
      topping && component.pizza_id!=null ? mapToppings[component.pizza_id].push(topping) : null
    })
    return mapToppings
  }

  const editPizza = (pizzaToEdit: pizzaData) => {
    const toppingsSelected = assembledPizzas?assembledPizzas[pizzaToEdit.pizza_id]:[]

    setPizzaSelect(pizzaToEdit)
    setToppingSelect(toppingsSelected)
    setShowModal(true)
  }
  const deleterPizza = async(pizzaToDelete: pizzaData) => {
    await deletePizza(pizzaToDelete)
    refreshData()

    // console.log('DELETE',pizzaToDelete)
    // const data = pizzaToDelete

    // const response = await fetch('/api?user=chef', {
    //   method: "DELETE",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // })
    
    // if (!response.ok) {
    //   throw new Error(response.statusText)
    // }
  }

  // const editTopping = (toppingToEdit: toppingData) => {
  //   setEditToppingId(toppingToEdit.topping_id)
  // }
  const deleterTopping = async(toppingToDelete: toppingData) => {
    await deleteTopping(toppingToDelete)
    refreshData()

  //   console.log('DELETE',toppingToDelete)

  //   const data = toppingToDelete

  //   const response = await fetch('/api?user=owner', {
  //     method: "DELETE",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(data),
  //   })
    
  //   if (!response.ok) {
  //     throw new Error(response.statusText)
  //   }
  }

  // // handle state updates
  useEffect(()=>{
    if (pizzas != []) {
      const pizzaList = pizzaAssembler(toppings,pizzas,components)
      // console.log('pizzaList:',pizzaList)
      setAssembledPizzas(pizzaList)
    }
  }
  ,[])

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
    <Modal onClose={()=>setShowModal(false)} show={showModal} selectedPizza={pizzaSelect} selectedToppings={toppingSelect} availableToppings={toppings}/>
    {/*<button onClick={()=>setShowModal(true)}>Click to Show Modal</button>*/}
  </div>
  )
}
export default UserComponent;