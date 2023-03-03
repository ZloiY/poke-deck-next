import { ISODateString, type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: DefaultUser;
  }

  interface DefaultSession {
    user: DefaultUser,
    expires: ISODateString;
  }

  interface DefaultUser {
    id: string;
    name: string;
    numberOfDecks: number;
  }

  interface DefaultJWT extends Record<string, unknown> {
    sub: string;
    name?: string;
    numberOfDecks?: number;
  }
}
