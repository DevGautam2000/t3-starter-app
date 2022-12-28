import { router } from "../trpc";
import { itemRouter } from "./item";

export const appRouter = router({
  shoppingList: itemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
