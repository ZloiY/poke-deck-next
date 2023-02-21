import Add from "@icons/add-inverse.svg";

import { BlankDeckCard } from "./BlankDeckCard";

export const AddDeckCard = ({ onClick }: { onClick?: () => void }) => (
  <BlankDeckCard onClick={onClick}>
    <div className="flex justify-center items-center w-full h-full">
      <div>
        <Add className="w-60 h-60" />
        <p className="font-coiny mt-4 text-2xl text-center">Create new deck</p>
      </div>
    </div>
  </BlankDeckCard>
);