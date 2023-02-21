import Image from "next/image";
import { Pokemon } from "pokenode-ts";
import { twMerge } from "tailwind-merge";

import { BlankCard } from "./BlankCard";

export const PreviewCard = ({ pokemon, className, notInteractive = false }: { pokemon: Pokemon; notInteractive?: boolean, className?: string }) => {
  return (
    <BlankCard notInteractive={notInteractive} className={className}>
      <div
        className="
          flex
          h-full
          max-w-xs flex-col
          items-center
          justify-between
          gap-5"
      >
        <div className="relative h-full flex justify-center items-center">
          <Image
            src={pokemon?.sprites.other?.["official-artwork"].front_default ?? ''}
            alt={`${pokemon.name} image`}
            height={250}
            width={200}
          />
        </div>
        <span className={twMerge("text-3xl capitalize text-white", notInteractive && 'text-xl')}>{pokemon.name}</span>
      </div>
    </BlankCard>
  );
};
