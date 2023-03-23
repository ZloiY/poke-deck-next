import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

import { isModalShown } from "../components/Modals/ModalContainer";

export const useModalState = (showOnMount?: boolean) => {
  const [modalState, toggleModal] = useAtom(isModalShown);

  useEffect(() => {
    if (showOnMount) {
      toggleModal(true);
    }
  }, []);

  const showModal = useCallback(() => {
    toggleModal(true);
  }, []);

  return [modalState, showModal] as const;
};
