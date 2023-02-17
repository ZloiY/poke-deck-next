import { useRouter } from "next/router";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import { useCallback, useState } from "react";
import superjson from "superjson";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import Flip from "@icons/flip.svg";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { CardsGrid } from "../components/CardsGrid";
import { Layout } from "../components/Layout";
import { Loader } from "../components/Loader";
import { PaginationButtons } from "../components/PaginationButtons";
import { SearchBar } from "../components/SearchBar";
import { usePagination } from "../hooks/usePagination";
import { appRouter } from "../server/api/root";
import { createInnerTRPCContext } from "../server/api/trpc";
import { getServerAuthSession } from "../server/auth";
import { api } from "../utils/api";
import { NextPageWithLayout } from "./_app";

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
        search: z.string().optional(),
        page: z.string().optional().transform(Number),
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
        },
      };
    }
  }
  return {
    props: {},
  };
}

const Home: NextPageWithLayout = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const route = useRouter();

  const pagination = usePagination(props?.page ?? 0, 15, 1275);
  const [cardsFlipped, toggle] = useState(false);
  const { data: pokemons, isLoading } = api.pokemon.getPokemonList.useQuery({
    searchQuery: props?.search,
    ...pagination.currentPageParams,
  });

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
      <div className="flex relative justify-center items-center px-72 -mt-5">
        <SearchBar searchValue={props?.search ?? ""} onSearch={updateQuery} />
        <Flip
          className={twMerge(
            "h-10 w-10 text-white transition-transform duration-200 hover:text-yellow-500 cursor-pointer absolute right-0 z-50",
            cardsFlipped && "text-purple-900 rotate-180",
          )}
          onClick={() => toggle((state) => !state)}
        />
      </div>
      <PaginationButtons
        showNext={pagination.hasNextPage}
        showPrev={pagination.hasPrevPage}
        onNextPage={pagination.goToNextPage}
        onPrevPage={pagination.goToPrevPage}
      />
      <Loader isLoading={isLoading}>
        <CardsGrid pokemons={pokemons} cardsFlipped={cardsFlipped} />
      </Loader>
    </div>
  );
};

Home.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Home;
