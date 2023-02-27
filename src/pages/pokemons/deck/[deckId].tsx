import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import superjson from "superjson";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { a, config, useTransition } from "@react-spring/web";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { DetailsCard } from "../../../components/Cards";
import { cardGridStyles } from "../../../components/CardsGrid";
import { Loader } from "../../../components/Loader";
import { appRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";
import { getServerAuthSession } from "../../../server/auth";
import { api } from "../../../utils/api";
import { NextPageWithLayout } from "../../_app";
import { Layout } from "../../../components/Layout";
import { PokemonsLayout, pokemonsLayoutAtom } from "../../../components/PokemonsLayout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useLoadingState } from "../../../hooks";
import { useAtom } from "jotai";

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
  const { data: pokemonsDetails, isLoading } =
    api.pokemon.getPokemonDetailedList.useQuery(props.deckId);

  const [transitionState] = useAtom(pokemonsLayoutAtom);
  useEffect(() => {
    router.prefetch('/pokemons/decks');
  }, [])

  const transitions = useTransition(transitionState == 'Started' ? [] : (pokemonsDetails ?? []), {
    trail: 400 / (pokemonsDetails?.length ?? 1),
    keys: (pokemon) => pokemon.name,
    from: {
      opacity: 0,
    },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.slow,
  });

  return (
    <Loader isLoading={isLoading}>
      <div className={twMerge("w-full mt-5", cardGridStyles)}>
        {transitions((styles, pokemon) => (
          <a.div style={styles}>
            <DetailsCard pokemon={pokemon} />
          </a.div>
        ))}
      </div>
    </Loader>
  );
};

SelectedDeck.getLayout = (page) => (
  <Layout>
    <PokemonsLayout showSelectedDeck>
      {page}
    </PokemonsLayout>
  </Layout>
)

export default SelectedDeck;
