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

interface mapToppings {
  [key: string]: toppingData[]
}


// export default function Home({toppingsList,pizzasList,componentsList}: InferGetServerSidePropsType<typeof getServerSideProps>) {
export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log('props',props)
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath);
  }
  const [assembledPizzas,setAssembledPizzas] = useState<mapToppings>()
  const pizzaAssembler = (toppings:toppingData[],pizzas:pizzaData[],components:componentData[]) => {
    // interface mapToppings{
    //   [key: string]: string[]
    // }
    let mapToppings: mapToppings = {}
    
    // create map object of empty arrays
    pizzas.map(pizza=>{mapToppings[pizza.pizza_id] = []})
    
    // map through component data,
    //   find the topping element
    //   push topping to mapToppings array
    components.map(component=>{
      const topping = toppings.find(topping => component.topping_id===topping.topping_id)
      topping && component.pizza_id!=null ? mapToppings[component.pizza_id].push(topping) : null
    })
    return mapToppings
  }

  // const [toppings,setToppings] = useState<toppingData[]>(toppingsList)
  // const [pizzas,setPizzas] = useState<pizzaData[]>(pizzasList)
  // const [components,setComponents] = useState<componentData[]>(componentsList)
  // useEffect(()=>{
  //   setToppings(toppingsList)
  //   setPizzas(pizzasList)
  //   setComponents(componentsList)
  //   console.log("useEffect",{toppings:toppings,pizzas:pizzas,components:components})
  // },[toppingsList,pizzasList,componentsList])

  const [data,setData] = useState<propType>(props)
  useEffect(()=>{
    setData(props)
    setAssembledPizzas(pizzaAssembler(props.toppings,props.pizzas,props.components))
  },[props])

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
{/*        <UserComponent user='Owner' toppings={toppings} routerRefresh={refreshData}/>
        <UserComponent user='Chef' toppings={toppings} pizzas={pizzas} components={components} routerRefresh={refreshData}/>*/}
        
        <UserComponent user='Owner' toppings={data.toppings} refreshData={refreshData}/>
        <UserComponent user='Chef' toppings={data.toppings} pizzas={data.pizzas} components={data.components} refreshData={refreshData} assembledPizzas={assembledPizzas}/>

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

type propType = {
  toppings: toppingData[],
  pizzas: pizzaData[],
  components: componentData[],
}
export const getServerSideProps: GetServerSideProps<propType> = async () => {
// export const getServerSideProps: GetServerSideProps<{toppingsList:toppingData[],pizzasList:pizzaData[],componentsList:componentData[]}> = async () => {
  // const data = await fetch('http://localhost:3000/api?user=chef').then(res=>res.json())
  
  // const data:propType = {toppings:[],pizzas:[], components:[]}
  // console.log('SSR',data)
  // data.toppings = await findAllDynamic('toppings')
  // data.pizzas = await findAllDynamic('pizzas')
  // data.components = await findAllDynamic('pizza_components')

  const toppings = await findAllDynamic('toppings')
  const pizzas = await findAllDynamic('pizzas')
  const components = await findAllDynamic('pizza_components')

  // console.log({toppings:toppings,pizzas:pizzas,components:components})

  // const prisma = new PrismaClient()
  // const toppings:toppingData[] = await prisma.toppings.findMany()
  // const pizzas:pizzaData[] = await prisma.pizzas.findMany()
  // const components:componentData[] = await prisma.pizza_components.findMany()

  // return {
  //   props: {
  //     toppingsList: toppings,
  //     pizzasList: pizzas,
  //     componentsList: components,
  //   },
  // }
  // return {
  //   props: data
  // }
  return {
    props: {toppings:toppings,pizzas:pizzas, components:components}
  }
}