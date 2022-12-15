import {resolve} from './resolve'

import { 
  toppingData,
  pizzaData,
  componentData,
} from '../prisma/utils'

type dataType = pizzaData | toppingData | {pizza:pizzaData,toppings:toppingData[]}

export const handleRequest = async(user:"chef"|"owner", method:"DELETE"|"POST" ,data:dataType) => {
  return await resolve(fetch(`/api/users/${user}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then())
}

// export const deletePizza = async(pizza: pizzaData) => {
//   // return await resolve(fetch('/api?user=chef', {
//   return await resolve(fetch('/api/users/chef', {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(pizza),
//   }).then())
// }

// export const submitPizza = async(data: {pizza:pizzaData,toppings:toppingData[]}) => {
//   // return await resolve(fetch('/api?user=chef', {
//   return await resolve(fetch('/api/users/chef', {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   }).then())
// }

// export const deleteTopping = async(topping: toppingData) => {
//   // return await resolve(fetch('/api?user=owner', {
//   return await resolve(fetch('/api/users/owner', {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(topping),
//   }).then())
// }

// export const submitTopping = async(topping: toppingData) => {
//   // return await resolve(fetch('/api?user=owner', {
//   return await resolve(fetch('/api/users/owner', {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(topping),
//   }).then())
// }