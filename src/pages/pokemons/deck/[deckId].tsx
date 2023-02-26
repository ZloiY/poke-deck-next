import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import superjson from "superjson";
import { z } from "zod";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import Pokemons from "..";
import { DetailsCard } from "../../../components/Cards";
import { CardsGrid } from "../../../components/CardsGrid";
import { Loader } from "../../../components/Loader";
import { appRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";
import { getServerAuthSession } from "../../../server/auth";
import { api } from "../../../utils/api";
import { a, config, useTransition } from "@react-spring/web";
import { ReactNode, useMemo } from "react";

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

const SelectedDeck = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { data: pokemonsDetails, isLoading } =
    api.pokemon.getPokemonDetailedList.useQuery(props.deckId);

  const transitions = useTransition(pokemonsDetails ?? [], {
    trail: 200 / (pokemonsDetails?.length ?? 1),
    keys: (pokemon) => pokemon.name,
    from: { opacity: 0, scale: 0, rotate: `${Math.ceil(Math.random() * 180 - 90)}deg` },
    enter: { opacity: 1, scale: 1, rotate: '0deg' },
    config: config.stiff,
  })

  const pokemonTransitions = useMemo(() => {
    return transitions((styles, pokemon) => ({ styles, ...pokemon }) as unknown as ReactNode)
  }, [transitions])

  return (
    <Pokemons showSelectedDeck={!!props.deckId}>
      <Loader isLoading={isLoading}>
        <CardsGrid pokemons={pokemonTransitions ?? []}>
          {(pokemon) => <a.div><DetailsCard pokemon={pokemon}/></a.div>}
        </CardsGrid>
      </Loader>
    </Pokemons>
  );
};

export default SelectedDeck;
