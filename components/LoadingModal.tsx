import React, {useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Triangle } from 'react-loader-spinner'

import styles from './LoadingModal.module.css';

import { 
  toppingData,
  pizzaData,
} from '../prisma/utils'

import {submitPizza} from '../src/api'

const LoadingModal = ({show}:{show:boolean}) => {

  const [isBrowser,setIsBrowser] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

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

  if (isBrowser) {
    return ReactDOM.createPortal(
      show?
        <div className={styles.overlay} ref={overlayRef}>
          <div className={styles.card}>
            <Triangle
              height="80"
              width="80"
              color="#FFFFFF"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass="spinner"
              visible={true}
            />
            {/*<p>Making those updates for you</p>*/}
          </div>
        </div>
      :null,
      document.getElementById("modal-root")!
    )
  } else {
    return null;
  }
}
export default LoadingModal