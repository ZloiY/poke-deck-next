import { NamedAPIResource } from "pokenode-ts";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const pokemonRouter = createTRPCRouter({
  getPokemonList: protectedProcedure.input(
    z.object({
      offset: z.number(),
      limit: z.number(),
      searchQuery: z.string().nullable().optional(),
    })
  ).query(async ({ input, ctx }) => {
    if (input.searchQuery) {
      const pokemons: NamedAPIResource[] = await (await ctx.pokemonApi.listPokemons(0, 2000)).results;
      return pokemons.filter(({ name }) => name.includes(input.searchQuery!))
    } else {
      const pokemons = await (await ctx.pokemonApi.listPokemons(input.offset, input.limit)).results;
      return pokemons;
    }
  }),
  getPokemonInfo: protectedProcedure.input(
    z.object({
      name: z.string()
    })
  ).query(async ({ input, ctx }) => {
    const pokemon = await ctx.pokemonApi.getPokemonByName(input.name);
    return pokemon;
  }),
  searchPokemonByName: protectedProcedure.input(
    z.string().min(2)
  ).query(async ({ input, ctx }) => {

  })
})