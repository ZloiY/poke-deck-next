import { Pokemon } from "pokenode-ts";
import { ReactElement, useEffect, useRef } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { a, config, useSpring } from "@react-spring/web";

import { useLoadingState, usePaginationState } from "../hooks";
import { DetailsCard, FlipCard, PreviewCard } from "./Cards";
import { twMerge } from "tailwind-merge";

export const cardGridStyles = `grid gap-y-10 gap-x-5 min-[1880px]:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4lg
lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 items-center justify-items-center`

type Card = typeof FlipCard | typeof DetailsCard | typeof PreviewCard;

export const CardsGrid = <P extends Pokemon>({
  pokemons = [],
  children
}: {
  pokemons?: P[];
  children: <T extends { pokemon: Pokemon }>(pokemon: Pokemon) => ReactElement<T>
}) => {
  const loadingState = useLoadingState();
  const paginationState = usePaginationState();
  const [parent, toggleAnimation] = useAutoAnimate({
    duration: 500,
    easing: "ease-out",
  });

  const [{ position, left }, api] = useSpring(() => ({
    from: { position: "absolute", left: 0 },
    to: [{ position: "absolute", left: 0 }, { position: "static" }],
    immediate: true,
    config: config.slow,
  }));

  useEffect(() => {
    switch (true) {
      case paginationState == "Initial": {
        toggleAnimation(true);
        break;
      }
      case loadingState == "Started" && paginationState == "Next": {
        api.start({
          from: { position: "absolute", left: 0 },
          to: [{ position: "absolute", left: -5000 }],
          config: { tension: 120, friction: 100 },
        });
        break;
      }
      case loadingState == "Started" && paginationState == "Prev": {
        api.start({
          from: { position: "absolute", left: 0 },
          to: [{ position: "absolute", left: 5000 }],
          config: { tension: 120, friction: 100 },
        });
        break;
      }
      case loadingState == "Finished" && paginationState == "Next": {
        api.start({
          from: { position: "absolute", left: 5000 },
          to: [{ position: "absolute", left: 0 }],
          config: config.slow,
        });
        break;
      }
      case loadingState == "Finished" && paginationState == "Prev": {
        api.start({
          from: { position: "absolute", left: -5000 },
          to: [{ position: "absolute", left: 0 }],
          config: config.slow,
        });
        break;
      }
      default: {
        toggleAnimation(false);
      }
    }
  }, [loadingState, paginationState]);

  return (
    <div className="h-full relative">
      <a.div
        style={{ position: position as unknown as "static", left }}
        ref={parent}
        className={twMerge("w-full mt-5", cardGridStyles)}
      >
        {pokemons?.map((pokemon) => (children(pokemon)))}
      </a.div>
    </div>
  );
};
