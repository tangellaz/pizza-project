import type { NextApiRequest, NextApiResponse } from 'next'

import {
  toppingData,
  pizzaData,
  componentData,

  findAllDynamic,
  findManyDynamic,
  createDynamic,
  createManyDynamic,
  updateDynamic,
  updateManyDynamic,
  deleteDynamic,
  deleteManyDynamic,
  deleteManyDynamica
} from '../../../prisma/utils';

export default async function handle(req :NextApiRequest, res :NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try{
        // throw new Error('Random error') //Error testing
        const toppingsList = await findAllDynamic('toppings')
        return res.status(200).json({toppings:toppingsList})
      } catch (error) {
        return res.status(403).json({ error: "Error occured." });
      }

    case 'POST':
      try{
        // throw new Error('Random error') //Error testing
        const data = req.body
        // console.log(req.body)
        if(data.topping_id===-999){
          await createDynamic('toppings', [{col_name:'topping_name',value:data.topping_name}])
        } else {
          await updateDynamic('toppings',{col_name:'topping_id',value:data.topping_id},{col_name:'topping_name',value:data.topping_name})
        }

        return res.status(201).json({})
      } catch (error) {
        return res.status(403).json({ error: "Error occured." });
      }

    case 'DELETE':
      try{
        // throw new Error('Random error') //Error testing
        const data = req.body
        const pizzaIds = await findManyDynamic("pizza_components",{col_name:'topping_id', value: data.topping_id},{col_name:'pizza_id', value: true})
        const pizzaIdsList = pizzaIds.map((pizza:{pizza_id: number})=>pizza.pizza_id)

        await deleteManyDynamic("pizzas",{col_name:"pizza_id",value: {in: pizzaIdsList}})
        await deleteDynamic('toppings', {col_name:'topping_id',value: data.topping_id})

        return res.status(200).json([])
      } catch (error) {
        return res.status(403).json({ error: "Error occured." });
      }
    
    default:
      return res.setHeader('Allow', ['GET','POST','DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)

  }
}