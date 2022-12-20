import React, {useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

import { 
  toppingData,
  pizzaData,
} from '../prisma/utils'

import {handleRequest} from '../lib/api'
import {
  mapToppings,
  pizzaNameExists,
  pizzaComboExists,
  titleCase,
  purgeWhitespace,
  isAlphaNumeric,
} from '../lib/utils'

type modalInputs = {
  show: boolean,
  closeModal: () => void,
  selectedPizza: pizzaData,
  selectedToppings?: toppingData[],
  availableToppings: toppingData[],
  refreshData: () => void,
  pizzas: pizzaData[], //error handling
  assembledPizzas?: mapToppings, //error handling
}

const Modal = ({show, closeModal, selectedPizza, selectedToppings, availableToppings, refreshData, pizzas, assembledPizzas}:modalInputs) => {
  const [error,setError] = useState<string>('');
  
  // Utility Components
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

    useEffect(() => {
      setIsBrowser(true)
    },[])

    useEffect(()=>{
      const body = document.body
      if (show) {
        body.style.overflowY = "hidden";
      } else {
        body.style.overflowY = "auto";
      }
    },[show])

    const [pizza,setPizza] = useState<string>('')
    useEffect(()=>{
      setPizza(selectedPizza?.pizza_name)
    },[selectedPizza])
    
    useEffect(()=>{
      if(pizzaNameExists(pizzas,selectedPizza,pizza)) {
        setError('Pizza name already exists')
      } else if (!isAlphaNumeric(pizza)) {
        setError('Pizza name can only contain alphanumerics')
      // } else if (pizza === '' && selectedPizza?.pizza_id != -999) {
      //   setError('Pizzas must have a name')
      } else {
        setError('')
      }
    },[pizza])


  // Data Handling Components
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

          /* key of type number is pizza name. Ex:
              key value
              1 pepperoni <-- pizza name
              pepperoni 1
              cheese 2
          */
          if(Number.isFinite(parseInt(key))) {
            data.pizza = {pizza_id: parseInt(key), pizza_name: purgeWhitespace(value.toString().toLowerCase())}
          } else {
            data.toppings.push({topping_id: parseInt(value.toString()), topping_name: key.toLowerCase()})
          }
        }
      }
      // Error handling
      if (!data.pizza.pizza_name) {
        setError('Pizzas must have a name')
      } else if (data.toppings.length === 0) {
        setError('Pizzas must have toppings')
      } else if (pizzaComboExists(data,assembledPizzas)) {
        setError('Pizza already exists with selected toppings')
      } else {
        const res = await handleRequest('chef','POST',data)
        if (res?res.ok:false) {
          setError('')
          setPizza('')
          closeModal()
          refreshData()
        }
      }
    }

  if (isBrowser) {
    return ReactDOM.createPortal(
      show?
        <div className={styles.overlay} ref={overlayRef} onClick={(e)=>overlayClickHandler(e)}>
          <div className={styles.card}>
            <button onClick={(e)=>handleCloseClick(e)} aria-label="close pop-up" title="close pop-up button">
              <img src="/exit.svg" decoding="async" width="24" height="24" alt=""/>
            </button>

            <form id="update-form" onSubmit={handleSubmit}>
            
              <label htmlFor={selectedPizza?.pizza_name} className={styles.nameInputLabel}>
                Pizza name:
              <input type="text" 
                className={styles.nameInput}
                id={selectedPizza?.pizza_name}
                name={selectedPizza?.pizza_id.toString()}
                // defaultValue={titleCase(selectedPizza?.pizza_name)}
                value={titleCase(pizza)}
                onChange={event => setPizza(event.target.value)}/>
              </label>
              {error?<p className={styles.error}><span>Error:</span><span>{error}</span></p>:null}
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
                        <span>{titleCase(topping.topping_name)}</span>
                      </label>
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