import { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "./redux/store";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export function renderWithProviders(
  ui: React.ReactElement,
  {
    // preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = makeStore,
    ...renderOptions
  } = {}
) {
  setupListeners(store.dispatch);

  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
