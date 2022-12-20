import Head from 'next/head'
import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import {findAllDynamic} from '../prisma/utils';
import ChefComponent from '../components/ChefComponent';
import OwnerComponent from '../components/OwnerComponent';
import Footer from '../components/Footer';

import { 
  prisma,
  toppingData,
  pizzaData,
  componentData,
} from '../prisma/utils'

import {
  propType,
  mapToppings,
  pizzaAssembler,
} from '../lib/utils'

// export default function Home({toppingsList,pizzasList,componentsList}: InferGetServerSidePropsType<typeof getServerSideProps>) {
export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log('props',props)

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const refreshData = () => {
    setLoading(true)
    setTimeout(()=>{router.replace(router.asPath);setLoading(false)}, 700)
  }

  const [assembledPizzas,setAssembledPizzas] = useState<mapToppings>()
  const [data,setData] = useState<propType>(props)
  const [user,setUser] = useState<string>('')

  useEffect(()=>{
    setData(props)
    setAssembledPizzas(pizzaAssembler({toppings:props.toppings,pizzas:props.pizzas,components:props.components}))
  },[props])

  return (
    <div>
      <Head>
        <title>Pizza Project</title>
        <meta name="description" content="Pizza Project" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          It&apos;s Pizza Time
        </h1>

        <div className={styles.userSelectContainer}>
          <label htmlFor="user-select">User:</label>
          <select id="user-select" name="user" onChange={(e)=>setUser(e.target.value.toLowerCase())}>
            <option defaultValue="Select user" hidden>Select user</option>
            {['Owner','Chef','Superuser'].map(user=><option key={user} value={user}>{user}</option>)}
          </select>
        </div>

        {/*<UserComponent user='Owner' toppings={data.toppings} refreshData={refreshData} loading={loading}/>*/}
        {/*<UserComponent user='Chef' toppings={data.toppings} pizzas={data.pizzas} refreshData={refreshData} assembledPizzas={assembledPizzas} loading={loading}/>*/}
        <div className={styles.userContainer}>
          {user==='owner'||user==='superuser'?<OwnerComponent toppings={data.toppings} refreshData={refreshData} loading={loading}/>:null}
          {user==='superuser'?<span></span>:null}
          {user==='chef'||user==='superuser'?<ChefComponent toppings={data.toppings} pizzas={data.pizzas} refreshData={refreshData} assembledPizzas={assembledPizzas} loading={loading}/>:null}
        </div>
      </main>
      <Footer/>
      <div id="modal-root"></div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<propType> = async () => {
// export const getServerSideProps: GetServerSideProps<{toppingsList:toppingData[],pizzasList:pizzaData[],componentsList:componentData[]}> = async () => {
  // const data = await fetch('http://localhost:3000/api?user=chef').then(res=>res.json())
  // const {toppings, pizzas, components} = await fetch(`${process.env.API_URL}/api/users/chef`).then(res=>res.json())

  // const data:propType = {toppings:[],pizzas:[], components:[]}
  // console.log('SSR',data)
  // data.toppings = await findAllDynamic('toppings')
  // data.pizzas = await findAllDynamic('pizzas')
  // data.components = await findAllDynamic('pizza_components')


  const toppings = await findAllDynamic('toppings')
  const pizzas = await findAllDynamic('pizzas')
  const components = await findAllDynamic('pizza_components')

  // // HARD CODING
  // const toppings = [{topping_id:1, topping_name:'cheese'}]
  // const pizzas = [{pizza_id:1, pizza_name:'cheese'}]
  // const components = [{component_id:1,pizza_id:1,topping_id:1}]

  // console.log({toppings:toppings,pizzas:pizzas,components:components})

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
    props: {toppings:toppings, pizzas:pizzas, components:components}
  }
}