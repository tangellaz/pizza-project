import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// type InitialState = { assembledPizzas: mapToppings | undefined };
// const initialState: InitialState = { assembledPizzas: {} };
type InitialState = mapToppings | undefined;
const initialState: InitialState = {};

const assembledPizzasSlice = createSlice({
  name: "assembledPizza",
  initialState: initialState,
  reducers: {
    // setAssembledPizzas: (state, action: PayloadAction<mapToppings>) => {
    //   return { ...state, ...action.payload };
    // },
    setAssembledPizzas: (state, action: PayloadAction<mapToppings>) => {
      const next = { ...state };
      Object.keys(state).forEach((key) => {
        action.payload.hasOwnProperty(key) ? null : delete next[key];
      });
      return { ...next, ...action.payload };
    },
  },
});

export const assembledPizzasReducer = assembledPizzasSlice.reducer;

export const { setAssembledPizzas } = assembledPizzasSlice.actions;
