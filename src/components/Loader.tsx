import { ReactElement } from "react";

import LoaderIcon from "@icons/loader.svg";
import { twMerge } from "tailwind-merge";

export const Loader = ({
  isLoading,
  children,
  className
}: {
  isLoading?: boolean;
  children?: ReactElement;
  className?: string;
}) =>
  isLoading ? (
    <div className="flex items-center justify-center h-full">
      <div className={twMerge("h-15 w-15 animate animate-spin-slow text-purple-900", className)}>
        <LoaderIcon />
      </div>
    </div>
  ) : (
    children ?? null
  );
