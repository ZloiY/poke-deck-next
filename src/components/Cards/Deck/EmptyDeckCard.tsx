import { ReactEventHandler, memo } from "react";

import AddCard from "@icons/add-card.svg";
import DeleteDeck from "@icons/delete.svg";
import Private from "@icons/private.svg";

import { BlankDeckCard } from "./BlankDeckCard";
import { twMerge } from "tailwind-merge";
import { DeckCard } from './types';

export const EmptyDeckCard = memo(
  ({
    deck,
    addCard,
    removeDeck,
    notInteractive = false,
    className,
  }: DeckCard) => (
    <BlankDeckCard className={className} onClick={() => addCard?.(deck.id)} notInteractive={notInteractive}>
      {deck.private && (
          <Private className="absolute top-2 left-1 w-10 h-10" />
        )}
      <div className="relative flex justify-center items-center h-full w-full">
        <div>
          <AddCard className="w-full h-full mx-auto" />
          {!notInteractive && <p className="font-coiny mt-4 text-2xl text-center">Add cards to the deck</p>}
        </div>
        <p className={twMerge("absolute top-0 font-coiny text-3xl", notInteractive && 'text-xl')}>{deck.name}</p>
        {!notInteractive && <DeleteDeck
          className="absolute bottom-0 right-0 w-14 h-14 text-red-700 hover:text-red-500 active:text-red-600 active:scale-90"
          onClick={() => removeDeck?.(deck.id)}
        />}
      </div>
    </BlankDeckCard>
  ),
);
