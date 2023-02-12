import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Layout } from "../components/Layout";
import { api } from "../utils/api";

import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const { data, isFetching } = api.pokemon.getPokemonList.useQuery({ limit: 30, offset: 0});

  return <div>
    {isFetching ? 'Loading...' : data?.map((pokemon) => pokemon.name).join(' ')}
      </div>
};

Home.getLayout = (page: React.ReactElement) => (
  <Layout>
    {page}
  </Layout>
)

export default Home;
