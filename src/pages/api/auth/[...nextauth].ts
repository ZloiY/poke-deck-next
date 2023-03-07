import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import sha256 from 'crypto-js/sha256';
import { z } from "zod";

import { prisma } from "../../../server/db";
import { JWT } from "next-auth/jwt";

type User = {
  numberOfDecks: number;
  id: string;
  name: string;
}

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.id = token.sub as string;
        session.user.numberOfDecks = token.numberOfDecks as number;
      }
      return session;
    },
    async jwt({ token, user }) {
      token.id = user?.id
      token.numberOfDecks = user?.numberOfDecks;
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      authorize: async (credentials, req): Promise<User | null> => {
        const { username, password } = z.object({
          username: z.string().min(3),
          password: z.string().regex(/[\w(@|#|$|&)+]{6}/g),
        }).parse(credentials);
        try {
          const user = await prisma.user.findUniqueOrThrow({ where: { name: username }, include: { decks: true } });
          if (user.hash == sha256(`${password}${user.salt}`).toString()) {
            const { decks, hash: _hash, salt: _salt, ...userParams } = user;
            return { numberOfDecks: decks.length, ...userParams };
          } else {
            console.log('Wrong password');
            return null;
          }
        } catch (prismaError) {
          console.log('User signing error: ', prismaError);
          return null
        }
      }
    })
  ],
};

export default NextAuth(authOptions);
