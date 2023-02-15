import Image from "next/image";

import Loader from "@icons/loader.svg";
import { api } from "../../utils/api";

export const PreviewCard = ({ name }: { name: string }) => {
  const { data: pokemon, isLoading } = api.pokemon.getPokemonInfo.useQuery({
    name,
  });

  if (isLoading || !pokemon) {
    return (
      <div
        className="
          flex items-center justify-center
          relative
          rounded-xl
          bg-purple-900
          h-[440px]
          px-2
          py-1 text-yellow-500
          hover:shadow-[0_0_15px_4px] hover:shadow-orange-500"
      >
        <div className="animate-spin-slow h-10 w-10">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div
      className="
          flex
          h-[440px]
          max-w-xs flex-col
          items-center
          justify-between
          gap-5 rounded-xl bg-purple-900 p-4
          hover:shadow-[0_0_15px_4px] hover:shadow-orange-500"
    >
      <div className="relative h-full flex justify-center items-center">
        <Image
          src={pokemon.sprites.other?.["official-artwork"].front_default!}
          alt={`${name} image`}
          height={250}
          width={200}
        />
      </div>
      <span className="text-3xl capitalize text-white">{pokemon.name}</span>
    </div>
  );
};
