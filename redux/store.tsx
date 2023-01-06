import { configureStore } from "@reduxjs/toolkit";
import { pizzaApi } from "../lib/api";

export const makeStore = configureStore({
  reducer: {
    [pizzaApi.reducerPath]: pizzaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pizzaApi.middleware),
});
