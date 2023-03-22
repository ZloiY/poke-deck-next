import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import superjson from "superjson";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { DetailsCard } from "../../components/Cards";
import { cardGridStyles } from "../../components/CardsGrid";
import { Layout } from "../../components/Layout";
import { Loader } from "../../components/Loader";
import { env } from "../../env/client.mjs";
import { appRouter } from "../../server/api/root";
import { createInnerTRPCContext } from "../../server/api/trpc";
import { getServerAuthSession } from "../../server/auth";
import { api } from "../../utils/api";
import { NextPageWithLayout } from "../_app";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  const result = z
    .object({
      deckId: z.string(),
    })
    .safeParse(context.query);
  if (session && result.success) {
    const ssg = createProxySSGHelpers({
      router: appRouter,
      ctx: createInnerTRPCContext({ session }),
      transformer: superjson,
    });
    ssg.pokemon.getPokemonDetailedList.prefetch(result.data.deckId);
    ssg.deck.getDeckById.prefetch(result.data.deckId);
    return {
      props: {
        trpcState: ssg.dehydrate(),
        deckId: result.data.deckId,
      },
    };
  }
  return {
    redirect: {
      destination: "/decks",
    },
  };
}

const OtherUserDeck: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const { data: pokemons, isLoading } =
    api.pokemon.getPokemonDetailedList.useQuery(props.deckId);
  const { data: deck } = api.deck.getDeckById.useQuery(props.deckId);

  return (
    <div
      className={twMerge(
        "mt-5 flex flex-col gap-5",
        isLoading && "items-center justify-center",
      )}
    >
      <Head>
        <title>PokeDeck deck</title>
        <meta property="og:title" content="PokeDeck deck" key="title" />
      </Head>
      <div className="flex justify-between gap-5 text-3xl font-coiny text-white">
        <span>Owner: {deck?.username ?? "..."}</span>
        <span>Deck name: {deck?.name ?? "..."}</span>
        <span>
          Deck size: {deck?.deckLength ?? "..."}/{env.NEXT_PUBLIC_DECK_MAX_SIZE}
        </span>
      </div>
      <Loader className="w-96 h-96" isLoading={isLoading}>
        <div className={twMerge("mt-5", cardGridStyles)}>
          {pokemons?.map((pokemon) => (
            <DetailsCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      </Loader>
    </div>
  );
};

OtherUserDeck.getLayout = (page) => <Layout showFlip={false}>{page}</Layout>;

export default OtherUserDeck;
