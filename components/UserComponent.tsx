import React, {useState, useEffect} from 'react'
import Modal from './Modal'
import { 
  toppingData,
  pizzaData,
  componentData,
} from '../prisma/utils'

type Props = {
  user: string,
  initialToppings: toppingData[],
  initialPizzas?: pizzaData[],
  initialComponents?: componentData[],
}
interface mapToppings {
  [key: string]: toppingData[]
}

const UserComponent: React.FC<Props> = ({user, initialToppings, initialPizzas=[], initialComponents=[]}) => {
  const [toppings,setToppings] = useState(initialToppings)
  const [pizzas,setPizzas] = useState(initialPizzas)
  const [components,setComponents] = useState(initialComponents)
  const [assembledPizzas,setAssembledPizzas] = useState<mapToppings>()

  const [pizzaSelect, setPizzaSelect] = useState<pizzaData>()
  const [toppingSelect, setToppingSelect] = useState<toppingData[]>()

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

  const handlePizzaClick = (pizza: pizzaData, toppings: toppingData[]) => {
    setPizzaSelect(pizza)
    setToppingSelect(toppings)
    setShowModal(true)
  }

  // // handle state updates
  useEffect(()=>{
    const pizzaList = pizzaAssembler(toppings,pizzas,components)
    console.log(pizzaList)
    setAssembledPizzas(pizzaList)
  }
  ,[])

  return (
  <div>
    <p>{user} component</p>

    {
      user.toLowerCase()==='chef' ?
        <ul>{pizzas.map((pizza:pizzaData)=>
            <li key={pizza.pizza_id} onClick={(e)=>handlePizzaClick(pizza,assembledPizzas[pizza.pizza_id])}>
              {pizza.pizza_name}:
              <ul>
                {
                  assembledPizzas ? assembledPizzas[pizza.pizza_id].map(topping=>
                    <li key={pizza.pizza_id+topping.topping_id}>{topping.topping_name}</li>
                  )
                  :null
                }
              </ul>
            </li>
          )}
        </ul>
      :
        <ul>
          {toppings.map((topping:toppingData)=><li key={topping.topping_id}>{topping.topping_name}</li>)}
        </ul>

    }
    <Modal onClose={()=>setShowModal(false)} show={showModal} selectedPizza={pizzaSelect} selectedToppings={toppingSelect} availableToppings={toppings}/>
    <button onClick={()=>setShowModal(true)}>Click to Show Modal</button>
  </div>
  )
}
export default UserComponent;