import { memo } from "react";

import Add from "@icons/add-inverse.svg";

import { BlankDeckCard } from "./BlankDeckCard";

export const AddDeckCard = memo(({ onClick }: { onClick?: () => void }) => (
  <BlankDeckCard onClick={onClick}>
    <div className="flex justify-center items-center w-full h-full">
      <div role="button">
        <Add className="w-60 h-60" />
        <p className="font-coiny mt-4 text-2xl text-center">Create new deck</p>
      </div>
    </div>
  </BlankDeckCard>
));
