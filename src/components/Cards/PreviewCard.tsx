import Image from "next/image";
import { Pokemon } from "pokenode-ts";

import { BlankCard } from "./BlankCard";

export const PreviewCard = ({ pokemon, notInteractive = false }: { pokemon: Pokemon; notInteractive?: boolean }) => {
  return (
    <BlankCard notInteractive={notInteractive}>
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
        <span className="text-3xl capitalize text-white">{pokemon.name}</span>
      </div>
    </BlankCard>
  );
};
