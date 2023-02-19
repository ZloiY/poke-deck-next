import { ReactElement } from "react";

import { AddDeckCard } from "../components/Cards";
import { Layout } from "../components/Layout";
import { CreateDeck, type CreateDeckParams } from "../components/Modals/CreateDeck";
import { ModalContainer } from "../components/Modals/ModalContainer";
import { useModalState } from "../hooks/useModalState";
import { api } from "../utils/api";
import { NextPageWithLayout } from "./_app";

const Decks: NextPageWithLayout = () => {
  const [_, showModal] = useModalState();
  const createDeck = api.deck.createDeck.useMutation();

  const create = (params: CreateDeckParams) => {
    createDeck.mutate(params);
  }

  return (
    <div className="flex flex-col gap-8">
      <ModalContainer title="Test">{(closeModal) => <CreateDeck create={create} closeModal={closeModal}/>}</ModalContainer>
      <div className="border-2 rounded-xl border-purple-900 bg-purple-800/60 p-2">
        <span className="font-coiny text-3xl">Your Decks:</span>
        <AddDeckCard onClick={showModal} />
      </div>
      <div className="border-2 rounded-xl border-purple-900 bg-purple-800/60 p-2">
        <span className="font-coiny text-3xl">Others players decks:</span>
      </div>
    </div>
  );
};

Decks.getLayout = (page: ReactElement) => (
  <Layout showFlip={false}>{page}</Layout>
);

export default Decks;
