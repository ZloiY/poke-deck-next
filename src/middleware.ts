import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authorization = req.headers.get("Authorization");
  if (authorization) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/home", req.url));
}

export const config = { matcher: ["/decks/:path*", "/pokemons/:path*"] };
