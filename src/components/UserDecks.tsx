import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { twMerge } from "tailwind-merge";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import { env } from "../env/client.mjs";
import { useMessageBus } from "../hooks";
import { useModalState } from "../hooks/useModalState";
import { api } from "../utils/api";
import { AddDeckCard } from "./Cards";
import { DeckCard } from "./Cards/Deck/DeckCard";
import { Loader } from "./Loader";
import { CreateDeck } from "./Modals";

export const UserDecks = () => {
  const route = useRouter();
  const [_, showModal] = useModalState();
  const createDeck = api.deck.createDeck.useMutation();
  const removeDeck = api.deck.removeUserDeck.useMutation();
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = api.deck.getUserDecks.useInfiniteQuery(
    { limit: 4 },
    {
      getNextPageParam: (last) => last.nextCursor,
    },
  );
  const userDecks = useMemo(
    () => data?.pages.flatMap((group) => group.decks) ?? [],
    [data?.pages],
  );
  const [parent] = useAutoAnimate();
  const { pushMessage } = useMessageBus();

  const create = async (params: CreateDeckParams) => {
    const message = await createDeck.mutateAsync(params);
    pushMessage(message);
    refetch();
  };

  const remove = async (id: string) => {
    const message = await removeDeck.mutateAsync(id);
    pushMessage(message);
    refetch();
  };

  const addPokemons = (deckId: string) => {
    route.push({
      pathname: "/home",
      query: {
        deckId,
      },
    });
  };

  return (
    <>
      <CreateDeck create={create} isLoading={createDeck.isLoading} />
      <div className="border-2 rounded-xl border-purple-900 bg-purple-800/60 p-2 pb-0">
        <div className="flex justify-between items-center">
          <span className="font-coiny text-3xl">Your Decks:</span>
          <span className="font-coiny text-3xl font-normal">
            {userDecks?.length}/{env.NEXT_PUBLIC_USER_MAX_DECKS}
          </span>
        </div>
        <div
          id="scroll-div"
          ref={parent}
          className={twMerge(
            "w-full h-[520px] flex gap-5 overflow-x-scroll pb-4 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent",
            isLoading && "justify-center"
          )}
        >
          <Loader className="w-60 h-60" isLoading={isLoading}>
            <InfiniteScroll
              hasMore={!!hasNextPage}
              className="flex gap-5 w-full"
              dataLength={userDecks?.length ?? 0}
              next={fetchNextPage}
              loader={<Loader isLoading />}
              scrollableTarget="scroll-div"
            >
              {userDecks?.length != +env.NEXT_PUBLIC_USER_MAX_DECKS && (
                <AddDeckCard onClick={showModal} />
              )}
              {userDecks?.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  addCard={addPokemons}
                  removeDeck={remove}
                />
              ))}
            </InfiniteScroll>
          </Loader>
        </div>
      </div>
    </>
  );
};
