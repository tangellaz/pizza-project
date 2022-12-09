import React, {useState,useEffect} from 'react'
import styles from './EditTopping.module.css'
import {toppingData} from '../prisma/utils'
import {submitTopping} from '../src/api'

type EditToppingInputs = {
  topping:toppingData
  action: 'save'|'add',
  setEditToppingId: React.Dispatch<React.SetStateAction<number>>
  refreshData: () => void
}

const EditTopping = ({topping,action,setEditToppingId,refreshData}:EditToppingInputs) => {
  const [value,setValue] = useState<string>('')
  useEffect(()=>{
    topping.topping_name!=''?setValue(topping.topping_name):null
  },[])

  const handleSubmit = async(toppingToSubmit: toppingData, name:string) => {
    // console.log('topping from state:\n', name)
    // console.log('POST',toppingToSubmit)
    // if no change, do not post
    if(name != '' && name != toppingToSubmit.topping_name){
      const data = {
        topping_id: toppingToSubmit.topping_id,
        topping_name: name
      }
      submitTopping(data)
      // const response = await fetch('/api?user=owner', {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // })
      
      // if (!response.ok) {
      //   throw new Error(response.statusText)
      // }
      setEditToppingId(NaN)
      setValue('')
      refreshData()
    }
  }

  return(
    <div className={styles.container}>
        <input type="text" 
          id={topping?.topping_name}
          name={topping?.topping_id.toString()}
          // defaultValue={topping?.topping_name}
          value={value}
          onChange={(e)=>setValue(e.target.value)}
          onKeyPress={(e)=>{e.key === 'Enter'?handleSubmit(topping,value?value:topping?.topping_name):null}}
        />
      <button className={styles.actionBtn}
      onClick={()=>{handleSubmit(topping,value?value:topping?.topping_name)}}
      aria-label={action} title={action}>
        <img src={`/${action}.svg`} decoding="async" width="24" height="24" alt={action}/>
      </button>
    </div>
  )
}
export default EditTopping;