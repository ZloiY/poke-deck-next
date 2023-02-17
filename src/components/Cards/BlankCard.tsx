import { ReactElement } from "react";

import Loader from "@icons/loader.svg";

export const BlankCard = ({
  isLoading = false,
  children,
}: Partial<{ isLoading: boolean; children: ReactElement }>) => (
  <div
    className="
    flex items-center justify-center
    relative
    rounded-xl
    bg-purple-900
    h-[500px] min-w-[300px] max-w-xs
    p-4
    text-white
    hover:shadow-[0_0_15px_4px] hover:shadow-orange-500"
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
