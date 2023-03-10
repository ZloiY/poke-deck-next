import { memo } from "react";
import { twMerge } from "tailwind-merge";

import AddCard from "@icons/add-card.svg";
import DeleteDeck from "@icons/delete.svg";
import Private from "@icons/private.svg";
import { Deck } from "@prisma/client";

import { BlankDeckCard } from "./BlankDeckCard";

export const EmptyDeckCard = memo(
  ({
    deck,
    addCard,
    removeDeck,
    notInteractive = false,
    className,
  }: DeckCard<Deck & { username?: string }>) => (
    <BlankDeckCard className={className} notInteractive={notInteractive}>
      {deck.private && (
        <Private
          className={twMerge(
            "absolute top-2 left-1 w-10 h-10",
            notInteractive && "top-40 left-0",
          )}
        />
      )}
      <div
        onClick={() => addCard?.(deck.id)}
        className="relative flex justify-center items-center h-full w-full"
      >
        <div>
          <AddCard role="button" className="w-full h-full mx-auto" />
          {addCard && (
            <p className="font-coiny mt-4 text-2xl text-center">
              Add cards to the deck
            </p>
          )}
          {deck.username && (
            <p className="font-fredoka text-2xl text-center mt-2">
              Owner: {deck.username}
            </p>
          )}
        </div>
        <p
          className={twMerge(
            "absolute top-0 font-coiny text-3xl",
            notInteractive && "text-base",
          )}
        >
          {deck.name}
        </p>
      </div>
      {removeDeck && (
        <DeleteDeck
          className="absolute bottom-2 right-1 w-14 h-14 text-red-700 hover:text-red-500 active:text-red-600 active:scale-90"
          onClick={() => removeDeck?.(deck.id)}
        />
      )}
    </BlankDeckCard>
  ),
);
