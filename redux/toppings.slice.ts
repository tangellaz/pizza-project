import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = toppingData[] | undefined;
const initialState: InitialState = [];

const toppingsSlice = createSlice({
  name: "toppings",
  initialState: initialState,
  reducers: {
    setToppings: (state, action: PayloadAction<toppingData[]>) => {
      const stateFiltered = state.filter((topping) =>
        action.payload.includes(topping)
      );
      const payloadFiltered = action.payload.filter(
        (topping) => !state.includes(topping)
      );
      return [...stateFiltered, ...payloadFiltered];
    },
  },
});

export const toppingsReducer = toppingsSlice.reducer;

export const { setToppings } = toppingsSlice.actions;
