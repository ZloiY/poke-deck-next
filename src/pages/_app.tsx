import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { Coiny, Modak, Fredoka } from "@next/font/google";
import { SessionProvider, useSession } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";

const coiny = Coiny({
  weight: "400",
  subsets: ['latin'],
  variable: "--font-coiny",
});

const modak = Modak({
  weight: "400",
  subsets: ['latin'],
  variable: "--font-modak",
});

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: "--font-fredoka",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <main className={`${coiny.variable} ${modak.variable} ${fredoka.variable} font-fredoka text-white bg-purple-700/70`}>
      <SessionProvider session={session}>
          <Component {...pageProps}/>
      </SessionProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);
