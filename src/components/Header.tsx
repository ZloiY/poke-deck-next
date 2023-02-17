import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import LogoutIcon from "@icons/logout.svg";

type LoadingState = "Started" | "Finished" | "Hold";

export const Header = () => {
  const { data } = useSession();
  const router = useRouter();
  const [loadingState, setLoadingState] = useState<LoadingState>("Hold");

  useEffect(() => {
    const loadStarted = () => {
      setLoadingState("Started");
    };
    const loadCompleted = () => {
      setLoadingState("Finished");
    };

    router.events.on("routeChangeStart", loadStarted);
    router.events.on("routeChangeError", loadCompleted);
    router.events.on("routeChangeComplete", loadCompleted);
    return () => {
      router.events.off("routeChangeStart", loadStarted);
      router.events.off("routeChangeError", loadCompleted);
      router.events.off("routeChangeComplete", loadCompleted);
    };
  }, [router]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (loadingState == "Finished") {
      timeoutId = setTimeout(() => {
        setLoadingState("Hold");
      }, 500);
    }
    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [loadingState]);

  return (
    <div className="flex items-center justify-between bg-purple-900 py-5 px-6 text-4xl shadow-lg shadow-purple-700/75 sticky top-0 z-50">
      <div
        className={twMerge(
          "absolute h-[3px] left-0 top-0 bg-yellow-500 shadow-[0_0_15px_2px] shadow-yellow-300 transition-all",
          loadingState == "Hold" && "w-0",
          loadingState == "Started" && "w-1/3 duration-1000",
          loadingState == "Finished" && "w-full duration-500",
        )}
      ></div>
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
        <LogoutIcon
          onClick={() => signOut()}
          alt="logout"
          className="w-8 h-8 stroke-white hover:stroke-yellow-400 active:stroke-yellow-500 cursor-pointer"
        />
      </div>
    </div>
  );
};
