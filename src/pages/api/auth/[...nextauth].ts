import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import sha256 from 'crypto-js/sha256';
import { z } from "zod";

import { prisma } from "../../../server/db";

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
      }
      return session;
    },
    async jwt({ token, user }) {
      token.id = user?.id
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
      authorize: async (credentials, req) => {
        const { username, password } = z.object({
          username: z.string().min(3),
          password: z.string().regex(/[\w(@|#|$|&)+]{6}/g),
        }).parse(credentials);
        try {
          const user = await prisma.user.findUniqueOrThrow({ where: { name: username } });
          if (user.hash == sha256(`${password}${user.salt}`).toString()) {
            return user;
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
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

export default NextAuth(authOptions);
