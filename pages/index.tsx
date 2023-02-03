import Head from "next/head";
import { useState, useEffect, useRef } from "react";

import styles from "../styles/Home.module.css";
import Chef from "../components/chef/chef";
import Owner from "../components/owner/owner";
import Footer from "../components/footer/footer";

import { useGetDataQuery } from "../lib/api";

import { titleCase } from "../lib/utils";

import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setAssembledPizzas } from "../redux/assembled-pizzas.slice";
import { setToppings } from "../redux/toppings.slice";
import { setPizzas } from "../redux/pizzas.slice";

import { pizzaAssembler } from "../lib/utils";

export default function Home() {
  const { data, error, isLoading, isFetching, isSuccess } = useGetDataQuery();
  // console.log("data", data);
  const dispatch = useAppDispatch();
  const userOptionsRef = useRef<HTMLDivElement>(null);
  const dropdownsRef = useRef<HTMLUListElement>(null);
  const [user, setUser] = useState<string>("Select user");
  const [showUserOptions, setShowUserOptions] = useState<boolean>(false);

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

  useEffect(() => {
    const closeUserOptions = (e: MouseEvent) => {
      if (
        // e.target !== userOptionsRef.current ||
        userOptionsRef.current &&
        !userOptionsRef.current.contains(e.target as Node)
      ) {
        setShowUserOptions(false);
      }
    };
    window.addEventListener("mousedown", closeUserOptions);
    return () => window.removeEventListener("mousedown", closeUserOptions);
  }, []);

  return (
    <div>
      <Head>
        <title>Pizza Project</title>
        <meta name="description" content="Pizza Project" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>It&apos;s Pizza Time</h1>

        <div className={styles.userSelectContainer} ref={userOptionsRef}>
          <label htmlFor="user-select">User:</label>
          <div className={styles.dropdownContainer}>
            <div
              className={styles.inputWrapper}
              onClick={() => {
                setShowUserOptions(!showUserOptions);
                dropdownsRef.current && dropdownsRef.current.focus();
              }}
            >
              <input id="user-select" readOnly value={titleCase(user)} />
              <img
                src="/expand.svg"
                decoding="async"
                width="12"
                height="7.1"
                alt="expand"
              />
            </div>
            {showUserOptions ? (
              <ul
                className={styles.dropdowns}
                ref={dropdownsRef}
                // onBlur={() => setShowUserOptions(false)}
                // onMouseOut={() => setShowUserOptions(false)}
                tabIndex={0}
              >
                {["Owner", "Chef", "Superuser"].map((userOption) =>
                  userOption.toLowerCase() != user.toLowerCase() ? (
                    <li
                      key={userOption}
                      onClick={() => {
                        setUser(userOption.toLowerCase());
                        setShowUserOptions(false);
                      }}
                    >
                      {userOption}
                    </li>
                  ) : null
                )}
              </ul>
            ) : null}
          </div>
          {/*          <select
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
          </select>*/}
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
