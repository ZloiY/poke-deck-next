import { EmptyDeckCard } from "./EmptyDeckCard";
import { FilledDeckCard } from "./FilledDeckCard";
import { DeckCard as DeckCardProps } from "./types";

export const DeckCard = ({ deck, ...props }: DeckCardProps) => {
  return (
    deck.isEmpty
    ? <EmptyDeckCard deck={deck} {...props} />
    : <FilledDeckCard deck={deck} {...props} />
  )
}