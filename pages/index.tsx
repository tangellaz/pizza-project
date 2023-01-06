import Head from "next/head";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { GetServerSideProps } from "next";
import { InferGetServerSidePropsType } from "next";
import { findAllDynamic } from "../prisma/utils";
import Chef from "../components/chef/chef";
import Owner from "../components/owner/owner";
import Footer from "../components/footer/footer";

import { useGetDataQuery } from "../lib/api";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setAssembledPizzas } from "../redux/assembled-pizzas.slice";

import { propType, mapToppings, pizzaAssembler } from "../lib/utils";

// export default function Home({toppingsList,pizzasList,componentsList}: InferGetServerSidePropsType<typeof getServerSideProps>) {
export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  console.log("props", props);
  const { data, error, isLoading, isFetching, isSuccess } = useGetDataQuery();

  // const [assembledPizzas, setAssembledPizzas] = useState<mapToppings>();
  const assembledPizzas = useAppSelector((state) => state.assembledPizzas);
  const dispatch = useAppDispatch();

  const [propsData, setPropsData] = useState<propType>(props);
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    // use SSR props on load
    // setPropsData(props);
    // setAssembledPizzas(
    dispatch(
      setAssembledPizzas(
        pizzaAssembler({
          toppings: props.toppings,
          pizzas: props.pizzas,
          components: props.components,
        })
      )
    );
  }, []);
  useEffect(() => {
    // swap to rtk-query data on client
    if (data) {
      setPropsData(data);
      // setAssembledPizzas(
      dispatch(
        setAssembledPizzas(
          pizzaAssembler({
            toppings: data.toppings,
            pizzas: data.pizzas,
            components: data.components,
          })
        )
      );
    }
  }, [data]);

  return (
    <div>
      <Head>
        <title>Pizza Project</title>
        <meta name="description" content="Pizza Project" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>It&apos;s Pizza Time</h1>

        <div className={styles.userSelectContainer}>
          <label htmlFor="user-select">User:</label>
          <select
            id="user-select"
            name="user"
            onChange={(e) => setUser(e.target.value.toLowerCase())}
          >
            <option defaultValue="Select user" hidden>
              Select user
            </option>
            {["Owner", "Chef", "Superuser"].map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.userContainer}>
          {user === "owner" || user === "superuser" ? (
            <Owner toppings={propsData.toppings} />
          ) : null}
          {user === "superuser" ? <span></span> : null}
          {user === "chef" || user === "superuser" ? (
            <Chef
              toppings={propsData.toppings}
              pizzas={propsData.pizzas}
              assembledPizzas={assembledPizzas}
            />
          ) : null}
        </div>
      </main>
      <Footer />
      <div id="modal-root"></div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<propType> = async () => {
  const toppings = await findAllDynamic("toppings");
  const pizzas = await findAllDynamic("pizzas");
  const components = await findAllDynamic("pizza_components");

  return {
    props: { toppings: toppings, pizzas: pizzas, components: components },
  };
};
