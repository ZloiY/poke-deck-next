import { useAtom } from "jotai";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { Pokemon } from "pokenode-ts";
import { useEffect, useMemo, useState } from "react";
import superjson from "superjson";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { a, config, useTransition } from "@react-spring/web";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { FlipCard } from "../../../components/Cards";
import { cardGridStyles } from "../../../components/CardsGrid";
import { Layout } from "../../../components/Layout";
import { Loader } from "../../../components/Loader";
import { Refetch } from "../../../components/Modals";
import {
  PokemonsLayout,
  pokemonsLayoutAtom,
} from "../../../components/PokemonsLayout";
import { appRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";
import { getServerAuthSession } from "../../../server/auth";
import { api } from "../../../utils/api";
import { NextPageWithLayout } from "../../_app";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const parseQuery = z
    .object({
      deckId: z.string(),
    })
    .safeParse(context.query);
  const session = await getServerAuthSession(context);
  if (parseQuery.success && session) {
    const ssg = createProxySSGHelpers({
      router: appRouter,
      ctx: createInnerTRPCContext({ session }),
      transformer: superjson,
    });

    ssg.pokemon.getPokemonDetailedList.prefetch(parseQuery.data.deckId);
    return {
      props: {
        deckId: parseQuery.data.deckId,
        trpcState: ssg.dehydrate(),
      },
    };
  } else {
    return {
      redirect: {
        destination: "/pokemons/decks",
      },
    };
  }
}

const SelectedDeck: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const router = useRouter();
  const {
    data: pokemonsDetails,
    isLoading,
    refetch,
    isRefetching,
  } = api.pokemon.getPokemonDetailedList.useQuery(props.deckId);
  const removePokemon = api.pokemon.removePokemonFromDeck.useMutation();

  const [transitionState] = useAtom(pokemonsLayoutAtom);

  const [flipState, toggleFlip] = useState<FlipState>("Preview");

  useEffect(() => {
    router.prefetch("/pokemons/decks");
    const timeoutId = setTimeout(() => {
      toggleFlip("Details");
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      toggleFlip("Preview");
    };
  }, []);

  const transitions = useTransition(
    transitionState == "Started" ? [] : pokemonsDetails ?? [],
    {
      trail: 800 / (pokemonsDetails?.length ?? 1),
      keys: (pokemon) => pokemon.name,
      from: {
        opacity: 0,
        scale: 0,
      },
      enter: [{ opacity: 1, scale: 1 }],
      leave: [{ opacity: 0, scale: 0 }],
      config: {
        ...config.stiff,
        mass: 3,
        duration: 300,
      },
    },
  );

  const removePokemonFromDeck = async (pokemon: Pokemon) => {
    const deckId = props.deckId;
    await removePokemon.mutateAsync({
      deckId,
      pokemonName: pokemon.name,
    });
    refetch();
  };

  return (
    <>
      <Refetch isRefetching={!isLoading && isRefetching} />
      <Loader isLoading={isLoading}>
        <div className={twMerge("w-full mt-5", cardGridStyles)}>
          {transitions((styles, pokemon) => (
            <a.div style={styles}>
              <FlipCard
                keepFlipped={flipState}
                pokemon={pokemon}
                removeFromDeck={removePokemonFromDeck}
              />
            </a.div>
          ))}
        </div>
      </Loader>
    </>
  );
};

SelectedDeck.getLayout = (page) => (
  <Layout>
    <PokemonsLayout showSelectedDeck>{page}</PokemonsLayout>
  </Layout>
);

export default SelectedDeck;