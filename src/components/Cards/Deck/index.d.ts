type DeckCard<T> = {
  deck: T,
  addCard?: (id: string) => void;
  removeDeck?: (id: string) => void;
  className?: string;
  notInteractive?: boolean;
}