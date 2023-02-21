import { atom, useAtom } from "jotai";
import { useRouter } from "next/router";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import { Pokemon } from "pokenode-ts";
import { useCallback, useEffect, useState } from "react";
import superjson from "superjson";
import { z } from "zod";

import Check from "@icons/check.svg";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { CardsGrid } from "../components/CardsGrid";
import { Layout } from "../components/Layout";
import { Loader } from "../components/Loader";
import { AddCards } from "../components/Modals";
import { PaginationButtons } from "../components/PaginationButtons";
import { SearchBar } from "../components/SearchBar";
import { useFlipState, useSelectPokemons, setNewSelectedPokemonStorage } from "../hooks";
import { useModalState } from "../hooks/useModalState";
import { usePagination } from "../hooks/usePagination";
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  if (session) {
    const ssg = createProxySSGHelpers({
      router: appRouter,
      ctx: createInnerTRPCContext({ session }),
      transformer: superjson,
    });
    const result = z
      .object({
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
      })
      .safeParse(context.query);
    if (result.success) {
      await ssg.pokemon.getPokemonList.prefetch({
        searchQuery: result.data.search,
        limit: 15,
        offset: 15 * result.data.page,
      });
      return {
        props: {
          trpcState: ssg.dehydrate(),
          search: result.data.search,
          page: result.data.page,
          deckId: result.data.deckId,
        },
      };
    }
  }
  return {
    props: {},
  };
}

const homePageSelectedPokemons = atom<Pokemon[]>([]);

const Home: NextPageWithLayout = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const [_, showModal] = useModalState();
  const route = useRouter();
  const flipState = useFlipState();
  const pagination = usePagination(props?.page ?? 0, 15, 1275);
  const { pokemons: selectedPokemons } = useSelectPokemons();
  const { data: pokemons, isLoading } = api.pokemon.getPokemonList.useQuery({
    searchQuery: props?.search,
    ...pagination.currentPageParams,
  });

  useEffect(() => {
    setNewSelectedPokemonStorage(homePageSelectedPokemons);
  }, [])

  const updateQuery = useCallback(
    (search: string) => {
      route.replace({
        pathname: "/home",
        query: {
          ...route.query,
          search,
        },
      });
    },
    [route],
  );

  return (
    <div className="flex flex-col h-full">
      <AddCards deckId={props.deckId} />
      <FixedButton onClick={showModal} />
      <div className="flex relative justify-center items-center px-72 -mt-5">
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
          pokemons={pokemons}
          selectedPokemons={selectedPokemons}
          cardsFlipped={flipState}
        />
      </Loader>
    </div>
  );
};

Home.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Home;
