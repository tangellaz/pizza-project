import React, {useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

import styles from './Modal.module.css';

import { 
  toppingData,
  pizzaData,
  componentData,
} from '../prisma/utils'

type modalInputs = {
  show: boolean;
  onClose: ()=>void;
  selectedPizza?: pizzaData;
  selectedToppings?: toppingData[];
  availableToppings?: toppingData[];
}

const Modal = ({ show, onClose, selectedPizza, selectedToppings, availableToppings }:modalInputs) => {

  const [isBrowser,setIsBrowser] = useState(false);
  const [reviews,setReviews] = useState([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    onClose();
  }

 const overlayClickHandler = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (overlayRef.current==e.target) {
      onClose();
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> ) => {
    try{
      e.preventDefault();

      let pizzaObj:pizzaData = {pizza_id: -999, pizza_name: ''}
      let toppingList:toppingData[] = []

      // if to handle data type of e.target
      if(e.target instanceof HTMLFormElement) {
        const formData = new FormData(e.target)
        const data = formData.entries();
        for (const [key,value] of data) {

          // console.log(key,value)
          /* key of type number is pizza name.
          Ex:
              1 pepperoni
              pepperoni 1
              cheese 2
          */
          if(Number.isFinite(parseInt(key))) {
            pizzaObj = {pizza_id: parseInt(key), pizza_name: value.toString()}
          } else {
            toppingList.push({topping_id: parseInt(value.toString()), topping_name: key})
          }
        }
      }

      const data = {
        pizza: pizzaObj,
        toppings: toppingList
      }
      const response = await fetch('/api?user=chef', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error(response.statusText)
      }
    } catch(error) {
      console.log("Oops something went wrong\n",error)
    }

  }

  const [pizza,setPizza] = useState<string>('')
  const [toppings,setToppings] = useState([])

  useEffect(() => {
    setIsBrowser(true)
  },[])

  useEffect(()=>{
    // const body = document.querySelector("body");
    const body = document.body
    if (show) {
      body.style.overflowY = "hidden";
    } else {
      body.style.overflowY = "auto";
    }
  },[show])

  if (isBrowser) {
    return ReactDOM.createPortal(
      show?

        <div className={styles.overlay} ref={overlayRef} onClick={(e)=>overlayClickHandler(e)}>
          <div className={styles.card}>
            <button onClick={(e)=>handleCloseClick(e)} aria-label="close pop-up" title="close pop-up button">
              <img src="/exit.svg" decoding="async" width="16" height="16" alt=""/>
            </button>

            <form id="update-form" onSubmit={handleSubmit}>
            
            <label htmlFor={selectedPizza?.pizza_name}>
              Pizza name:
            </label>
            <br/>
            <input type="text" 
              id={selectedPizza?.pizza_name}
              name={selectedPizza?.pizza_id.toString()}
              defaultValue={selectedPizza?.pizza_name}
              onChange={event => setPizza(event.target.value)}/>
              <fieldset>
                <legend>Select from the available toppings:</legend>
                {
                  availableToppings?.map((topping)=>
                    <div key={topping.topping_name}>
                      <input type="checkbox" 
                      defaultChecked={selectedToppings?.some(ele=>
                        ele.topping_id===topping.topping_id)}
                      name={topping.topping_name}
                      key={topping.topping_name+topping.topping_id}
                      id={topping.topping_name}
                      value={topping.topping_id}/>
                      <label htmlFor={topping.topping_name}>
                        {topping.topping_name}
                      </label>
                      <br/>
                    </div>
                  )
                }
                {/*<input type="radio" name="action" id="track" value="track" /><label for="track">Track Submission</label><br />*/}
              </fieldset>
            </form>
            <button form="update-form" type="submit">
              {selectedPizza?.pizza_name?"Update":"Create"}
            </button>
            {/*<h3>{selectedPizza?.pizza_name}</h3>
            <p className="subtitle">Selected toppings</p>
            <ul>
              {selectedToppings?.map((topping)=><li key={topping.topping_name+topping.topping_id}>{topping.topping_name}</li>)}
            </ul>*/}
{/*            <ul>
              {availableToppings?.map((topping)=><li key={topping.topping_name+topping.topping_id}>{topping.topping_name}</li>)}
            </ul>*/}
          </div>
        </div>

      :null,
      document.getElementById("modal-root")!
    )
  } else {
    return null;
  }
}
export default Modal