import { TRPCError } from "@trpc/server";
import sha256 from 'crypto-js/sha256';
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

const alphabet = [[33, 38], [48,57], [60, 90], [97, 122]] as const;

const passwordRegEx = /[\w(@|#|$|&)+]{6}/g;

const saltGeneration = () => {
  const charAlphabet = alphabet.map(([firstCharCode, lastCharCode]) => {
    let currentCharCode: number = firstCharCode;
    const chars: string[] = [];
    while (currentCharCode != lastCharCode) {
      chars.push(String.fromCharCode(currentCharCode))
      currentCharCode++;
    }
    return chars;
  }).flat();
  const saltLength = Array.from(Array(Math.floor(Math.random() * (10 - 6) + 6)).keys());
  return saltLength
    .map(() => charAlphabet[Math.floor(Math.random() * (charAlphabet.length - 1))])
    .join('');
}

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(z.object({
      username: z.string().min(3),
      password: z.string().regex(passwordRegEx),
      repeatPassword: z.string().regex(passwordRegEx),
    }))
    .mutation(async ({ input, ctx }) => {
      if (input.password !== input.repeatPassword) {
        throw new TRPCError({
          message: 'Password are not the same',
          code: 'BAD_REQUEST',
        })
      }
      const salt = saltGeneration();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const hash: string = sha256(`${input.password}${salt}`).toString();
      try {
        await ctx.prisma.user.create({
          data: {
            name: input.username,
            salt,
            hash,
          }
        })
      } catch (prismaError) {
         console.log('User create error: ', prismaError);
         throw new TRPCError({
            message: 'User creation error',
            code: 'BAD_REQUEST',
            cause: prismaError
         })
      }
    })
})