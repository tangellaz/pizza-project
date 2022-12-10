import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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

const printData = async() => {
  console.log("pizzas:\n",await findAllDynamic("pizzas"))
  console.log("toppings:\n",await findAllDynamic("toppings"))
  console.log("pizza_components:\n",await findAllDynamic("pizza_components"))
}

export default async function handle(req :NextApiRequest, res :NextApiResponse) {
  if (req.method === 'GET') {
    try{
      const {user} = req.query
      // const toppingsList = await prisma.toppings.findMany()
      const toppingsList = await findAllDynamic('toppings')
      const pizzasList = user==='chef' ? await findAllDynamic('pizzas') : []
      const pizzaComponents = user==='chef' ? await findAllDynamic('pizza_components') : []

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
      console.log('POST')
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

        const pizza:pizzaData = await createDynamic('pizzas',[{col_name:'pizza_name',value:data.pizza.pizza_name}])
        console.log('pizza',pizza)
        data.toppings.map(async(topping:toppingData)=>
          await createDynamic('pizza_components',[
            {col_name:'pizza_id',value:pizza.pizza_id},
            {col_name:'topping_id',value:topping.topping_id}
          ])
        )
        printData()

      } else if (user === 'owner') {
        // INSERT INTO toppings (topping_name)
        // VALUES ([variable name]);
        if(data.topping_id===-999){
          createDynamic('toppings', [{col_name:'topping_name',value:data.topping_name}])
        } else {
          // update where topping_id === topping_id
          console.log("data.topping_name",data.topping_name)
          updateDynamic('toppings',{col_name:'topping_id',value:data.topping_id},{col_name:'topping_name',value:data.topping_name})
        }
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
      console.log('PUT')
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

      res.status(200).json([])
    } catch (error) {
      // console.log(error);
      res.status(403).json({ error: "Error occured." });
    }
  }

  if (req.method === 'DELETE') {
    try{
      const {user} = req.query
      const data = req.body
      console.log('DELETE')
      console.log(data)
      if (user === 'chef') {
        /*
          DELETE FROM pizzas WHERE pizza_id = [pizza id];
        */
        const result = await deleteDynamic('pizzas', {col_name:'pizza_id',value: data.pizza_id})
      } else if (user === 'owner') {
        /*
          if pizzas with topping, grab pizza ids with topping to delete. Delete pizza ids.
          DELETE FROM toppings WHERE topping_name = [variable name];
          (prisma DELETE MANY)  
          DELETE FROM pizzas WHERE pizza_id = [pizza id];  
        */

        // get array of pizza ids
        const pizzaIds = await findManyDynamic("pizza_components",{col_name:'topping_id', value: data.topping_id},{col_name:'pizza_id', value: true})
        // pizzaIds = [ { pizza_id: 1 }, { pizza_id: 2 }, { pizza_id: 3 } ]
        // console.log('pizzaIds Results:\n',pizzaIds)

        // convert to list
        const pizzaIdsList = pizzaIds.map((pizza:{pizza_id: number})=>pizza.pizza_id)
        // console.log('pizzaIdsList Results:\n',pizzaIdsList)

        await deleteManyDynamic("pizzas",{col_name:"pizza_id",value: {in: pizzaIdsList}})
        // console.log('Deleted from pizzas:\n',result1)

        await deleteDynamic('toppings', {col_name:'topping_id',value: data.topping_id})
        // console.log('Deleted from toppings:\n',result2)

      } else null

      // throw new Error('Random error') //Error testing
      res.status(200).json([])
    } catch (error) {
      // console.log(error);
      res.status(403).json({ error: "Error occured." });
    }
  }

}