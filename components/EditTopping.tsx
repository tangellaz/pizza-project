import React, {useState} from 'react'
import styles from './EditTopping.module.css'

import { 
  toppingData,
} from '../prisma/utils'

type EditToppingInputs = {
  topping:toppingData
  submitTopping: (toppingToSubmit: toppingData, name: string) => Promise<void>,
  action: 'save'|'add'
}

const EditTopping = ({topping,submitTopping,action}:EditToppingInputs) => {
  const [value,setValue] = useState<string>('')

  return(
    <div className={styles.container}>
        <input type="text" 
          id={topping?.topping_name}
          name={topping?.topping_id.toString()}
          defaultValue={topping?.topping_name}
          onChange={(e)=>setValue(e.target.value)}
        />
      <button className={styles.actionBtn}
      onClick={()=>{submitTopping(topping,value?value:topping?.topping_name)}}
      aria-label={action} title={action}>
        <img src={`/${action}.svg`} decoding="async" width="24" height="24" alt={action}/>
      </button>
    </div>
  )
}
export default EditTopping;