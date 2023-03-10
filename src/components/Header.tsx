import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import LogoutIcon from "@icons/logout.svg";
import BurgerMenu from "@icons/menu-burger.svg";

import { FlipButton } from "./FlipButton";
import { HighlightedLink } from "./HiglightedLink";
import { Refetch } from "./Modals";
import { PageLoader } from "./PageLoader";
import { twMerge } from "tailwind-merge";

export const Header = ({ showFlip }: { showFlip: boolean }) => {
  const { data, status } = useSession();
  const [signingOut, toggleSignOut] = useState(false);
  const router = useRouter();
  const {
    deckId: _,
    decks: __,
    ...query
  } = useMemo(() => router.query, [router.query]);

  const [showNavMenu, toggleNavMenu] = useState(false);

  const onSignOut = () => {
    toggleSignOut(true);
    signOut();
  }

  return (
    <div className={twMerge("flex items-center justify-between bg-purple-900 py-5 px-6 text-4xl shadow-lg shadow-purple-700/75 sticky top-0 z-50",
    showNavMenu && "relative")}>
      <Refetch
        isRefetching={signingOut}
       />
      <PageLoader />
      {status == "authenticated" && <>
      <div role="button" className="text-white lg:hidden cursor-pointer
        hover:text-yellow-400 active:text-yellow-500 active:scale-90"
        onClick={() => toggleNavMenu(true)}>
          <BurgerMenu className="min-[580px]:w-20 min-[580px]:h-20 h-14 w-14" />
      </div>
      <div className={twMerge("gap-10 items-center lg:flex hidden",
        showNavMenu && "absolute top-0 left-0 h-[100vh] w-[100vw] flex flex-col justify-center bg-purple-900 z-[100]")}
        onClick={() => toggleNavMenu(false)}>
          <HighlightedLink
            href={{
              pathname: "/home",
            }}
          >
            Home
          </HighlightedLink>
          <HighlightedLink
            href={{
              pathname: "/decks",
            }}
          >
            Decks
          </HighlightedLink>
          <HighlightedLink
            href={{
              pathname: "/pokemons",
            }}
          >
            P??kemons
          </HighlightedLink>
      </div>
      </>}
      {status == "authenticated" && <div className="flex gap-4 items-center">
        {showFlip && <FlipButton/>}
        <span className="min-[580px]:text-6xl lg:text-4xl text-2xl">Hello, {data?.user?.name}!</span>
        <LogoutIcon
          role="button"
          onClick={onSignOut}
          alt="logout"
          className="lg:w-8 lg:h-8 min-[580px]:w-14 min-[580px]:h-14 w-10 h-10 stroke-white hover:stroke-yellow-400 active:stroke-yellow-500 cursor-pointer"
        />
      </div>}
      {status == 'unauthenticated' && <HighlightedLink href={{ pathname: "/login" }}>Sign In</HighlightedLink>}
    </div>
  );
};
