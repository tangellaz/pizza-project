import {resolve} from './resolve'
import { 
  toppingData,
  pizzaData,
  componentData,
} from '../prisma/utils'

export const deleteTopping = async(topping: toppingData) => {
  console.log('DELETE TOPPING!')
  return await resolve(fetch('/api?user=owner', {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(topping),
  }).then())
}