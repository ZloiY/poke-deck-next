import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import superjson from "superjson";

import { a, config, useTransition } from "@react-spring/web";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { DeckCard } from "../../components/Cards";
import { Layout } from "../../components/Layout";
import { Loader } from "../../components/Loader";
import { PokemonsLayout } from "../../components/PokemonsLayout";
import { appRouter } from "../../server/api/root";
import { createInnerTRPCContext } from "../../server/api/trpc";
import { getServerAuthSession } from "../../server/auth";
import { api } from "../../utils/api";
import { NextPageWithLayout } from "../_app";

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
}

const Decks: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const { data: decks, isLoading } = api.deck.getUserDecks.useQuery();

  const transitions = useTransition(decks ?? [], {
    trail: 700 / (decks?.length ?? 1),
    from: { opacity: 0, scale: 0, transform: "perspective(600px) rotateY(180deg)" },
    enter: [{ opacity: 1, scale: 1 }, {transform: "perspective(300px) rotateY(0deg)" }],
    leave: { opacity: 0, scale: 0 },
    config: {
      friction: 50,
      tension: 500,
      mass: 3,
    }
  });

  return (
    <Loader isLoading={isLoading}>
      <div
        className="w-full grid gap-y-10 gap-x-5 min-[1880px]:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2
mt-5"
      >
        {transitions((style, deck) => (
          <a.div style={style}>
            <DeckCard deck={deck} />
          </a.div>
        ))}
      </div>
    </Loader>
  );
};

Decks.getLayout = (page) => (
  <Layout>
    <PokemonsLayout>{page}</PokemonsLayout>
  </Layout>
);

export default Decks;
