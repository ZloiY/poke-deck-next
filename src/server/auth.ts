import { type GetServerSidePropsContext } from "next";

import { env } from "../env/server.mjs";
import { setAccessToken, setSession } from "../services/authStorage";
import { createToken, getToken, isTokenExpired } from "../utils/token";

/**
 * Wrapper for unstable_getServerSession, used in trpc createContext and the
 * restricted API route
 *
 * Don't worry too much about the "unstable", it's safe to use but the syntax
 * may change in future versions
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */

export const createSessionCookie = (accessToken: string) => {
  return  `poke-deck-next-cookie=${accessToken}; `
    + `Max-Age=${ 7 * 24 * 60 * 60}; `
    + `${env.NODE_ENV == "production" ? "Secure; " : ""}`
    + "Path=/; "
    + `SameSite=Lax`;
};

export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  const authCookie = ctx.req.cookies['poke-deck-next-cookie'];
  if (authCookie) {
    const tokenPayload = await getToken(authCookie, env.NEXTAUTH_SECRET!);
    if (tokenPayload && !isTokenExpired(tokenPayload)) {
      return tokenPayload;
    } else if (tokenPayload) {
      const refreshToken = await getToken(
        tokenPayload.refreshToken,
        env.NEXTAUTH_SECRET!,
      );
      if (refreshToken && !isTokenExpired(refreshToken)) {
        const user = {
          id: tokenPayload.id,
          name: tokenPayload.name,
          numberOfDecks: tokenPayload.numberOfDecks,
        };
        const newAccessToken = await createToken(user, env.NEXTAUTH_SECRET!);
        const newTokenPayload = await getToken(
          newAccessToken!,
          env.NEXTAUTH_SECRET!,
        );
        if (newTokenPayload && newAccessToken) {
          const authCookie = createSessionCookie(newAccessToken);
          ctx.res.setHeader("Set-Cookie", authCookie);
          return tokenPayload;
        }
      }
    }
  }
  return null;
};
