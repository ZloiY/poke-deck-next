import { useRouter } from "next/router";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import { useModalState } from "../hooks/useModalState";
import { api } from "../utils/api";
import { AddDeckCard } from "./Cards";
import { DeckCard } from "./Cards/Deck/DeckCard";
import { Loader } from "./Loader";
import { CreateDeck } from "./Modals";
import { CreateDeckParams } from "./Modals/CreateDeck";

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
      <CreateDeck create={create} />
      <div className="border-2 rounded-xl border-purple-900 bg-purple-800/60 p-2">
        <span className="font-coiny text-3xl">Your Decks:</span>
        <div
          ref={parent}
          className="w-full grid gap-5 min-[1880px]:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2"
        >
          <AddDeckCard onClick={showModal} />
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
