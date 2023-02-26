import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import Remove from "@icons/close-circle.svg";
import { Deck } from "@prisma/client";
import { a, config, useSpringRef, useTransition } from "@react-spring/web";

import { useSelectPokemons } from "../../hooks";
import { api } from "../../utils/api";
import { Button } from "../Button";
import { DeckCard, PreviewCard } from "../Cards";
import { Loader } from "../Loader";
import { Select } from "../Select";
import { ModalContainer, isModalShown } from "./ModalContainer";

export const AddCards = ({
  deckId,
  onSubmit,
}: {
  deckId?: string | null;
  onSubmit?: () => void;
}) => {
  const { data: decks, isLoading } = api.deck.getUserDecks.useQuery(deckId);
  const [showModal, toggleModal] = useAtom(isModalShown);
  const [selectedDeck, setSelectedDeck] = useState(decks?.[0]);
  const addCardsToDecks = api.deck.addCardsToDecks.useMutation();
  const { pokemons, removePokemon, resetPokemons } = useSelectPokemons();
  const [parent] = useAutoAnimate();
  const transitions = useTransition(showModal ? pokemons : [], {
    trail: 400 / pokemons.length,
    keys: (pokemon) => pokemon.name,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    config: config.stiff,
  });

  useEffect(() => {
    if (decks) {
      setSelectedDeck(decks[0]);
    }
  }, [decks]);

  useEffect(() => {
    if (pokemons.length == 0) {
      toggleModal(false);
    }
  }, [pokemons.length]);

  const updateDeck = (onClose: () => void) => () => {
    if (selectedDeck) {
      addCardsToDecks
        .mutateAsync({
          decksIds: [selectedDeck.id],
          cards: pokemons.map((pokemon) => ({
            name: pokemon.name,
            imageUrl:
              pokemon.sprites.other?.["official-artwork"].front_default ??
              pokemon.sprites.front_default ??
              "",
          })),
        })
        .then(resetPokemons)
        .then(onSubmit)
        .then(onClose);
    }
  };

  return (
    <ModalContainer title="Add cards to the decks">
      {(onClose) => (
        <div className="flex flex-col gap-5 min-w-[450px] max-w-[720px] px-2 pb-4">
          <div className="flex gap-10 w-full px-1">
            <Loader isLoading={isLoading}>
              <>
                <div className="flex flex-grow justify-start items-center">
                  {decks?.map((deck) => (
                    <DeckCard
                      key={deck.id}
                      className="w-32 h-52 border-yellow-500 border-2"
                      notInteractive={true}
                      deck={deck}
                    />
                  ))}
                </div>
                <div className="flex justify-start items-center">
                  <div className="flex gap-5 flex-col">
                    <p className="font-coiny text-2xl">Select deck:</p>
                    <Select
                      className="w-64"
                      defaultValue={selectedDeck}
                      onChange={(value) => setSelectedDeck(value as Deck)}
                      getOptionLabel={(deck) => deck.name}
                      isOptionSelected={(deck) => deck.id == deckId}
                      options={decks}
                    />
                  </div>
                </div>
              </>
            </Loader>
          </div>
          <div ref={parent} className="flex flex-wrap justify-center gap-3">
            {transitions((style, pokemon) => (
              <a.div style={style} className="relative">
                <PreviewCard
                  className="w-32 h-52 text-xl border-yellow-500 border-2"
                  pokemon={pokemon}
                  notInteractive={true}
                />
                <Remove
                  className="absolute top-1 right-1 w-10 h-10 text-red-600 hover:text-red-400 active:text-red-500 active:scale-90 cursor-pointer"
                  onClick={() => removePokemon(pokemon)}
                />
              </a.div>
            ))}
          </div>
          <Button
          isLoading={addCardsToDecks.isLoading}
            className="bg-green-500 w-full"
            disabled={!selectedDeck}
            onClick={updateDeck(onClose)}
          >
            Add Cards!
          </Button>
        </div>
      )}
    </ModalContainer>
  );
};
