import { ReactElement } from "react";

import LoaderIcon from "@icons/loader.svg";

export const Loader = ({
  isLoading,
  children,
}: {
  isLoading?: boolean;
  children: ReactElement;
}) =>
  isLoading ? (
    <div className="flex items-center justify-center h-full">
      <div className="h-15 w-15 animate animate-spin-slow text-purple-900">
        <LoaderIcon />
      </div>
    </div>
  ) : (
    children
  );
