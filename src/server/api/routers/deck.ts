import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { v4 } from 'uuid';
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Deck, User } from "@prisma/client";

export const deckRouter = createTRPCRouter({
  createDeck: protectedProcedure.input(
    z.object({
      name: z.string().min(2).max(20),
      private: z.boolean(),
    })
  ).mutation(async ({ input, ctx }): Promise<Message> => {
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
      return { id: v4(), state: 'Success', message: `Deck ${input.name} was created successfully` }
    } catch (err) {
      console.error('deck creation error', err)
      return { id: v4(), state: 'Failure', message: `Couldn't create ${input.name} deck` }
    }
  }),
  getUserDeckById: protectedProcedure
    .input(z.object({
      deckId: z.string().nullish()
    }))
    .query(async ({ input, ctx }) => {
      const deckId = input.deckId;
      if (deckId) {
        const deck = await ctx.prisma.deck.findUnique({
          where: {
            id: deckId
          }
        })
        return deck;
      } else {
        const userId = ctx.session.user.id;
        const deck = await ctx.prisma.deck.findFirst({
          where: {
            userId,
          }
        })
        return deck
      }
    }),
  getEmptyUserDecks: protectedProcedure
    .input(z.object({
      numberOfEmptySlots: z.number().nullish()
    }))
    .query(async ({input, ctx}) => {
      const numberOfSlots = input.numberOfEmptySlots ?? +env.DECK_MAX_SIZE
      const userId = ctx.session.user.id;
      const decks = await ctx.prisma.deck.findMany({
        where: {
          userId,
          deckLength: {
            lte: +env.DECK_MAX_SIZE - numberOfSlots 
          }
        }
      })
      return decks;
    }),
  getUserDecks: protectedProcedure
    .input(z.object({
      cursor: z.string().nullish(),
      limit: z.number().min(1).max(20).nullish(),
    }))
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? +env.USER_MAX_DECKS;
      const cursor = input.cursor ? { id: input.cursor } : undefined;
      const userId = ctx.session.user.id;
      const decks = await ctx.prisma.deck.findMany({
        where: {
          userId
        },
        cursor,
        take: limit + 1
      });
      let nextCursor = undefined;
      if (decks.length > limit) {
        nextCursor = decks.pop()?.id;
      }
      return {
        decks,
        nextCursor
      }
    }),
  getOthersUsersDecks: protectedProcedure.input(
    z.object({
      limit: z.number().min(1).max(10),
      cursor: z.string().nullish(),
    }))
    .query(async ({ input, ctx }) => {
      const limit = input.limit;
      const cursor = input.cursor ? { id: input.cursor } : undefined;
      const userId = ctx.session.user.id;
      const decks: (Deck & { user: User})[] = await ctx.prisma.deck.findMany({
        where: {
          userId: {
            not: userId,
          },
          private: false,
        },
        include: {
          user: true,
        },
        cursor,
        take: limit + 1,
      })
      const decksLength = await ctx.prisma.deck.count()
      let nextCursor = undefined;
      if (decks.length > limit) {
        nextCursor = decks.pop()?.id;
      }
      return {
        decks: decks.map((deck) => ({ ...deck, username: deck.user.name})),
        decksLength,
        nextCursor
      }
    }),
  removeUserDeck: protectedProcedure.input(
    z.string()
  ).mutation(async ({ input, ctx }): Promise<Message> => {
    try {
      await ctx.prisma.deck.delete({
        where: {
          id: input,
        }
      })
      return { id: v4(), state: 'Success', message: 'Deck was successfully removed' }
    } catch (err) {
      console.error('Error during removing deck', err);
      return { id: v4(), state: 'Failure', message: "Couldn't remove the deck" }
    }
  }),
  addCardsToDecks: protectedProcedure.input(
    z.object({
      decksIds: z.string().array(),
      cards: z.object({
        name: z.string(),
        imageUrl: z.string(),
      }).array(),
    })
  ).mutation(async ({ input, ctx }): Promise<Message> => {
    try {
      const decks = await ctx.prisma.deck.findMany({
        where: {
          OR: input.decksIds.map((id) => ({
            id
          }))
        }
      })
      await Promise.all(decks
        .filter((deck) => !deck.isFull && deck.deckLength + input.cards.length <= Number(env.DECK_MAX_SIZE))
        .map(async (deck) => await ctx.prisma.deck.update({
          where: {
            id: deck.id,
          }, data: {
            isEmpty: false,
            isFull: deck.deckLength + input.cards.length == Number(env.DECK_MAX_SIZE),
            deckLength: deck.deckLength + input.cards.length,
            deck: { create: input.cards }
          }
        })))
      return { id: v4(), state: 'Success', message: 'Card(s) where successfully added to the deck(s)' }
    } catch (err) {
      console.error('Error during adding cards to deck', err);
      return { id: v4(), state: 'Failure', message: 'Something went wrong...( Please try again later' }
    }
  }),
})