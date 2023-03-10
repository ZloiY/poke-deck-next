import { atom } from "jotai";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import { Pokemon } from "pokenode-ts";
import { useCallback, useState } from "react";
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
import {
  setNewSelectedPokemonStorage,
  useFlipState,
  useGetPokemonsFromDeck,
  useMessageBus,
  useModalState,
  usePagination,
  useSelectPokemons,
} from "../hooks";
import { appRouter } from "../server/api/root";
import { createInnerTRPCContext } from "../server/api/trpc";
import { getServerAuthSession } from "../server/auth";
import { api } from "../utils/api";
import { NextPageWithLayout } from "./_app";

const FixedButton = ({ onClick }: { onClick: () => void }) => {
  const [entered, toggleEnter] = useState(false);
  const { pokemons } = useSelectPokemons();

  return pokemons.length > 0 ? (
    <div
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
        <p>{pokemons.length}</p>
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
    page: z
      .string()
      .optional()
      .transform((value) => (value ? +value : 0)),
  });
  const result = schema.safeParse(context.query);
  const props: z.infer<typeof schema> = {
    search: null,
    page: 0,
    deckId: null,
  };
  if (result.success) {
    props.search = result.data.search;
    props.page = result.data.page;
    props.deckId = result.data.deckId;
  }
  if (session) {
    const ssg = createProxySSGHelpers({
      router: appRouter,
      ctx: createInnerTRPCContext({ session }),
      transformer: superjson,
    });
    if (result.success) {
      await ssg.pokemon.getPokemonList.prefetch({
        searchQuery: props.search,
        limit: 15,
        offset: 15 * props.page,
      });
      return {
        props: {
          trpcState: ssg.dehydrate(),
          ...props,
        },
      };
    }
  }
  return {
    props,
  };
}

const Home: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const [_, showModal] = useModalState();
  const route = useRouter();
  const session = useSession();
  const flipState = useFlipState();
  const pagination = usePagination(props?.page ?? 0, 15, 1275, "/home");
  const { pushMessage } = useMessageBus();
  const { pokemons: selectedPokemons, resetPokemons } = useSelectPokemons();
  const { data: pokemonsInDeck, refetch } = useGetPokemonsFromDeck();
  const { mutateAsync: createDeck, isLoading: deckCreating } =
    api.deck.createDeck.useMutation();
  const { data: pokemons, isLoading } = api.pokemon.getPokemonList.useQuery({
    searchQuery: props?.search,
    ...pagination.currentPageParams,
  });

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
      route.replace({
        pathname: "/home/[page]",
        query: {
          page: route.query.page,
          search,
        },
      });
    },
    [route],
  );

  return (
    <div {...drag()} className="flex flex-col h-full">
      <Head>
        <title>PokeDeck</title>
        <meta property="og:title" content="PokeDeck" key="title" />
      </Head>
      {(session.data?.user?.numberOfDecks ?? 0) > 0 && (
        <AddCards deckId={props.deckId} onSubmit={refetch} />
      )}
      {(session.data?.user?.numberOfDecks ?? 0) == 0 && (
        <CreateDeck create={createDeckWithCards} isLoading={deckCreating} />
      )}
      <FixedButton onClick={showModal} />
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
