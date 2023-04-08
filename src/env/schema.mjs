// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  DECK_MAX_SIZE: z.string().regex(/[1-9]+[0-9]*/),
  USER_MAX_DECKS: z.string().regex(/[1-9]+[0-9]*/),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js
 * middleware, so you have to do it manually here.
 * @type {{ [k in keyof z.infer<typeof serverSchema>]: z.infer<typeof serverSchema>[k] | undefined }}
 */
export const serverEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  DECK_MAX_SIZE: process.env.DECK_MAX_SIZE,
  USER_MAX_DECKS: process.env.USER_MAX_DECKS,
};

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_DECK_MAX_SIZE: z.string().regex(/[1-9]+[0-9]*/),
  NEXT_PUBLIC_USER_MAX_DECKS: z.string().regex(/[1-9]+[0-9]*/),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_DECK_MAX_SIZE: process.env.NEXT_PUBLIC_DECK_MAX_SIZE,
  NEXT_PUBLIC_USER_MAX_DECKS: process.env.NEXT_PUBLIC_USER_MAX_DECKS,
};
