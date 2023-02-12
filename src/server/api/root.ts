import { createTRPCRouter } from "./trpc";
import { authRouter } from "./routers/auth";
import { pokemonRouter } from "./routers/pokemon";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  pokemon: pokemonRouter 
});

// export type definition of API
export type AppRouter = typeof appRouter;
