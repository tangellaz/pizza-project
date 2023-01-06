import { resolve } from "./resolve";

type dataType =
  | pizzaData
  | toppingData
  | { pizza: pizzaData; toppings: toppingData[] };

export const handleRequest = async (
  user: "chef" | "owner",
  method: "DELETE" | "POST",
  data: dataType
) => {
  // return await resolve(fetch(`/api/users/${user}`, {
  //   method: method,
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // }))
  return fetch(`/api/users/${user}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res)
    .catch((e) => console.log("Error: ", e));
};

// export const deletePizza = async(pizza: pizzaData) => {
//   // return await resolve(fetch('/api?user=chef', {
//   return await resolve(fetch('/api/users/chef', {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(pizza),
//   }).then())
// }

// export const submitPizza = async(data: {pizza:pizzaData,toppings:toppingData[]}) => {
//   // return await resolve(fetch('/api?user=chef', {
//   return await resolve(fetch('/api/users/chef', {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   }).then())
// }

// export const deleteTopping = async(topping: toppingData) => {
//   // return await resolve(fetch('/api?user=owner', {
//   return await resolve(fetch('/api/users/owner', {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(topping),
//   }).then())
// }

// export const submitTopping = async(topping: toppingData) => {
//   // return await resolve(fetch('/api?user=owner', {
//   return await resolve(fetch('/api/users/owner', {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(topping),
//   }).then())
// }

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { propType } from "./utils";

export const pizzaApi = createApi({
  reducerPath: "pizzaApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.API_URL}api/` }),
  tagTypes: ["Topping", "Pizza"],
  endpoints: (build) => ({
    getData: build.query<propType, void>({
      query: () => "users/chef",
      providesTags: ["Topping", "Pizza"],
    }),
    editTopping: build.mutation<void, toppingData>({
      query: (topping) => ({
        url: "users/owner",
        method: "POST",
        body: topping,
      }),
      invalidatesTags: ["Topping"],
    }),
    deleteTopping: build.mutation<void, toppingData>({
      query: (topping) => ({
        url: "users/owner",
        method: "DELETE",
        body: topping,
      }),
      invalidatesTags: ["Topping"],
    }),
    editPizza: build.mutation<
      void,
      { pizza: pizzaData; toppings: toppingData[] }
    >({
      query: (data) => ({
        url: "users/chef",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pizza"],
    }),
    deletePizza: build.mutation<void, pizzaData>({
      query: (data) => ({
        url: "users/chef",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Pizza"],
    }),
  }),
});

export const {
  useGetDataQuery,
  useEditToppingMutation,
  useDeleteToppingMutation,
  useEditPizzaMutation,
  useDeletePizzaMutation,
} = pizzaApi;
