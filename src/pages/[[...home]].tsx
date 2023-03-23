import { atom } from "jotai";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import { Pokemon } from "pokenode-ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import superjson from "superjson";
import { z } from "zod";

import Check from "@icons/check.svg";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { useDrag } from "@use-gesture/react";

import { FlipCard } from "../components/Cards";
import { CardsGrid } from "../components/CardsGrid";
import { Layout } from "../components/Layout";
import { Loader } from "../components/Loader";
import { AddCards, CreateDeck } from "../components/Modals";
import { PaginationButtons } from "../components/PaginationButtons";
import { SearchBar } from "../components/SearchBar";
import { env } from "../env/client.mjs";
import {
  setNewSelectedPokemonStorage,
  useFlipState,
  useGetPokemonsFromDeck,
  useMessageBus,
  useModalState,
  usePagination,
  useSelectPokemons,
} from "../hooks";
import { useAuth } from "../hooks/useAuth";
import { appRouter } from "../server/api/root";
import { createInnerTRPCContext } from "../server/api/trpc";
import { getServerAuthSession } from "../server/auth";
import { api } from "../utils/api";
import { NextPageWithLayout } from "./_app";

const FixedButton = ({
  onClick,
  existingPokemonsLength,
}: {
  onClick: () => void;
  existingPokemonsLength: number;
}) => {
  const [entered, toggleEnter] = useState(false);
  const { pokemons } = useSelectPokemons();

  return pokemons.length > 0 ? (
    <div
      role="button"
      onMouseEnter={() => toggleEnter(true)}
      onMouseLeave={() => toggleEnter(false)}
      className={`fixed right-2 bottom-2
      flex justify-center items-center rounded-full h-16 w-16 bg-white text-purple-900 text-2xl cursor-pointer
      hover:bg-green-500 hover:text-white transition-all z-50
      shadow-xl`}
      onClick={onClick}
    >
      {entered ? (
        <Check className="opacity-0 text-white hover:opacity-100 h-full w-full m-2" />
      ) : (
        <p className="text-lg">
          {pokemons.length + existingPokemonsLength}/
          {env.NEXT_PUBLIC_DECK_MAX_SIZE}
        </p>
      )}
    </div>
  ) : null;
};

const homePageSelectedPokemons = atom<Pokemon[]>([]);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  setNewSelectedPokemonStorage(homePageSelectedPokemons);
  const schema = z.object({
    search: z
      .string()
      .optional()
      .transform((value) => value ?? null),
    deckId: z
      .string()
      .optional()
      .transform((value) => value ?? null),
    home: z
      .string()
      .array()
      .transform((pair) => (pair[1] ? +pair[1] : 0)),
  });
  const result = schema.safeParse(context.query);
  const props: z.infer<typeof schema> = {
    search: null,
    home: 0,
    deckId: null,
  };
  if (result.success) {
    props.search = result.data.search;
    props.home = result.data.home;
    props.deckId = result.data.deckId;
  }
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  });
  await ssg.pokemon.getPokemonList.prefetch({
    searchQuery: props.search,
    limit: 15,
    offset: 15 * props.home,
  });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      ...props,
    },
  };
}

const Home: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const [_, showModal] = useModalState();
  const route = useRouter();
  const flipState = useFlipState();
  const { session } = useAuth();
  const pagination = usePagination(props?.home ?? 0, 15, 1275, "/home");
  const { pushMessage } = useMessageBus();
  const { pokemons: selectedPokemons, resetPokemons } = useSelectPokemons();
  const { data: pokemonsInDeck, refetch } = useGetPokemonsFromDeck();
  const { data: decks } = api.deck.getEmptyUserDecks.useQuery(
    { numberOfEmptySlots: 20 },
    { enabled: !!session },
  );
  const { mutateAsync: createDeck, isLoading: deckCreating } =
    api.deck.createDeck.useMutation();
  const { data: pokemons, isLoading } = api.pokemon.getPokemonList.useQuery({
    searchQuery: props?.search,
    ...pagination.currentPageParams,
  });

  useEffect(() => {
    return () => {
      resetPokemons([]);
    };
  }, []);

  const decksLength = useMemo(() => decks?.length ?? 0, [decks]);

  const drag = useDrag(({ down, axis, delta: [x] }) => {
    if (down && axis == "x") {
      if (x > 0) {
        pagination.goToPrevPage();
      } else if (x < 0) {
        pagination.goToNextPage();
      }
    }
  });

  const createDeckWithCards = useCallback(
    (params: { name: string; private: boolean }) => {
      const cards = selectedPokemons.map((pokemon) => ({
        name: pokemon.name,
        imageUrl:
          pokemon.sprites.other?.["official-artwork"].front_default ??
          pokemon.sprites.front_default ??
          "",
      }));
      createDeck({ ...params, cards })
        .then((message) => {
          route.push({
            pathname: "/pokemons/deck/[deckId]",
            query: {
              deckId: message.deck?.id,
            },
          });
          return message;
        })
        .then(pushMessage)
        .then(resetPokemons);
    },
    [selectedPokemons, useSelectPokemons, createDeck],
  );

  const updateQuery = useCallback(
    (search: string) => {
      if (search?.length > 0) {
        route.replace({
          pathname: `/home/${props.home}`,
          query: {
            search,
            deckId: props.deckId,
          },
        });
      }
    },
    [route],
  );

  return (
    <div {...drag()} className="flex flex-col h-full">
      <Head>
        <title>PokeDeck</title>
        <meta property="og:title" content="PokeDeck" key="title" />
      </Head>
      {(props.deckId || decksLength > 0) && (
        <AddCards deckId={props.deckId} onSubmit={refetch} />
      )}
      {decksLength == 0 && !props.deckId && (
        <CreateDeck create={createDeckWithCards} isLoading={deckCreating} />
      )}
      <FixedButton
        onClick={showModal}
        existingPokemonsLength={pokemonsInDeck?.length ?? 0}
      />
      <div className="flex relative justify-center items-center -mt-5">
        <SearchBar searchValue={props?.search ?? ""} onSearch={updateQuery} />
      </div>
      <PaginationButtons
        showNext={pagination.hasNextPage}
        showPrev={pagination.hasPrevPage}
        onNextPage={pagination.goToNextPage}
        onPrevPage={pagination.goToPrevPage}
      />
      <Loader isLoading={isLoading}>
        <CardsGrid
          paginationState={pagination.paginationState}
          pokemons={pokemons}
        >
          {(pokemon) => (
            <FlipCard
              key={pokemon.id}
              pokemon={pokemon}
              selectedPokemons={selectedPokemons}
              pokemonsInDeck={pokemonsInDeck}
              keepFlipped={flipState}
            />
          )}
        </CardsGrid>
      </Loader>
    </div>
  );
};

Home.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Home;
