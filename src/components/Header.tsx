import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import LogoutIcon from "@icons/logout.svg";

import { FlipButton } from "./FlipButton";
import { HighlightedLink } from "./HiglightedLink";
import { Refetch } from "./Modals";
import { PageLoader } from "./PageLoader";

export const Header = ({ showFlip }: { showFlip: boolean }) => {
  const { data } = useSession();
  const [signingOut, toggleSignOut] = useState(false);
  const router = useRouter();
  const {
    deckId: _,
    decks: __,
    ...query
  } = useMemo(() => router.query, [router.query]);

  const onSignOut = () => {
    toggleSignOut(true);
    signOut();
  }

  return (
    <div className="flex items-center justify-between bg-purple-900 py-5 px-6 text-4xl shadow-lg shadow-purple-700/75 sticky top-0 z-50">
      <Refetch
        isRefetching={signingOut}
       />
      <PageLoader />
      <div className="flex gap-10 items-center">
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
          Pókemons
        </HighlightedLink>
      </div>
      <div className="flex gap-4 items-center">
        {showFlip && <FlipButton />}
        <span>Hello, {data?.user?.name}!</span>
        <LogoutIcon
          onClick={onSignOut}
          alt="logout"
          className="w-8 h-8 stroke-white hover:stroke-yellow-400 active:stroke-yellow-500 cursor-pointer"
        />
      </div>
    </div>
  );
};
