import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import Flip from "@icons/flip.svg";
import Loader from "@icons/loader.svg";

import { FlipCard } from "../components/Cards/FlipCard";
import { Layout } from "../components/Layout";
import { SearchBar } from "../components/SearchBar";
import { api } from "../utils/api";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const route = useRouter();
  const searchQuery = useMemo(() => {
    const result = z.object({ search: z.string() }).safeParse(route.query);
    return result.success ? result.data.search : null;
  }, [route.query]);

  const [cardsFlipped, toggle] = useState<boolean>(false);
  const { data: pokemonList, isLoading } = api.pokemon.getPokemonList.useQuery({
    searchQuery,
    limit: 18,
    offset: 0,
  });

  const updateQuery = useCallback(
    (searchString: string) => {
      route.replace(`/home?search=${searchString}`);
    },
    [route],
  );

  return (
    <div className="flex flex-col">
      <div className="flex relative justify-center items-center px-72 -mt-5">
        <SearchBar searchValue={searchQuery ?? ""} onSearch={updateQuery} />
        <Flip
          className={twMerge(
            "h-10 w-10 text-white transition-transform duration-200 hover:text-yellow-500 cursor-pointer absolute right-0",
            cardsFlipped && "text-purple-900 rotate-180",
          )}
          onClick={() => toggle((state) => !state)}
        />
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-[100vh]">
          <div className="h-15 w-15 animate animate-spin-slow text-purple-900">
            <Loader />
          </div>
        </div>
      ) : (
        <div
          className="grid gap-5 min-[1880px]:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2
    mt-5"
        >
          {pokemonList?.map(({ name }) => (
            <FlipCard key={name} name={name} keepFlipped={cardsFlipped} />
          ))}
        </div>
      )}
    </div>
  );
};

Home.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Home;
