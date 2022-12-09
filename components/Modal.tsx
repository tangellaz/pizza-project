import React, {useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

import styles from './Modal.module.css';

import { 
  toppingData,
  pizzaData,
} from '../prisma/utils'

import {submitPizza} from '../src/api'

type modalInputs = {
  show: boolean,
  onClose: ()=>void,
  selectedPizza?: pizzaData,
  selectedToppings?: toppingData[],
  availableToppings?: toppingData[],
  refreshData: () => void,
}

const Modal = ({show, onClose, selectedPizza, selectedToppings, availableToppings, refreshData}:modalInputs) => {

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
    e.preventDefault();

    // initialize data to send
    const data:{pizza:pizzaData,toppings:toppingData[]} = {
      pizza: {pizza_id: -999, pizza_name: ''},
      toppings: []
    }

    // if to handle data type of e.target
    if(e.target instanceof HTMLFormElement) {
      const formData = new FormData(e.target)
      const entry = formData.entries();
      for (const [key,value] of entry) {

        // console.log(key,value)
        /* key of type number is pizza name.
        Ex:
            1 pepperoni
            pepperoni 1
            cheese 2
        */
        if(Number.isFinite(parseInt(key))) {
          data.pizza = {pizza_id: parseInt(key), pizza_name: value.toString()}
        } else {
          data.toppings.push({topping_id: parseInt(value.toString()), topping_name: key})
        }
      }
    }

    await submitPizza(data)
    refreshData()
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
              </fieldset>
            </form>
            <button form="update-form" type="submit">
              {selectedPizza?.pizza_name?"Update":"Create"}
            </button>
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