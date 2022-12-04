import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import {
  findManyDynamic
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
}