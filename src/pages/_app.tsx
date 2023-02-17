import { NextPage } from "next";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { type AppProps, type AppType } from "next/app";
import { useEffect, useState } from "react";

import { Coiny, Fredoka, Modak } from "@next/font/google";

import { Loader } from "../components/Loader";
import "../styles/globals.css";
import { api } from "../utils/api";

const coiny = Coiny({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-coiny",
});

const modak = Modak({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-modak",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <main
      className={`${coiny.variable} ${modak.variable} ${fredoka.variable} font-fredoka text-white`}
    >
        <SessionProvider session={session}>
          {getLayout(<Component {...pageProps} />)}
        </SessionProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);
