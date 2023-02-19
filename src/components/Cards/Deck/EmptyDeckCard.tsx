import { ReactEventHandler, memo } from "react";

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
    notResponsive = false,
  }: {
    deck: Deck;
    addCard?: (id: string) => void;
    removeDeck?: (id: string) => void;
    notResponsive?: boolean
  }) => (
    <BlankDeckCard onClick={() => addCard?.(deck.id)} notResponsive={notResponsive}>
      <div className="relative flex justify-center items-center h-full w-full">
        <div>
          <AddCard className="w-60 h-60 mx-auto" />
          <p className="font-coiny mt-4 text-2xl text-center">Add cards to the deck</p>
        </div>
        <p className="absolute top-0 font-coiny text-3xl">{deck.name}</p>
        {deck.private && (
          <Private className="absolute top-0 left-0 w-10 h-10 text-white" />
        )}
        <DeleteDeck
          className="absolute bottom-0 right-0 w-14 h-14 text-red-700 hover:text-red-500 active:text-red-600 active:scale-90"
          onClick={() => removeDeck?.(deck.id)}
        />
      </div>
    </BlankDeckCard>
  ),
);
