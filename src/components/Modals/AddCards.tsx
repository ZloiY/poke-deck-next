import { Pokemon } from "pokenode-ts";

import { api } from "../../utils/api";
import { Button } from "../Button";
import { PreviewCard } from "../Cards";
import { EmptyDeckCard } from "../Cards/Deck/EmptyDeckCard";
import { Loader } from "../Loader";
import { ModalContainer } from "./ModalContainer";

export const AddCards = ({
  deckId,
  pokemon,
}: {
  deckId?: string | null;
  pokemon: Pokemon[];
}) => {
  const { data: decks, isLoading } = api.deck.getUserDecks.useQuery(deckId);

  return (
    <ModalContainer title="Add cards to the decks">
      {(onClose) => (
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-start gap-10">
            <Loader isLoading={isLoading}>
              <>
                {decks?.map((deck) => (
                  <div>
                    <EmptyDeckCard notResponsive={true} deck={deck!} />
                    <p className="font-coiny text-3xl text-white text-center mt-2">
                      {deck?.name}
                    </p>
                  </div>
                ))}
              </>
            </Loader>
          </div>
          <div className="flex flex-wrap gap-3">
            {pokemon.map((pokemon) => (
              <PreviewCard pokemon={pokemon} notInteractive={true} />
            ))}
          </div>
          <Button className="bg-green-500 w-full">Add Cards!</Button>
        </div>
      )}
    </ModalContainer>
  );
};
