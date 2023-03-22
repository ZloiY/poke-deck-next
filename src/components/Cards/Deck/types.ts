import { Deck } from "@prisma/client";

export type DeckCard = {
  deck: Deck;
  addCard?: (id: string) => void;
  removeDeck?: (id: string) => void;
  className?: string;
  notInteractive?: boolean;
};
