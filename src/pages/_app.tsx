import { type AppType, type AppProps } from "next/app";
import { NextPage } from "next";
import { type Session } from "next-auth";
import { Coiny, Modak, Fredoka } from "@next/font/google";
import { SessionProvider, useSession } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";

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

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <main className={`${coiny.variable} ${modak.variable} ${fredoka.variable} font-fredoka text-white bg-purple-700/70`}>
      <SessionProvider session={session}>
          {getLayout(<Component {...pageProps}/>)}
      </SessionProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);
