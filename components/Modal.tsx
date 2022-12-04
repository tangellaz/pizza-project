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
            <h3>{selectedPizza?.pizza_name}</h3>
            <p className="subtitle">Selected toppings</p>
            <ul>
              {selectedToppings?.map((topping)=><li key={topping.topping_name+topping.topping_id}>{topping.topping_name}</li>)}
            </ul>
            <p className="subtitle">Available toppings</p>
            <fieldset>
              <legend>Select from the available toppings:</legend>
              {
                availableToppings?.map((topping)=>
                  <>
                  <input type="checkbox" checked={selectedToppings?.some(ele=>ele.topping_id===topping.topping_id)} name={topping.topping_name} key={topping.topping_name+topping.topping_id} id={topping.topping_name} value={topping.topping_id} />
                  <label htmlFor={topping.topping_name}>{topping.topping_name}</label>
                  <br/>
                  </>
                )
              }
              {/*<input type="radio" name="action" id="track" value="track" /><label for="track">Track Submission</label><br />*/}
            </fieldset>

            <ul>
              {availableToppings?.map((topping)=><li key={topping.topping_name+topping.topping_id}>{topping.topping_name}</li>)}
            </ul>
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