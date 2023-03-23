import { authRouter } from "./routers/auth";
import { deckRouter } from "./routers/deck";
import { pokemonRouter } from "./routers/pokemon";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  pokemon: pokemonRouter,
  deck: deckRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
