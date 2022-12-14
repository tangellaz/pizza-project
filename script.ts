// Run this file using >npx ts-node script.ts

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

interface ColAndVal {
  col_name:string;
  value:string|number;
}

async function main() {
  // Add record
  // const topping = await prisma.toppings.create({
  //   data: {
  //     topping_name: 'Pepperoni',
  //   },
  // })
  // console.log(topping)

  // // Add record function
  // const addTopping = async (topping:string) => {
  //   await prisma.toppings.create({
  //     data: {
  //       topping_name: topping,
  //     },
  //   })
  // }
  // addTopping('Pepperonis')

  // const createDynamic = async(table:PrismaModelName,col_name:string,value:string) => {
  //   //@ts-ignore
  //   return await prisma[table].create({
  //     data: {
  //       [col_name]: value 
  //     }
  //   }).then((result:any)=>console.log('result',result))
  //   .catch((err:any)=>console.log(err))
  // }

  // Create dynamic for multi column
  // // createDynamic('toppings',[{col_name:'toppings_id',value:1},{col_name:'toppings_name',value:'cheese'}])
  const createDynamic = async(table:PrismaModelName,arr:ColAndVal[]) => {
    // const dataObj = {}
    // arr.map((obj:{col_name:string;value:string|number}) => Object.assign(dataObj,{[obj.col_name]: obj.value}))
    const dataObj = arr.reduce((accumObj,currObj) => Object.assign(accumObj,{[currObj.col_name]: currObj.value}),{})
    console.log(dataObj)
    //@ts-ignore
    return await prisma[table].create({
      data: dataObj
    }).then((result:any)=>console.log('result',result))
    .catch((err:any)=>console.log(err))
  }

  // Create many dynamic for multi column
  // Note: createMany is not supported in sqlite
  const createManyDynamic = (table:PrismaModelName,arr:ColAndVal[][]) => {
    arr.map(async(dataArray)=> await createDynamic(table,dataArray))
  }

  // // Find records
  // const toppings = await prisma.toppings.findMany()
  // // console.log(prisma)
  // console.log(toppings)

const findAllDynamic = async(table:PrismaModelName) => {
  //@ts-ignore
  return await prisma[table].findMany()
  .then((result:any)=>result)
  .catch((err:any)=>err)
}

const findManyDynamic = async(table:PrismaModelName,where:ColAndVal) => {
  //@ts-ignore
  return await prisma[table].findMany({
    where: {
      [where.col_name]: where.value
    }
  })
  .then((result:any)=>result)
  .catch((err:any)=>err)
}

  // // Update record by unique field
  const updateDynamic = async(table:PrismaModelName,where:ColAndVal,data:ColAndVal) => {
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
  const updateManyDynamic = async(table:PrismaModelName,where:ColAndVal,data:ColAndVal) => {
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
  const deleteDynamic = async(table:PrismaModelName,where:ColAndVal) => {
    //@ts-ignore
    return await prisma[table].delete({
      where: {
        [where.col_name]: where.value 
      }
    }).then((result:any)=>console.log('deleted',result))
    .catch((err:any)=>console.log(err))
  }

  // // Delete records
  const deleteManyDynamic = async(table:PrismaModelName,where:ColAndVal) => {
    //@ts-ignore
    return await prisma[table].deleteMany({
      where: {
        [where.col_name]: where.value 
      }
    }).then((result:any)=>console.log('deleted',result))
    .catch((err:any)=>console.log(err))
  }

  // console.log(await createDynamic('toppings',[{col_name:'topping_id',value:3},{col_name:'topping_name',value:'sausage'}]))
  // console.log(await createDynamic('toppings',[{col_name:'topping_id',value:2},{col_name:'topping_name',value:'cheese'}]))
  // console.log(await createDynamic('toppings',[{col_name:'topping_name',value:'pepperoni'}]))
  // console.log(await createManyDynamic('toppings',[[{col_name:'topping_name',value:'pepperoni'}],[{col_name:'topping_name',value:'sausage'}]]))

  // console.log(await updateDynamic('toppings',{col_name:'topping_id',value:8},{col_name:'topping_name',value:'pepperoni2'}))

  // console.log(await deleteDynamic('toppings',{col_name:'topping_id',value:4}))
  // console.log(await deleteManyDynamic('toppings',{col_name:'topping_name',value:'cheese'}))
  // console.log(await deleteManyDynamic('toppings',{col_name:'topping_name',value:'sausage'}))
  // console.log(await deleteManyDynamic('toppings',{col_name:'topping_name',value:'pepperoni2'}))

  console.log(await findAllDynamic('toppings'))

  // console.log(await createManyDynamic('pizzas',[[{col_name:'pizza_name',value:'pepperoni'}],[{col_name:'pizza_name',value:'cheese'}],[{col_name:'pizza_name',value:'meat lover'}]]))
  // console.log(await updateDynamic('pizzas',{col_name:'pizza_id',value:1},{col_name:'pizza_name',value:'pepperoni'}))
  // console.log(await updateDynamic('pizzas',{col_name:'pizza_id',value:2},{col_name:'pizza_name',value:'cheese'}))
  // console.log(await updateDynamic('pizzas',{col_name:'pizza_id',value:3},{col_name:'pizza_name',value:'meat lover'}))
  console.log(await findAllDynamic('pizzas'))

  // console.log(
  //   await createManyDynamic('pizza_components',[
  //     [{col_name:'pizza_id',value:1},{col_name:'topping_id',value:1}],
  //     [{col_name:'pizza_id',value:1},{col_name:'topping_id',value:2}],
  //     [{col_name:'pizza_id',value:2},{col_name:'topping_id',value:2}],
  //     [{col_name:'pizza_id',value:3},{col_name:'topping_id',value:1}],
  //     [{col_name:'pizza_id',value:3},{col_name:'topping_id',value:2}],
  //     [{col_name:'pizza_id',value:3},{col_name:'topping_id',value:3}]
  //     ]
  //   )
  // )
  console.log(await deleteManyDynamic('pizza_components',{col_name:'pizza_id',value:26}))
  console.log(await findAllDynamic('pizza_components'))
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })