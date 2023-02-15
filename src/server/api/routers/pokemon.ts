import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const pokemonRouter = createTRPCRouter({
  getPokemonList: protectedProcedure.input(
    z.object({
      offset: z.number(),
      limit: z.number(),
    })
  ).query(async ({ input, ctx }) => {
    const pokemons = await (await ctx.pokemonApi.listPokemons(input.offset, input.limit)).results;
    return pokemons;
  }),
  getPokemonInfo: protectedProcedure.input(
    z.object({
      name: z.string()
    })
  ).query(async ({ input, ctx }) => {
    const pokemon = await ctx.pokemonApi.getPokemonByName(input.name);
    return pokemon;
  })
})