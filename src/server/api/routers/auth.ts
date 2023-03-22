import sha256 from "crypto-js/sha256";
import { v4 } from "uuid";
import { z } from "zod";

import { env } from "../../../env/server.mjs";
import {
  Token,
  createToken,
  decodeToken,
  getToken,
} from "../../../utils/token";
import { createTRPCRouter, publicProcedure } from "../trpc";

const alphabet = [
  [33, 38],
  [48, 57],
  [60, 90],
  [97, 122],
] as const;

const passwordRegEx = /[\w(@|#|$|&)+]{6}/g;

const saltGeneration = () => {
  const charAlphabet = alphabet
    .map(([firstCharCode, lastCharCode]) => {
      let currentCharCode: number = firstCharCode;
      const chars: string[] = [];
      while (currentCharCode != lastCharCode) {
        chars.push(String.fromCharCode(currentCharCode));
        currentCharCode++;
      }
      return chars;
    })
    .flat();
  const saltLength = Array.from(
    Array(Math.floor(Math.random() * (10 - 6) + 6)).keys(),
  );
  return saltLength
    .map(
      () => charAlphabet[Math.floor(Math.random() * (charAlphabet.length - 1))],
    )
    .join("");
};

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        username: z.string().min(3),
        password: z.string().regex(passwordRegEx),
        repeatPassword: z.string().regex(passwordRegEx),
      }),
    )
    .mutation(async ({ input, ctx }): Promise<Message> => {
      if (input.password !== input.repeatPassword) {
        return {
          id: v4(),
          state: "Failure",
          message: "Password are not the same",
        };
      }
      const salt = saltGeneration();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const hash: string = sha256(`${input.password}${salt}`).toString();
      try {
        const user = await ctx.prisma.user.create({
          data: {
            name: input.username,
            salt,
            hash,
          },
        });
        return {
          id: v4(),
          state: "Success",
          message: "User successfully created",
        };
      } catch (prismaError) {
        console.log("User create error: ", prismaError);
        return {
          id: v4(),
          state: "Failure",
          message: "Something went wrong...",
        };
      }
    }),
  signIn: publicProcedure
    .input(
      z.object({
        username: z.string().min(3),
        password: z.string().regex(passwordRegEx),
      }),
    )
    .mutation(
      async ({
        input,
        ctx,
      }): Promise<
        Message & { payload: (Token & { access_token: string }) | null }
      > => {
        try {
          const user = await ctx.prisma.user.findUnique({
            where: { name: input.username },
            include: { decks: true },
          });
          if (user) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const hash: string = sha256(
              `${input.password}${user.salt}`,
            ).toString();
            if (user.hash == hash) {
              const sessionUser: User = {
                id: user.id,
                name: user.name,
                numberOfDecks: user.decks.length,
              };
              const access_token = await createToken(
                sessionUser,
                env.NEXTAUTH_SECRET!,
              );
              if (access_token) {
                const session = decodeToken(access_token);
                return {
                  id: v4(),
                  state: "Success",
                  message: "Successfylly signed in!",
                  payload: { ...session!, access_token },
                };
              }
            }
          }
          throw new Error("Wrong password or couldn't create token");
        } catch (err) {
          console.log("Sign in user error: ", err);
          return {
            id: v4(),
            state: "Failure",
            message: "Couldn't sign in " + input.username,
            payload: null,
          };
        }
      },
    ),
});
