import Head from 'next/head'
import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import {findAllDynamic} from '../prisma/utils';
import UserComponent from '../components/UserComponent';
import Footer from '../components/Footer';

import { 
  toppingData,
  pizzaData,
  componentData,
} from '../prisma/utils'


export default function Home({toppingsList,pizzasList,componentsList}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const [toppings,setToppings] = useState<toppingData[]>(toppingsList)
  const [pizzas,setPizzas] = useState<pizzaData[]>(pizzasList)
  const [components,setComponents] = useState<componentData[]>(componentsList)

  useEffect(()=>{
    setToppings(toppingsList)
    setPizzas(pizzasList)
    setComponents(componentsList)
    console.log("useEffect",{toppings:toppings,pizzas:pizzas,components:components})
  },[toppingsList,pizzasList,componentsList])

  const handleButtonPress = async(user:string) => {
    try {
      const res = await fetch(`/api?user=${user}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({details}),
      });
      console.log(res)
    }
    catch (error) {console.log(error)}
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Pizza Project</title>
        <meta name="description" content="Pizza Project" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          It's Pizza Time
        </h1>
{/*        <UserComponent user='Owner' initialToppings={toppingsList} routerRefresh={refreshData}/>
        <UserComponent user='Chef' initialToppings={toppingsList} initialPizzas={pizzasList} initialComponents={componentsList} routerRefresh={refreshData}/>
*/}
        <UserComponent user='Owner' toppings={toppings} routerRefresh={refreshData}/>
        <UserComponent user='Chef' toppings={toppings} pizzas={pizzas} components={components} routerRefresh={refreshData}/>

{/*        <div>
          <ul>
            {JSON.stringify(toppingsList)}
            {toppingsList.map((topping:toppingData)=><li key={topping.topping_id}>{topping.topping_name}</li>)}
          </ul>
          <button onClick={()=>handleButtonPress('owner')}>I am Owner</button>
          <ul>
            {JSON.stringify(pizzasList)}
            {pizzasList.map((pizza:pizzaData)=><li key={pizza.pizza_id}>{pizza.pizza_name}</li>)}
          </ul>
          <button onClick={()=>handleButtonPress('chef')}>I am Chef</button>
        </div>*/}
        
      </main>

      <Footer/>
      <div id="modal-root"></div>
    </div>
  )
}

// import { PrismaClient } from '@prisma/client'

// export const getServerSideProps: GetServerSideProps<{ data: any }> = async () => {
export const getServerSideProps: GetServerSideProps<{toppingsList:toppingData[],pizzasList:pizzaData[],componentsList:componentData[]}> = async () => {
  const toppings = await findAllDynamic('toppings')
  const pizzas = await findAllDynamic('pizzas')
  const components = await findAllDynamic('pizza_components')
  // console.log({toppings:toppings,pizzas:pizzas,components:components})

  // const prisma = new PrismaClient()
  // const toppings:toppingData[] = await prisma.toppings.findMany()
  // const pizzas:pizzaData[] = await prisma.pizzas.findMany()
  // const components:componentData[] = await prisma.pizza_components.findMany()

  return {
    props: {
      toppingsList: toppings,
      pizzasList: pizzas,
      componentsList: components,
    },
  }
}