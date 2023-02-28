import { NamedAPIResource, Pokemon } from "pokenode-ts";
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
    let pokemons: NamedAPIResource[];
    if (input.searchQuery) {
      pokemons = await (await ctx.pokemonApi.listPokemons(0, 2000)).results;
      pokemons = pokemons.filter(({ name }) => name.includes(input.searchQuery!))
    } else {
      pokemons = await (await ctx.pokemonApi.listPokemons(input.offset, input.limit)).results;
    }
    return await Promise.all(pokemons.map(({ name }) => ctx.pokemonApi.getPokemonByName(name)))
  }),
  getPokemonInfo: protectedProcedure.input(
    z.object({
      name: z.string()
    })
  ).query(async ({ input, ctx }) => {
    const pokemon = await ctx.pokemonApi.getPokemonByName(input.name);
    return pokemon;
  }),
  getPokemonDetailedList: protectedProcedure.input(
    z.string()
  ).query(async ({ input, ctx }) => {
    const pokemons = await ctx.prisma.pokemon.findMany({ where: { deckId: input }});
    const pokemonsInDeck: Pokemon[] = await Promise.all(pokemons.map(({ name }) => ctx.pokemonApi.getPokemonByName(name)));
    return pokemonsInDeck;
  }),
  removePokemonFromDeck: protectedProcedure.input(
    z.object({
      deckId: z.string(),
      pokemonName: z.string(),
    })
  ).mutation(async ({ input, ctx }) => {
    await ctx.prisma.pokemon.deleteMany({
      where: {
        deckId: input.deckId,
        name: input.pokemonName,
      }
    })
  })
})