import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = pizzaData[] | undefined;
const initialState: InitialState = [];

const pizzasSlice = createSlice({
  name: "pizzas",
  initialState: initialState,
  reducers: {
    setPizzas: (state, action: PayloadAction<pizzaData[]>) => {
      const stateFiltered = state.filter((pizza) =>
        action.payload.includes(pizza)
      );
      const payloadFiltered = action.payload.filter(
        (pizza) => !state.includes(pizza)
      );
      return [...stateFiltered, ...payloadFiltered];
    },
  },
});

export const pizzasReducer = pizzasSlice.reducer;

export const { setPizzas } = pizzasSlice.actions;
