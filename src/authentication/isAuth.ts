import { MiddlewareFn } from "type-graphql";

import { MyContext } from "../types/MyContext";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session!.userId) {
    /**
     * If you want to continue run other middleware below this one, call the next()
     */
    // next();
    throw new Error("Not Authenticated!");
  }

  return next();
};
