import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import LogoutIcon from "@icons/logout.svg";
import { useLoadingState } from "../hooks/useLoadingState";
import { HighlightedLink } from "./HiglightedLink";
import { FlipButton } from "./FlipButton";

export const Header = () => {
  const { data } = useSession();
  const loadingState = useLoadingState();

  return (
    <div className="flex items-center justify-between bg-purple-900 py-5 px-6 text-4xl shadow-lg shadow-purple-700/75 sticky top-0 z-50">
      <div
        className={twMerge(
          "absolute h-[3px] left-0 top-0 bg-yellow-500 shadow-[0_0_15px_2px] shadow-yellow-300 transition-all ",
          loadingState == "Hold" && "w-0",
          loadingState == "Started" && "w-1/3 duration-1000 ease-in",
          loadingState == "Finished" && "w-full duration-500 ease-out",
        )}
      ></div>
      <div className="flex gap-10 items-center">
        <HighlightedLink
          href="/home"
        >
          Home
        </HighlightedLink>
        <HighlightedLink
          href="/decks"
        >
          Decks
        </HighlightedLink>
        <HighlightedLink
          href="/pokemons"
        >
          Pókemons
        </HighlightedLink>
      </div>
      <div className="flex gap-4 items-center">
        <FlipButton/>
        <span>Hello, {data?.user?.name}!</span>
        <LogoutIcon
          onClick={() => signOut()}
          alt="logout"
          className="w-8 h-8 stroke-white hover:stroke-yellow-400 active:stroke-yellow-500 cursor-pointer"
        />
      </div>
    </div>
  );
};
