import { EmptyDeckCard } from "./EmptyDeckCard";
import { FilledDeckCard } from "./FilledDeckCard";

type DeckCardProps = Parameters<typeof EmptyDeckCard>[0] &
  Parameters<typeof FilledDeckCard>[0];

export const DeckCard = ({ deck, ...props }: DeckCardProps) => {
  return deck.isEmpty ? (
    <EmptyDeckCard deck={deck} {...props} />
  ) : (
    <FilledDeckCard deck={deck} {...props} />
  );
};
