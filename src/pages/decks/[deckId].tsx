import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import superjson from "superjson";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { Layout } from "../../components/Layout";
import { env } from "../../env/client.mjs";
import { appRouter } from "../../server/api/root";
import { createInnerTRPCContext } from "../../server/api/trpc";
import { getServerAuthSession } from "../../server/auth";
import { api } from "../../utils/api";
import { NextPageWithLayout } from "../_app";
import { cardGridStyles } from "../../components/CardsGrid";
import { DetailsCard } from "../../components/Cards";

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
  const { data: pokemons } = api.pokemon.getPokemonDetailedList.useQuery(
    props.deckId,
  );
  const { data: deck } = api.deck.getDeckById.useQuery(props.deckId);

  return (
    <div className="mt-5 flex flex-col gap-5">
      <div className="flex justify-between gap-5 text-3xl font-coiny text-white">
        <span>Owner: {deck?.username}</span>
        <span>Deck name: {deck?.name}</span>
        <span>
          Deck size: {deck?.deckLength}/{env.NEXT_PUBLIC_DECK_MAX_SIZE}
        </span>
      </div>
      <div className={twMerge("mt-5", cardGridStyles)}>
        {pokemons?.map((pokemon) => (
          <DetailsCard pokemon={pokemon}/>
        ))}
      </div>
    </div>
  );
};

OtherUserDeck.getLayout = (page) => <Layout showFlip={false}>{page}</Layout>;

export default OtherUserDeck;