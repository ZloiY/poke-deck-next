import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { ReactElement } from "react";
import superjson from "superjson";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { Layout } from "../components/Layout";
import { appRouter } from "../server/api/root";
import { createInnerTRPCContext } from "../server/api/trpc";
import { getServerAuthSession } from "../server/auth";
import { api } from "../utils/api";
import { NextPageWithLayout } from "./_app";
import { UserDecks } from "../components/UserDecks";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  if (session) {
    const ssg = createProxySSGHelpers({
      router: appRouter,
      ctx: createInnerTRPCContext({ session }),
      transformer: superjson,
    });
    ssg.deck.getUserDecks.prefetch();
    return {
      props: {
        trpcState: ssg.dehydrate(),
      },
    };
  }
  return {
    props: {},
  };
}

const Decks: NextPageWithLayout = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  return (
    <div className="flex flex-col gap-8">
     <UserDecks/>
      <div className="border-2 rounded-xl border-purple-900 bg-purple-800/60 p-2">
        <span className="font-coiny text-3xl">Others players decks:</span>
      </div>
    </div>
  );
};

Decks.getLayout = (page: ReactElement) => (
  <Layout showFlip={false}>{page}</Layout>
);

export default Decks;
