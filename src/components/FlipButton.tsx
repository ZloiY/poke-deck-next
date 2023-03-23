import { atom, useAtom } from "jotai";
import { twMerge } from "tailwind-merge";

import Flip from "@icons/flip.svg";

const flipState = atom<FlipState>("Preview");
export const getFlipState = atom((get) => get(flipState));

export const FlipButton = () => {
  const [state, setState] = useAtom(flipState);
  return (
    <Flip
      role="button"
      className={twMerge(
        "text-white transition-transform duration-200 hover:text-yellow-400 cursor-pointer right-0 z-50 lg:w-10 lg:h-10 min-[580px]:w-16 min-[580px]:h-16 w-12 h-12",
        state == "Details" && "text-yellow-500 rotate-180",
      )}
      onClick={() =>
        setState((state) => (state == "Preview" ? "Details" : "Preview"))
      }
    />
  );
};
