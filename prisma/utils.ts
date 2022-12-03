import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

type IgnorePrismaBuiltins<S extends string> = string extends S
  ? string
  : S extends ''
  ? S
  : S extends `$${infer T}`
  ? never
  : S;

export type PrismaModelName = IgnorePrismaBuiltins<keyof PrismaClient>;

export interface ColAndVal {
  col_name:string;
  value:string|number;
}

export type toppingData = {"topping_id":number;"topping_name":string}
export type pizzaData = {"pizza_id":number;"pizza_name":string}
export type componentData = {"component_id":number;"pizza_id":number|null;"topping_id":number|null}

// Create dynamic for multi column
export const createDynamic = async(table:PrismaModelName,arr:ColAndVal[]) => {
  // const dataObj = {}
  // arr.map((obj:{col_name:string;value:string|number}) => Object.assign(dataObj,{[obj.col_name]: obj.value}))
  const dataObj = arr.reduce((accumObj,currObj) => Object.assign(accumObj,{[currObj.col_name]: currObj.value}),{})

  //@ts-ignore
  return await prisma[table].create({
    data: dataObj
  }).then((result:any)=>console.log('result',result))
  .catch((err:any)=>console.log(err))
}

// Create many dynamic for multi column
// Note: createMany is not supported in sqlite
export const createManyDynamic = (table:PrismaModelName,arr:ColAndVal[][]) => {
  arr.map((dataArray)=>createDynamic(table,dataArray))
}

// // Find records
// const toppings = await prisma.toppings.findMany()
// // console.log(prisma)
// console.log(toppings)

export const findManyDynamic = async(table:PrismaModelName) => {
  //@ts-ignore
  return await prisma[table].findMany()
  .then((result:any)=>result)
  .catch((err:any)=>console.log(err))
}

// // Update record by unique field
export const updateDynamic = async(table:PrismaModelName,where:ColAndVal,data:ColAndVal) => {
  //@ts-ignore
  return await prisma[table].update({
    where: {
      [where.col_name]: where.value
    },
    data: {
      [data.col_name]: data.value 
    }
  }).then((result:any)=>console.log('updated',result))
  .catch((err:any)=>console.log(err))
}
// // Update many. Might not need...
export const updateManyDynamic = async(table:PrismaModelName,where:ColAndVal,data:ColAndVal) => {
  //@ts-ignore
  return await prisma[table].updateMany({
    where: {
      [where.col_name]: where.value
    },
    data: {
      [data.col_name]: data.value 
    }
  }).then((result:any)=>console.log('updated',result))
  .catch((err:any)=>console.log(err))
}

// // Delete record on unique field
// const deleteTopping = await prisma.toppings.delete({
//   where: {
//     topping_id: 1,
//   },
// })
// console.log(toppings)

// // Delete record on unique field
export const deleteDynamic = async(table:PrismaModelName,where:ColAndVal) => {
  //@ts-ignore
  return await prisma[table].delete({
    where: {
      [where.col_name]: where.value 
    }
  }).then((result:any)=>console.log('deleted',result))
  .catch((err:any)=>console.log(err))
}

// // Delete records
export const deleteManyDynamic = async(table:PrismaModelName,where:ColAndVal) => {
  //@ts-ignore
  return await prisma[table].deleteMany({
    where: {
      [where.col_name]: where.value 
    }
  }).then((result:any)=>console.log('deleted',result))
  .catch((err:any)=>console.log(err))
}