import { useState } from "react";
import { twMerge } from "tailwind-merge";

import Flip from "@icons/flip.svg";
import Loader from "@icons/loader.svg";

import { FlipCard } from "../components/Cards/FlipCard";
import { Layout } from "../components/Layout";
import { api } from "../utils/api";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const [cardsFlipped, toggle] = useState<boolean>(false);
  const { data, isLoading } = api.pokemon.getPokemonList.useQuery({
    limit: 18,
    offset: 0,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <div className="h-15 w-15 animate animate-spin-slow text-purple-900">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-end -mt-5">
        <Flip 
        className={twMerge(
          "h-10 w-10 text-white transition-transform duration-200 hover:text-yellow-500 cursor-pointer",
          cardsFlipped && "text-purple-900 rotate-180"
          )}
        onClick={() => toggle(state => !state)} />
      </div>
      <div className="grid gap-5 min-[1880px]:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2
      mt-5">
        {data?.map(({ name }) => (
          <FlipCard key={name} name={name} keepFlipped={cardsFlipped} />
        ))}
      </div>
    </div>
  );
};

Home.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Home;
