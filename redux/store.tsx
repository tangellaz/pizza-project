import { configureStore } from "@reduxjs/toolkit";
import { pizzaApi } from "../lib/api";
import { assembledPizzasReducer } from "./assembled-pizzas.slice";
import { pizzasReducer } from "./pizzas.slice";
import { toppingsReducer } from "./toppings.slice";

export const makeStore = configureStore({
  reducer: {
    [pizzaApi.reducerPath]: pizzaApi.reducer,
    assembledPizzas: assembledPizzasReducer,
    pizzas: pizzasReducer,
    toppings: toppingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pizzaApi.middleware),
});
export type RootState = ReturnType<typeof makeStore.getState>;
export type AppDispatch = typeof makeStore.dispatch;
