import { ReactElement } from "react";

import Loader from "@icons/loader.svg";
import { twMerge } from "tailwind-merge";

export const BlankCard = ({
  isLoading = false,
  className,
  onClick,
  children,
}: Partial<{ isLoading: boolean; className?: string; onClick?: () => void; children: ReactElement }>) => (
  <div
    className={twMerge(`
    flex items-center justify-center
    relative
    rounded-xl
    bg-purple-900
    h-[500px] min-w-[300px] max-w-xs
    p-4
    text-white
    hover:shadow-[0_0_15px_4px] hover:shadow-orange-500`, className)}
    onClick={onClick}
  >
    {" "}
    {isLoading ? (
      <div className="animate-spin-slow h-15 w-15">
        <Loader />
      </div>
    ) : (
      children
    )}
  </div>
);
