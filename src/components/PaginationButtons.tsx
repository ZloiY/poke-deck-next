import { atom, useAtom } from "jotai";

import Arrow from "@icons/arrow-left.svg";
import { useLoadingState } from "../hooks";
import { useEffect } from "react";

type PaginationState = "Initial" | "Next" | "Prev";

const paginationStateAtom = atom<PaginationState>("Initial");
const setPaginationState = atom(null, (_get, set, newState: PaginationState) =>
  set(paginationStateAtom, newState),
);
export const getPaginationState = atom((get) => get(paginationStateAtom));

export const PaginationButtons = ({
  onNextPage,
  onPrevPage,
  showNext,
  showPrev,
}: Partial<{
  onNextPage: () => void;
  onPrevPage: () => void;
  showNext: boolean;
  showPrev: boolean;
}>) => {
  const [_, setState] = useAtom(setPaginationState);
  const loadingState = useLoadingState();

  useEffect(() => {
    if (loadingState == 'Hold') {
      setState('Initial');
    }
  }, [loadingState])

  const nextClicked = () => {
    setState('Next');
    onNextPage?.();
  } 

  const prevClicked = () => {
    setState('Prev');
    onPrevPage?.();
  }

  return (
    <>
      {showPrev && (
        <div
          className="fixed -left-5 top-0 w-40 pl-5 h-full z-40 opacity-0
            flex justify-center items-center
          transition-all duration-200 -translate-x-2/4 hover:translate-x-0 hover:opacity-100"
        >
          <div
            className="rounded-full bg-black/50 p-5 cursor-pointer hover:bg-black/80 active:scale-90"
            onClick={prevClicked}
          >
            <Arrow className="fill-white h-20 w-20" />
            <div />
          </div>
        </div>
      )}
      {showNext && (
        <div
          className="fixed -right-5 top-0 w-40 pr-5 h-full z-40 opacity-0
          flex justify-center items-center
          transition-all duration-200 translate-x-2/4 hover:translate-x-0 hover:opacity-100"
        >
          <div
            className="rounded-full bg-black/50 p-5 cursor-pointer hover:bg-black/80 active:scale-90"
            onClick={nextClicked}
          >
            <Arrow className="fill-white h-20 w-20 rotate-180" />
          </div>
        </div>
      )}
    </>
  );
};
