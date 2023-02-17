import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import Flip from "@icons/flip.svg";

import { CardsGrid } from "../components/CardsGrid";
import { Layout } from "../components/Layout";
import { Loader } from "../components/Loader";
import { PaginationButtons } from "../components/PaginationButtons";
import { SearchBar } from "../components/SearchBar";
import { usePagination } from "../hooks/usePagination";
import { api } from "../utils/api";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const route = useRouter();
  const queryParams = useMemo(() => {
    const result = z
      .object({ search: z.string().optional(), page: z.string().optional() })
      .safeParse(route.query);
    return result.success
      ? { search: result.data.search, page: Number(result.data.page) }
      : null;
  }, [route.query]);

  const pagination = usePagination(queryParams?.page ?? 0, 15, 1275);
  const [cardsFlipped, toggle] = useState(false);
  const { data: currentPage, isLoading } = api.pokemon.getPokemonList.useQuery({
    searchQuery: queryParams?.search,
    ...pagination.currentPageParams,
  });

  useEffect(() => {
    route.replace({
      pathname: "/home",
      query: {
        ...route.query,
        page: pagination.currentPage,
      },
    });
  }, [pagination.currentPage]);

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
        <SearchBar
          searchValue={queryParams?.search ?? ""}
          onSearch={updateQuery}
        />
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
        <CardsGrid cardItems={currentPage} cardsFlipped={cardsFlipped} />
      </Loader>
    </div>
  );
};

Home.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Home;
