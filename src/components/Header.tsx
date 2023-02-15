import { signOut, useSession } from "next-auth/react";
import LogoutIcon from "@icons/logout.svg";
import Link from "next/link";

export const Header = () => {
  const { data } = useSession();

  return (
    <div className="flex items-center justify-between bg-purple-900 py-5 px-6 text-4xl shadow-lg shadow-purple-700/75">
      <div className="flex gap-10 items-center">
        <Link
          href="/home"
          className="font-modak hover:text-yellow-400 active:text-yellow-500"
        >
          Home
        </Link>
        <Link
          href="/decks"
          className="font-modak hover:text-yellow-400 active:text-yellow-500"
        >
          Decks
        </Link>
        <Link
          href="/pokemons"
          className="font-modak hover:text-yellow-400 active:text-yellow-500"
        >
          Pókemons
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        <span>Hello, {data?.user?.name}!</span>
        <LogoutIcon onClick={() => signOut()} alt="logout" className="w-8 h-8 stroke-white hover:stroke-yellow-400 active:stroke-yellow-500 cursor-pointer" />
      </div>
    </div>
  );
};
