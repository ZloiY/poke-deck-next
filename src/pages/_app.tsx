import { NextPage } from "next";
import { type AppProps, type AppType } from "next/app";

import { Coiny, Fredoka, Modak } from "@next/font/google";

import { PageLoader } from "../components/PageLoader";
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

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <main
      id="main"
      className={`${coiny.variable} ${modak.variable} ${fredoka.variable} font-fredoka text-white`}
    >
      {" "}
      <PageLoader />
      {getLayout(<Component {...pageProps} />)}
    </main>
  );
};

export default api.withTRPC(MyApp);
