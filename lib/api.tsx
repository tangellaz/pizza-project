import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pizzaApi = createApi({
  reducerPath: "pizzaApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.API_URL}api` }),
  tagTypes: ["Topping", "Pizza"],
  endpoints: (build) => ({
    getData: build.query<propType, void>({
      query: () => "",
      providesTags: ["Topping", "Pizza"],
    }),
    editTopping: build.mutation<void, toppingData>({
      query: (topping) => ({
        url: "/users/owner",
        method: "POST",
        body: topping,
      }),
      invalidatesTags: ["Topping"],
    }),
    deleteTopping: build.mutation<void, toppingData>({
      query: (topping) => ({
        url: "/users/owner",
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
        url: "/users/chef",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pizza"],
    }),
    deletePizza: build.mutation<void, pizzaData>({
      query: (data) => ({
        url: "/users/chef",
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
