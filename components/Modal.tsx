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
  closeModal: () => void,
  selectedPizza?: pizzaData,
  selectedToppings?: toppingData[],
  availableToppings?: toppingData[],
  refreshData: () => void,
}

const Modal = ({show, closeModal, selectedPizza, selectedToppings, availableToppings, refreshData}:modalInputs) => {
  const [error,setError] = useState<string>('');
  const [isBrowser,setIsBrowser] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    closeModal();
    setError('');
  }

 const overlayClickHandler = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (overlayRef.current==e.target) {
      closeModal();
      setError('');
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

    // Error handling
    if (!data.pizza.pizza_name) {
      setError('Pizzas must have a name')
    } else if (data.toppings.length === 0) {
      setError('Pizzas must have toppings')
    } else {
      await submitPizza(data)
      closeModal()
      refreshData()
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
              <img src="/exit.svg" decoding="async" width="24" height="24" alt=""/>
            </button>

            <form id="update-form" onSubmit={handleSubmit}>
            
              <label htmlFor={selectedPizza?.pizza_name}>
                Pizza name:
              </label>
              <input className={styles.nameInput} type="text" 
                id={selectedPizza?.pizza_name}
                name={selectedPizza?.pizza_id.toString()}
                defaultValue={selectedPizza?.pizza_name}
                onChange={event => setPizza(event.target.value)}/>
              {error?<p className={styles.error}>Error: {error}</p>:null}
              <fieldset>
                <legend>Select from available toppings:</legend>
                {
                  availableToppings?.map((topping)=>
                    <div className={styles.selection} key={topping.topping_name}>
                      <label htmlFor={topping.topping_name}>
                      <input type="checkbox" 
                      defaultChecked={selectedToppings?.some(ele=>
                        ele.topping_id===topping.topping_id)}
                      name={topping.topping_name}
                      key={topping.topping_name+topping.topping_id}
                      id={topping.topping_name}
                      value={topping.topping_id}/>
                        <span>{topping.topping_name}</span>
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