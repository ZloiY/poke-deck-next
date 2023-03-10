import { twMerge } from "tailwind-merge";

import Flip from "@icons/flip.svg";
import { atom, useAtom } from "jotai";

const flipState = atom<FlipState>('Preview');
export const getFlipState = atom((get) => get(flipState));

export const FlipButton = () => {
  const [state, setState] = useAtom(flipState);
  return (
    <Flip
      role="button"
      className={twMerge(
        "text-white transition-transform duration-200 hover:text-yellow-400 cursor-pointer right-0 z-50 lg:w-10 lg:h-10 w-16 h-16",
        state == 'Details' && "text-yellow-500 rotate-180",
      )}
      onClick={() => setState((state) => state == 'Preview' ? 'Details' : 'Preview')}
    />
  );
};
