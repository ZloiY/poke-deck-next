import { type GetServerSidePropsContext } from "next";

import { env } from "../env/server.mjs";
import { setAccessToken, setSession } from "../hooks/useAuth";
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

export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  const authHeader = ctx.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      const tokenPayload = await getToken(token, env.NEXTAUTH_SECRET!);
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
          setAccessToken(newAccessToken!);
          const newTokenPayload = await getToken(
            newAccessToken!,
            env.NEXTAUTH_SECRET!,
          );
          if (newTokenPayload) {
            setSession(newTokenPayload);
            return tokenPayload;
          }
        }
      }
    }
  }
  return null;
};
