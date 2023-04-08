import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { ReactElement } from "react";
import superjson from "superjson";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { Layout } from "../../components/Layout";
import { OtherUsersDecks } from "../../components/OtherUsersDecks";
import { UserDecks } from "../../components/UserDecks";
import { appRouter } from "../../server/api/root";
import { createInnerTRPCContext } from "../../server/api/trpc";
import { getServerAuthSession } from "../../server/auth";
import { NextPageWithLayout } from "../_app";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  if (session) {
    const ssg = createProxySSGHelpers({
      router: appRouter,
      ctx: createInnerTRPCContext({ session }),
      transformer: superjson,
    });
    ssg.deck.getUserDecks.prefetch({ limit: 6 });
    ssg.deck.getOthersUsersDecks.prefetch({ limit: 7 });
    return {
      props: {
        trpcState: ssg.dehydrate(),
      },
    };
  } else {
    return {
      props: {},
    };
  }
}

const Decks: NextPageWithLayout = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  return (
    <div className="flex flex-col gap-8">
      <Head>
        <title>Decks</title>
        <meta property="og:title" content="Decks" key="title" />
      </Head>
      <UserDecks />
      <OtherUsersDecks />
    </div>
  );
};

Decks.getLayout = (page: ReactElement) => (
  <Layout showFlip={false}>{page}</Layout>
);

export default Decks;
