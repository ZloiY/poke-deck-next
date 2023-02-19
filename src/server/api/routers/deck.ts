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
          private: input.private
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
  removeUserDeck: protectedProcedure.input(
    z.string()
  ).mutation(async ({ input, ctx }) => {
    await ctx.prisma.deck.delete({
      where: {
        id: input,
      }
    })
  })
})