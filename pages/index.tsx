import Head from "next/head";
import { useState, useEffect } from "react";

import styles from "../styles/Home.module.css";
import Chef from "../components/chef/chef";
import Owner from "../components/owner/owner";
import Footer from "../components/footer/footer";

import { useGetDataQuery } from "../lib/api";

import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setAssembledPizzas } from "../redux/assembled-pizzas.slice";
import { setToppings } from "../redux/toppings.slice";
import { setPizzas } from "../redux/pizzas.slice";

import { pizzaAssembler } from "../lib/utils";

export default function Home() {
  const { data, error, isLoading, isFetching, isSuccess } = useGetDataQuery();
  // console.log("data", data);
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<string>("");

  useEffect(() => {
    if (data) {
      dispatch(
        setAssembledPizzas(
          pizzaAssembler({
            toppings: data.toppings,
            pizzas: data.pizzas,
            combinedList: data.combinedList,
          })
        )
      );
      dispatch(setToppings(data.toppings));
      dispatch(setPizzas(data.pizzas));
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
          {(user === "owner" || user === "superuser") && data ? (
            <Owner />
          ) : null}
          {user === "superuser" ? <span></span> : null}
          {(user === "chef" || user === "superuser") && data ? <Chef /> : null}
        </div>
      </main>
      <Footer />
      <div id="modal-root"></div>
    </div>
  );
}
