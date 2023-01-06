import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mapToppings } from "../lib/utils";

// type InitialState = { assembledPizzas: mapToppings | undefined };
// const initialState: InitialState = { assembledPizzas: {} };
type InitialState = mapToppings | undefined;
const initialState: InitialState = {};

const assembledPizzasSlice = createSlice({
  name: "assembledPizza",
  initialState: initialState,
  reducers: {
    setAssembledPizzas: (state, action: PayloadAction<mapToppings>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const assembledPizzasReducer = assembledPizzasSlice.reducer;

export const { setAssembledPizzas } = assembledPizzasSlice.actions;
