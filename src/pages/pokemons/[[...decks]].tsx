import { atom } from "jotai";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import superjson from "superjson";

import { a, useTransition } from "@react-spring/web";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { AddDeckCard, DeckCard } from "../../components/Cards";
import { Layout } from "../../components/Layout";
import { Loader } from "../../components/Loader";
import { CreateDeck, Refetch } from "../../components/Modals";
import { PokemonsLayout } from "../../components/PokemonsLayout";
import { env } from "../../env/client.mjs";
import { useModalState } from "../../hooks/useModalState";
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

    ssg.deck.getUserDecks.prefetch({ limit: null, cursor: null });

    return {
      props: {
        trpcState: ssg.dehydrate(),
      },
    };
  }
}

const refetchModalAtom = atom(false);

const Decks: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const { data, isLoading, isRefetching, refetch } =
    api.deck.getUserDecks.useQuery({ limit: null });
  const removeDeck = api.deck.removeUserDeck.useMutation();
  const createDeck = api.deck.createDeck.useMutation();
  const router = useRouter();
  const decks = useMemo(() => data?.decks ?? [], [data?.decks]);

  const [_, showModal] = useModalState();

  const transitions = useTransition(decks ?? [], {
    trail: 700 / (decks?.length ?? 1),
    from: {
      opacity: 0,
      scale: 0,
      transform: "perspective(600px) rotateY(180deg)",
    },
    enter: [
      { opacity: 1, scale: 1 },
      { transform: "perspective(300px) rotateY(0deg)" },
    ],
    leave: { opacity: 0, scale: 0 },
    config: {
      friction: 50,
      tension: 500,
      mass: 3,
    },
  });

  const removeUserDeck = async (deckId: string) => {
    await removeDeck.mutateAsync(deckId);
    refetch();
  };

  const addCardsToDeck = (deckId: string) => {
    router.push({
      pathname: "/home",
      query: {
        deckId,
      },
    });
  };

  const addDeck = useCallback(async (params: CreateDeckParams) => {
    await createDeck.mutateAsync(params);
    refetch();
  }, []);

  return (
    <>
      <Refetch
        isRefetching={!isLoading && isRefetching}
        anotherAtom={refetchModalAtom}
      />
      <CreateDeck create={addDeck} />
      <Loader isLoading={isLoading}>
        <>
          <p className="font-coiny text-3xl mt-4 w-full text-end">
            Total Decks Amount: {decks?.length}/{env.NEXT_PUBLIC_USER_MAX_DECKS}
          </p>
          <div
            className="w-full grid gap-y-10 gap-x-5 min-[1880px]:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2
mt-5"
          >
            <AddDeckCard onClick={showModal} />
            {transitions((style, deck) => (
              <a.div style={style}>
                <DeckCard
                  deck={deck}
                  addCard={addCardsToDeck}
                  removeDeck={removeUserDeck}
                />
              </a.div>
            ))}
          </div>
        </>
      </Loader>
    </>
  );
};

Decks.getLayout = (page) => (
  <Layout showFlip={false}>
    <PokemonsLayout>{page}</PokemonsLayout>
  </Layout>
);

export default Decks;
