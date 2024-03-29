import { atom, useAtom } from "jotai";
import { useEffect } from "react";

import Loader from "@icons/loader.svg";

import { ModalContainer } from "./ModalContainer";

const refetchStateAtom = atom(false);

export const Refetch = ({
  isRefetching,
  anotherAtom,
}: {
  isRefetching: boolean;
  anotherAtom?: typeof refetchStateAtom;
}) => {
  const [_, toggleModal] = useAtom(anotherAtom ?? refetchStateAtom);

  useEffect(() => {
    toggleModal(isRefetching);
  }, [isRefetching]);

  return (
    <ModalContainer anotherAtom={anotherAtom ?? refetchStateAtom}>
      {() => (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin">
            <Loader className="text-orange-500 h-40 w-40" />
          </div>
        </div>
      )}
    </ModalContainer>
  );
};
