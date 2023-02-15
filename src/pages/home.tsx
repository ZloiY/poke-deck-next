import { type NextPage } from "next";
import { useSession } from "next-auth/react";

import Loader from "../../public/loader.svg";
import { Layout } from "../components/Layout";
import { DetailsCard } from "../components/PreviewCard";
import { api } from "../utils/api";

import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const { data, isFetching } = api.pokemon.getPokemonList.useQuery({
    limit: 18,
    offset: 0,
  });

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <div className="h-15 w-15 animate animate-spin-slow text-purple-900">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 grid-cols-6">
      {data?.map(({ name }) => (
        <DetailsCard name={name} />
      ))}
    </div>
  );
};

Home.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Home;
