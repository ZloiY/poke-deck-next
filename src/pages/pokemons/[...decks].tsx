import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import superjson from "superjson";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { DeckCard } from "../../components/Cards";
import { CardsGrid } from "../../components/CardsGrid";
import { Loader } from "../../components/Loader";
import { appRouter } from "../../server/api/root";
import { createInnerTRPCContext } from "../../server/api/trpc";
import { getServerAuthSession } from "../../server/auth";
import { api } from "../../utils/api";
import Pokemon from "./index";

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

const Decks = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { data: decks, isLoading } = api.deck.getUserDecks.useQuery();

  return (
    <Pokemon>
      <Loader isLoading={isLoading}>
        <div
          className="w-full grid gap-y-10 gap-x-5 min-[1880px]:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2
mt-5"
        >
          {decks?.map((deck) => (
            <DeckCard deck={deck} />
          ))}
        </div>
      </Loader>
    </Pokemon>
  );
};

export default Decks;
