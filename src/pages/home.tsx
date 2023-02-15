import { type NextPage } from "next";
import { useSession } from "next-auth/react";

import Loader from "../../public/loader.svg";
import { Layout } from "../components/Layout";
import { DetailsCard } from "../components/DetailsCard";
import { api } from "../utils/api";

import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
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
    <div className="grid gap-5 min-[1880px]:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2">
      {data?.map(({ name }) => (
        <DetailsCard name={name} />
      ))}
    </div>
  );
};

Home.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Home;
