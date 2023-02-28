import Image from "next/image";
import { Pokemon } from "pokenode-ts";
import { memo, useMemo } from "react";
import { twMerge } from "tailwind-merge";

import { Pokemon as PokemonDB } from "@prisma/client";

import { BlankCard } from "./BlankCard";

export const PreviewCard = memo(
  ({
    pokemon,
    className,
    notInteractive = false,
    nameOnSide = false,
    imageHeight,
    imageWidth,
  }: {
    pokemon: Pokemon | PokemonDB;
    nameOnSide?: boolean;
    notInteractive?: boolean;
    className?: string;
    imageWidth?: number;
    imageHeight?: number;
  }) => {
    const imageUrl = useMemo(() => {
      if ("imageUrl" in pokemon) {
        return pokemon.imageUrl;
      } else {
        return pokemon.sprites?.other?.["official-artwork"].front_default ?? "";
      }
    }, [pokemon]);

    return (
      <BlankCard
        notInteractive={notInteractive}
        className={twMerge("text-3xl", className)}
      >
        <div
          className="
          flex
          h-full
          max-w-xs flex-col
          items-center
          justify-between"
        >
          <div className="relative h-full flex justify-center items-center">
            <Image
              src={imageUrl}
              alt={`${pokemon.name} image`}
              height={imageHeight ?? 250}
              width={imageWidth ?? 200}
            />
          </div>
          <span
            className={twMerge(
              "capitalize text-white transition-transform duration-200",
              nameOnSide && "-translate-x-16 -translate-y-16 rotate-90",
            )}
          >
            {pokemon.name}
          </span>
        </div>
      </BlankCard>
    );
  },
);
