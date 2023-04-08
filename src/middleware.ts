import { NextRequest, NextResponse } from "next/server";
import { env } from "./env/server.mjs";
import { getToken } from "./utils/token";

export function middleware(req: NextRequest) {
  const cookie = req.cookies.get("poke-deck-next-cookie")?.value;
  if (cookie) {
    getToken(cookie, env.NEXTAUTH_SECRET!)
      .then((maybeToken) => {
        if (maybeToken && maybeToken.exp > Date.now()) {
          return NextResponse.next();
        }
      })
  } else {
    return NextResponse.redirect(new URL("/home", req.url));
  }
}

export const config = { matcher: ["/decks/:path*", "/pokemons/:path*"] };
