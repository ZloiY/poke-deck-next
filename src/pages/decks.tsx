import { ReactElement } from "react";

import { AddDeckCard } from "../components/Cards";
import { Layout } from "../components/Layout";
import { CreateDeck } from "../components/Modals/CreateDeck";
import { ModalContainer } from "../components/Modals/ModalContainer";
import { useModalState } from "../hooks/useModalState";
import { NextPageWithLayout } from "./_app";

const Decks: NextPageWithLayout = () => {
  const [_, showModal] = useModalState();

  return (
    <div className="flex flex-col gap-8">
      <ModalContainer title="Test">{(onClose) => <CreateDeck/>}</ModalContainer>
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
