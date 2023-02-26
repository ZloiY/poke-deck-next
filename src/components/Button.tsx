import { type ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

import Loader from "@icons/loader.svg"

export const Button = ({className, isLoading, ...props}: ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean}) => {
  return (
    <button className={twMerge(`rounded-sm bg-blue-500 py-1 px-2 text-lg text-white cursor-pointer
      hover:shadow-[0_0_15px_4px] hover:shadow-zinc-400/50 hover:bg-yellow-500 active:bg-yellow-600 active:shadow-zinc-500/50
      disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:shadow-none disabled:cursor-auto disabled:text-gray-400`
      , className)} {...props}>
      {isLoading ? <div className="animate-spin-slow contrast-100 h-7"><Loader/></div> : props.children}
    </button>
  );
};
