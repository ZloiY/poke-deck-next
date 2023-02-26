import { EmptyDeckCard } from "./EmptyDeckCard";
import { FilledDeckCard } from "./FilledDeckCard";
import { DeckCard as DeckCardProps } from "./types";

export const DeckCard = ({ deck, addCard, removeDeck }: Required<DeckCardProps>) => {
  return (
    deck.isEmpty
    ? <EmptyDeckCard deck={deck} addCard={addCard} removeDeck={removeDeck} />
    : <FilledDeckCard deck={deck} addCard={addCard} removeDeck={removeDeck} />
  )
}