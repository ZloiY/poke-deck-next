import next from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import Add from "@icons/add-card.svg";
import Delete from "@icons/delete.svg";
import Private from "@icons/private.svg";
import { a, config, useSprings } from "@react-spring/web";

import { api } from "../../../utils/api";
import { Loader } from "../../Loader";
import { PreviewCard } from "../PreviewCard";
import { BlankDeckCard } from "./BlankDeckCard";
import { Deck } from "@prisma/client";

const getFirstSix = <T extends any>(arr: T[]): T[] => {
  const counter = 6;
  const getOne = (counter: number, result: T[], tail: T[]): T[] => {
    if (counter == 0 || !tail[0]) {
      return result;
    } else {
      const [head, ...newTail] = tail;
      return getOne(--counter, [...result, head], newTail);
    }
  };
  return getOne(counter, [], arr);
};

const getRandomShift = () => Math.ceil(Math.random() * 10 - 5);

export const FilledDeckCard = ({
  deck,
  removeDeck,
  addCard,
  className,
  notInteractive,
}: DeckCard<Deck>) => {
  const { data: pokemons, isLoading } = api.deck.getPokemonsByDeckId.useQuery(
    deck.id,
  );
  const [isHovered, toggleHovered] = useState(false);
  const router = useRouter();

  const firstSixOrLess = useMemo(
    () => (pokemons ? getFirstSix(pokemons) : []),
    [pokemons],
  );

  const [animatedCards, animate] = useSprings(
    firstSixOrLess.length,
    (index) => ({
      from: {
        top: `${index * (notInteractive ? -4 : -10)}px`,
        left: `0px`,
        rotate: `${index * getRandomShift()}deg`,
        zIndex: 1,
      },
      immediate: true,
    }),
    [firstSixOrLess, notInteractive],
  );

  const mouseEntered = () => {
    animate.start((index) => ({
      to: {
        top: `${
          (-1 * index ** 2 + (firstSixOrLess.length - 1) * index) * -15
        }px`,
        left: `${-150 + (index / (firstSixOrLess.length - 1)) * 300}px`,
        rotate: `${
          (-60 * firstSixOrLess.length) / 6 +
          ((index / (firstSixOrLess.length - 1)) *
            120 *
            firstSixOrLess.length) /
            6
        }deg`,
        zIndex: 2,
      },
      config: config.wobbly,
    }));
    toggleHovered(true);
  };

  const mouseLeft = () => {
    animate.start((index) => ({
      to: {
        top: `${index * -10}px`,
        left: `0px`,
        rotate: `${index * getRandomShift()}deg`,
        zIndex: 1,
      },
      config: config.stiff,
    }));
    toggleHovered(false);
  };

  const goToTheDeck = () => {
    router.push({
      pathname: "/pokemons/deck/[deckId]",
      query: { deckId: deck.id },
    });
  };

  return (
    <BlankDeckCard
      className={className}
      notInteractive={notInteractive}
    >
      {!deck.isFull && !notInteractive && (
        <Add
          className="absolute top-2 left-1 w-14 h-14 text-white hover:text-yellow-400 active:text-yellow-500 active:scale-90 cursor-pointer"
          onClick={() => addCard?.(deck.id)}
        />
      )}
      {deck.private && (
        <Private
          className={twMerge(
            "absolute top-2 right-1 text-white w-14 h-14",
            notInteractive && "top-1 right-0 w-5 h-5",
          )}
        />
      )}
      <div
      onClick={goToTheDeck}
        className={twMerge(
          "flex flex-col gap-5 justify-between items-center h-full",
          notInteractive && "gap-2 justify-end",
        )}
      >
        <Loader isLoading={isLoading}>
          <>
            <div
              className={twMerge(
                "relative mt-20 w-40 h-60",
                notInteractive && "mt-0 mb-10 w-10 h-16",
              )}
              onMouseEnter={mouseEntered}
              onMouseLeave={mouseLeft}
            >
              {animatedCards.map((styles, index) => (
                <a.div
                  key={firstSixOrLess[index]?.name}
                  className="absolute"
                  style={styles}
                >
                  <PreviewCard
                    className={twMerge(
                      "w-40 h-60 pb-0 text-xl border-2 rounded-xl border-yellow-500",
                      notInteractive && "w-14 h-24 text-xs border",
                    )}
                    pokemon={firstSixOrLess[index]!}
                    nameOnSide={isHovered}
                    notInteractive
                  />
                </a.div>
              ))}
            </div>
            <p className={twMerge("text-2xl", notInteractive && "text-base")}>
              {deck.name}
            </p>
            <p className={twMerge("text-xl", notInteractive && "text-sm")}>
              {deck.deckLength}/{process.env.NEXT_PUBLIC_DECK_MAX_SIZE}
            </p>
          </>
        </Loader>
      </div>
      {!notInteractive && (
        <Delete
          className="absolute right-1 bottom-2 w-14 h-14 text-red-700 hover:text-red-500 active:text-red-600 active:scale-90"
          onClick={() => removeDeck?.(deck.id)}
        />
      )}
    </BlankDeckCard>
  );
};
