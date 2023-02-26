import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const deckRouter = createTRPCRouter({
  createDeck: protectedProcedure.input(
    z.object({
      name: z.string().min(2).max(20),
      private: z.boolean(),
    })
  ).mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user.id;
    try {
      await ctx.prisma.deck.create({
        data: {
          userId: userId,
          name: input.name,
          private: input.private,
          isEmpty: true,
          isFull: false,
          deckLength: 0
        }
      })
    } catch (err) {
      console.log('deck creation error', err)
    }
  }),
  getUserDecks: protectedProcedure.input(z.string().nullable().optional().transform(value => value ?? null)).query(async ({ input, ctx }) => {
    if (input) {
      return [await ctx.prisma.deck.findFirstOrThrow({ where: { id: input } })];
    } else {
      const userId = ctx.session.user.id;
      const decks = await ctx.prisma.deck.findMany({
        where: {
          userId
        }
      });
      return decks;
    }
  }),
  getPokemonsByDeckId: protectedProcedure
    .input(z.string())
    .query(async ({input, ctx}) => {
      return await ctx.prisma.pokemon.findMany({ where: { deckId: input }})
    }),
  removeUserDeck: protectedProcedure.input(
    z.string()
  ).mutation(async ({ input, ctx }) => {
    await ctx.prisma.deck.delete({
      where: {
        id: input,
      }
    })
  }),
  addCardsToDecks: protectedProcedure.input(
    z.object({
      decksIds: z.string().array(),
      cards: z.object({
        name: z.string(),
        imageUrl: z.string(),
      }).array(),
    })
  ).mutation(async ({ input, ctx }) => {
    const decks = await ctx.prisma.deck.findMany({
      where: {
        OR: input.decksIds.map((id) => ({
          id
        }))
      }
    })
    await Promise.all(decks
      .filter((deck) => !deck.isFull && deck.deckLength + input.cards.length <= Number(process.env.DECK_MAX_SIZE))
      .map(async (deck) => await ctx.prisma.deck.update({ where: {
      id: deck.id,
    }, data: {
      isEmpty: false,
      isFull: deck.deckLength + input.cards.length == Number(process.env.DECK_MAX_SIZE),
      deckLength: deck.deckLength + input.cards.length,
      deck: { create: input.cards }
    }})))
  })
})