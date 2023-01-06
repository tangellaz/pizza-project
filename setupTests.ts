import "whatwg-fetch";
import "@testing-library/jest-dom";
import { server } from "./mocks/api/server";
import { pizzaApi } from "./lib/api";
import { makeStore } from "./redux/store";

const store = makeStore;

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen();
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  // This is the solution to clear RTK Query cache after each test
  store.dispatch(pizzaApi.util.resetApiState());
});

// Clean up after the tests are finished.
afterAll(() => server.close());
