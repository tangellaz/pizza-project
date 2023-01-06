import { rest } from "msw";

export const handlers = [
  rest.post("http://localhost:3000/api/users/owner", (req, res, ctx) => {
    // successful response
    return res(ctx.status(201), ctx.json({}));
  }),
];
