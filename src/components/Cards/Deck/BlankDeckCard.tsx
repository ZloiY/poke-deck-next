import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { BlankCard } from "../BlankCard";

export const BlankDeckCard = ({
  onClick,
  children,
  notResponsive = false,
}: {
  onClick?: () => void;
  children?: ReactNode;
  notResponsive?: boolean;
}) => (
  <BlankCard
    className={twMerge(
      `transition-all border-2 border-transparent cursor-pointer text-white hover:text-yellow-500
  hover:shadow-none hover:border-yellow-500
  active:scale-90 active:border-transparent active:shadow-[0_0_30px_10px] active:shadow-yellow-500`,
      notResponsive && "pointer-events-none select-none",
    )}
    onClick={onClick}
  >
    {children}
  </BlankCard>
);
