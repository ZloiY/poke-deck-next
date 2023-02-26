import { useRouter } from "next/router";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import { env } from "../env/client.mjs";
import { useModalState } from "../hooks/useModalState";
import { api } from "../utils/api";
import { AddDeckCard } from "./Cards";
import { DeckCard } from "./Cards/Deck/DeckCard";
import { Loader } from "./Loader";
import { CreateDeck } from "./Modals";
import { CreateDeckParams } from "./Modals/CreateDeck";
import { twMerge } from "tailwind-merge";

export const UserDecks = () => {
  const route = useRouter();
  const [_, showModal] = useModalState();
  const createDeck = api.deck.createDeck.useMutation();
  const removeDeck = api.deck.removeUserDeck.useMutation();
  const {
    data: userDecks,
    isRefetching,
    refetch,
  } = api.deck.getUserDecks.useQuery();
  const [parent] = useAutoAnimate();

  const create = async (params: CreateDeckParams) => {
    await createDeck.mutateAsync(params);
    refetch();
  };

  const remove = async (id: string) => {
    await removeDeck.mutateAsync(id);
    refetch();
  };

  const addPokemons = (deckId: string) => {
    route.push({
      pathname: "/home",
      query: {
        ...route.query,
        deckId,
      },
    });
  };

  return (
    <>
      <CreateDeck create={create} isLoading={createDeck.isLoading} />
      <div className="border-2 rounded-xl border-purple-900 bg-purple-800/60 p-2">
        <div className="flex justify-between items-center">
          <span className="font-coiny text-3xl">Your Decks:</span>
          <span className="font-coiny text-3xl font-normal">
            {userDecks?.length}/{env.NEXT_PUBLIC_USER_MAX_DECKS}
          </span>
        </div>
        <div ref={parent} className={twMerge("w-full flex gap-5", isRefetching && "items-center")}>
          {userDecks?.length != +env.NEXT_PUBLIC_USER_MAX_DECKS && <AddDeckCard onClick={showModal} />}
          <Loader isLoading={isRefetching}>
            <>
              {userDecks?.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  addCard={addPokemons}
                  removeDeck={remove}
                />
              ))}
            </>
          </Loader>
        </div>
      </div>
    </>
  );
};
