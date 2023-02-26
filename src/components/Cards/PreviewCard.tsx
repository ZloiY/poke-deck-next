import Image from "next/image";
import { Pokemon } from "pokenode-ts";
import { Pokemon as PokemonDB } from "@prisma/client";
import { twMerge } from "tailwind-merge";

import { BlankCard } from "./BlankCard";
import { useMemo } from "react";

export const PreviewCard = ({
  pokemon,
  className,
  notInteractive = false,
  nameOnSide = false,
}: {
  pokemon: Pokemon | PokemonDB;
  nameOnSide?: boolean;
  notInteractive?: boolean;
  className?: string;
}) => {
  const imageUrl = useMemo(() => {
    if ('imageUrl' in pokemon) {
      return pokemon.imageUrl;
    } else {
      return  pokemon.sprites?.other?.["official-artwork"].front_default ?? ''
    }
  }, [pokemon])

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
            src={imageUrl}
            alt={`${pokemon.name} image`}
            height={250}
            width={200}
          />
        </div>
        <span
          className={twMerge(
            "text-3xl capitalize text-white transition-transform duration-200",
            notInteractive && "text-xl",
            nameOnSide && "-translate-x-16 -translate-y-16 rotate-90"
          )}
        >
          {pokemon.name}
        </span>
      </div>
    </BlankCard>
  );
};
