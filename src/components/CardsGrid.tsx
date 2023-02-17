import { FlipCard } from "./Cards/FlipCard";

export const CardsGrid = <T extends { name: string }>({
  cardItems,
  cardsFlipped = false,
}: {
  cardItems?: T[];
  cardsFlipped?: boolean,
}) => {
  return (
    <div
      className="grid gap-5 min-[1880px]:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2
mt-5"
    >
      {cardItems?.map(({ name }) => (
        <FlipCard key={name} name={name} keepFlipped={cardsFlipped} />
      ))}
    </div>
  );
};
