import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

import { api } from "../utils/api";
import { DeckCard } from "./Cards";
import { Loader } from "./Loader";

export const OtherUsersDecks = () => {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.deck.getOthersUsersDecks.useInfiniteQuery(
      { limit: 7 },
      {
        getNextPageParam: (page) => page.nextCursor,
      },
    );
  const parent = useRef(null);

  const decks = useMemo(
    () => data?.pages.flatMap((data) => data.decks) ?? [],
    [data?.pages],
  );
  const decksLength = useMemo(
    () => data?.pages.reverse()[0]?.decksLength,
    [data?.pages],
  );

  const virtualColumn = useVirtualizer({
    horizontal: true,
    count: hasNextPage ? decks?.length + 1 : decks?.length,
    getScrollElement: () => parent.current,
    estimateSize: () => 320,
    overscan: 7,
  });

  const viewDeck = (deckId: string) => {
    router.push({
      pathname: "/decks/[deckId]",
      query: { deckId },
    });
  };

  useEffect(() => {
    const [lastItem] = [...virtualColumn.getVirtualItems()].reverse();
    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= decks.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    virtualColumn.getVirtualItems(),
    decks.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return (
    <div className="border-2 rounded-xl border-purple-900 bg-purple-800/60 p-2 pb-0 min-h-[570px]">
      <div className="flex justify-between items-center">
        <span className="font-coiny text-2xl">Others players decks:</span>
        <span className="font-coiny text-2xl">
          Total decks: {decksLength ?? 0}
        </span>
      </div>
      <Loader className="mt-32 w-60 h-60" isLoading={isLoading}>
        <div
          ref={parent}
          className="w-full h-[520px] flex gap-5 overflow-x-scroll pb-4 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent"
        >
          {decks.length > 0 ? (
            <div
              className="h-full relative text-center text-3xl"
              style={{ width: `${virtualColumn.getTotalSize()}px` }}
            >
              {virtualColumn.getVirtualItems().map((virtualItem) =>
              virtualItem.index < decks.length && (
                <div
                  key={virtualItem.index}
                  className="h-full"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${virtualItem.size}px`,
                    transform: `translateX(${virtualItem.start}px)`,
                  }}
                >
                  <DeckCard
                    onClick={viewDeck}
                    deck={decks[virtualItem.index]!}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-[25%] w-full text-center font-coiny text-2xl">
              Sorry there are no other users decks
            </div>
          )}
        </div>
      </Loader>
    </div>
  );
};
