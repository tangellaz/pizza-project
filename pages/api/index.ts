import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import {
  findManyDynamic,
  createDynamic,
  createManyDynamic,
  updateDynamic,
  updateManyDynamic,
  deleteDynamic,
  deleteManyDynamic
} from '../../prisma/utils';

// type IgnorePrismaBuiltins<S extends string> = string extends S
//   ? string
//   : S extends ''
//   ? S
//   : S extends `$${infer T}`
//   ? never
//   : S;

// export type PrismaModelName = IgnorePrismaBuiltins<keyof PrismaClient>;

// export interface ColAndVal {
//   col_name:string;
//   value:string|number;
// }
// export const findManyDynamic = async(table:PrismaModelName) => {
//   //@ts-ignore
//   return await prisma[table].findMany()
//   .then((result:any)=>result)
//   .catch((err:any)=>console.log(err))
// }


export default async function handle(req :NextApiRequest, res :NextApiResponse) {
  if (req.method === 'GET') {
    try{
      const {user} = req.query
      // const toppingsList = await prisma.toppings.findMany()
      const toppingsList = await findManyDynamic('toppings')
      const pizzasList = user==='chef' ? await findManyDynamic('pizzas') : []
      const pizzaComponents = user==='chef' ? await findManyDynamic('pizza_components') : []

      res.status(200).json({toppings:toppingsList,pizzas:pizzasList,components:pizzaComponents})
    } catch (error) {
      // console.log(error);
      res.status(403).json({ error: "Error occured." });
    }
  }

  if (req.method === 'POST') {
    try{
      const {user} = req.query
      const data = req.body
      console.log(data)
      if (user === 'chef') {
        // INSERT INTO pizzas (pizza_name)
        // VALUES ([variable name]);
        // INSERT INTO pizza_components (pizza_id,topping_id)
        // VALUES ([variable id],[variable id]);

        // createDynamic('pizzas',[{col_name:'pizza_name',value:'pepperoni'}])
        // createManyDynamic('pizza_components',[
          //     [{col_name:'pizza_id',value:1},{col_name:'topping_id',value:1}],
          //     [{col_name:'pizza_id',value:1},{col_name:'topping_id',value:2}],
          //     [{col_name:'pizza_id',value:2},{col_name:'topping_id',value:2}],
          //     [{col_name:'pizza_id',value:3},{col_name:'topping_id',value:1}],
          //     [{col_name:'pizza_id',value:3},{col_name:'topping_id',value:2}],
          //     [{col_name:'pizza_id',value:3},{col_name:'topping_id',value:3}]
      } else if (user === 'owner') {
        // INSERT INTO toppings (topping_name)
        // VALUES ([variable name]);

        // console.log(createManyDynamic('toppings',[[{col_name:'topping_name',value:'pepperoni'}],[{col_name:'topping_name',value:'sausage'}]]))
      } else null

      res.status(201).json({})
    } catch (error) {
      // console.log(error);
      res.status(403).json({ error: "Error occured." });
    }
  }

  if (req.method === 'PUT') {
    try{
      const {user} = req.query
      const data = req.body
      console.log(data)
      if (user === 'chef') {
        /*
          UPDATE pizzas SET pizza_name = [variable name] WHERE pizza_id = [some_value];
          
          DELETE FROM pizza_components WHERE pizza_id = [pizza id];
          INSERT INTO pizza_components (pizza_id,topping_id)
          VALUES ([variable id],[variable id]);
        */
      } else if (user === 'owner') {
        /*
          UPDATE toppings SET topping_name = [variable name] WHERE topping_id = [some_value];
        */
      } else null

      res.status(204).json({})
    } catch (error) {
      // console.log(error);
      res.status(403).json({ error: "Error occured." });
    }
  }

  if (req.method === 'DELETE') {
    try{
      const {user} = req.query
      const data = req.body
      console.log(data)
      if (user === 'chef') {
        /*
          DELETE FROM pizzas WHERE pizza_id = [pizza id];
        */
      } else if (user === 'owner') {
        /*
          if pizzas, grab pizza ids with topping to delete. Delete pizza ids.
          DELETE FROM toppings WHERE topping_name = [variable name];
          (prisma DELETE MANY)  
          DELETE FROM pizzas WHERE pizza_id = [pizza id];  
        */
      } else null

      res.status(204).json()
    } catch (error) {
      // console.log(error);
      res.status(403).json({ error: "Error occured." });
    }
  }


}