import { useEffect, useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import Remove from "@icons/close-circle.svg";
import { a, config, useTransition } from "@react-spring/web";

import { useSelectPokemons } from "../../hooks";
import { api } from "../../utils/api";
import { Button } from "../Button";
import { PreviewCard } from "../Cards";
import { EmptyDeckCard } from "../Cards/Deck/EmptyDeckCard";
import { Loader } from "../Loader";
import { ModalContainer } from "./ModalContainer";
import { Select } from "../Select";

export const AddCards = ({ deckId }: { deckId?: string | null }) => {
  const { data: decks, isLoading } = api.deck.getUserDecks.useQuery(deckId);
  const { pokemons, removePokemon } = useSelectPokemons();
  const [parent] = useAutoAnimate();
  const transitions = useTransition(pokemons, {
    trail: 400 / pokemons.length,
    keys: (pokemon) => pokemon.name,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    config: config.stiff,
  });

  return (
    <ModalContainer title="Add cards to the decks">
      {(onClose) => (
        <div className="flex flex-col gap-5 min-w-[450px] max-w-[720px] px-2 pb-4">
          <div className="flex gap-10 w-full px-1">
            <Loader isLoading={isLoading}>
              <>
                <div className="flex flex-grow justify-start items-center">
                  {decks?.map((deck) => (
                    <EmptyDeckCard
                      className="w-32 h-52 border-yellow-500 border-2"
                      notResponsive={true}
                      deck={deck!}
                    />
                  ))}
                </div>
                <div className="flex justify-start items-center">
                  <div className="flex gap-5 flex-col">
                    <p className="font-coiny text-2xl">Select deck:</p>
                  <Select className="w-64" defaultValue={decks?.[0]} getOptionLabel={(deck) => deck.name} isOptionSelected={(deck) => deck.id == deckId} options={decks}/>
                  </div>
                </div>
              </>
            </Loader>
          </div>
          <div ref={parent} className="flex flex-wrap justify-center gap-3">
            {transitions((style, pokemon) => (
              <a.div style={style} className="relative">
                <PreviewCard
                  className="w-32 h-52 text-sm border-yellow-500 border-2"
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
          <Button className="bg-green-500 w-full">Add Cards!</Button>
        </div>
      )}
    </ModalContainer>
  );
};
