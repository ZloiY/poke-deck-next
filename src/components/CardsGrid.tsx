import { Pokemon } from "pokenode-ts";
import { useEffect } from "react";

import { a, config, useSpring } from "@react-spring/web";

import { useLoadingState, usePaginationState } from "../hooks";
import { FlipCard } from "./Cards";
import { unknown } from "zod";

export const CardsGrid = ({
  pokemons,
  cardsFlipped = false,
}: {
  pokemons?: Pokemon[];
  cardsFlipped?: boolean;
}) => {
  const loadingState = useLoadingState();
  const paginationState = usePaginationState();

  const [{ position, left }, api] = useSpring(() => ({
    from: { position: "absolute", left: 0 },
    to: [{ position: "absolute", left: 0 }, { position: "static" }],
    immediate: true,
    config: config.slow,
  }));

  useEffect(() => {
    switch (true) {
      case loadingState == "Started" && paginationState == "Next": {
        api.start({
          from: { position: "absolute", left: 0 },
          to: [{ position: "absolute", left: -2000 }],
        });
        break;
      } 
      case loadingState == "Started" && paginationState == "Prev": {
        api.start({
          from: { position: "absolute", left: 0 },
          to: [{ position: 'absolute', left: 2000 }]
        });
        break;
      }
      case loadingState == "Finished" && paginationState == "Next": {
        api.start({
          from: { position: "absolute", left: 2000 },
          to: [{ position: "absolute", left: 0 }],
        });
        break;
      }
      case loadingState == "Finished" && paginationState == "Prev": {
        api.start({
          from: { position: "absolute", left: -2000 },
          to: [{ position: "absolute", left: 0 }]
        })
        break;
      } 
    }
  }, [loadingState, paginationState]);

  return (
    <div className="h-full relative">
      <a.div
        style={{ position: position as unknown as 'static', left }}
        className="w-full grid gap-5 min-[1880px]:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2
mt-5"
      >
        {pokemons?.map((pokemon) => (
          <FlipCard
            key={pokemon.name}
            pokemon={pokemon}
            keepFlipped={cardsFlipped}
          />
        ))}
      </a.div>
    </div>
  );
};
