import Add from "@icons/add-inverse.svg";

import { BlankCard } from "./BlankCard";

export const AddDeckCard = ({ onClick }: { onClick?: () => void }) => (
  <BlankCard className="transition-all border-2 border-transparent cursor-pointer text-white hover:text-yellow-500
  hover:shadow-none hover:border-yellow-500
  active:scale-90 active:border-transparent active:shadow-[0_0_30px_10px] active:shadow-yellow-500"
  onClick={onClick}>
    <div
      className="flex justify-center items-center w-full h-full"
    >
      <Add className="w-50 h-50" />
    </div>
  </BlankCard>
);
