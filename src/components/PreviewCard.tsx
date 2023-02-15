import Image from "next/image";
import { twMerge } from "tailwind-merge";

import Loader from "../../public/loader.svg";
import { api } from "../utils/api";

type DetailsCardProps = {
  name: string;
};

export const DetailsCard = ({ name }: DetailsCardProps) => {
  const { data: pokemon, isLoading } = api.pokemon.getPokemonInfo.useQuery({
    name,
  });

  if (isLoading) {
    return (
      <div
        className="
          relative
          rounded-md
          bg-purple-900
          px-2 py-1
          hover:shadow-[0_0_15px_4px] hover:shadow-orange-500"
      >
        <Loader className="animate-spin fill-orange-500" />
      </div>
    );
  }
  
  return (
    <div
      className="
        relative
        w-70
        rounded-md bg-purple-900
        p-4
        hover:shadow-[0_0_15px_4px] hover:shadow-yellow-500"
    >
      <div className="flex flex-col justify-between items-stretch gap-4">
        <div className="flex gap-7">
          <Image
            src={pokemon?.sprites.front_default!}
            alt={`${name} image`}
            width={150}
            height={50}
          />
          <div className="flex flex-col items-center gap-7">
            <span className="text-2xl capitalize">{pokemon?.name}</span>
            <div className="flex flex-col gap-5">
              <span className="text-xl">Height: <span className="text-yellow-500">{pokemon?.height}</span></span>
              <span className="text-xl">Weight: <span className="text-yellow-500">{pokemon?.weight}</span></span>
            </div>
          </div>
        </div>
        <div>
          <span className="text-xl">Abilities:</span>
          <div className="flex flex-wrap justify-between gap-1">
            {pokemon?.abilities.map((ability) => (
              <span className="text-lg capitalize text-yellow-500">{ability.ability.name}</span>
            ))}
          </div>
        </div>
        <div className="self-end">
          <span className="text-xl">Stats:</span>
          <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-end">
            {pokemon?.stats.map((stat) => (
              <div>
                <span>{stat.stat.name}</span>
                <div className="h-5 w-20 border-2 border-orange-400 bg-transparent relative flex justify-center items-center">
                  <span className="z-10">{stat.base_stat}</span>
                  <div className="h-full absolute top-0 left-0 bg-orange-400" style={{ width: `${stat.base_stat}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
