import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, ReactNode, useCallback, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { Url } from "url";

import { a, config, useTransition } from "@react-spring/web";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { NextPage } from "next";
import { atom, useAtom } from "jotai";

type PokemonsLayoutTransition = 'Started' | 'Finished';

export const pokemonsLayoutAtom = atom<PokemonsLayoutTransition>('Finished');

const TabLink = ({
  href,
  children,
  navigateTo,
}: {
  href: string | Partial<Url>;
  navigateTo: (href: string | Partial<Url>) => void
  children: string;
}) => {
  const route = useRouter();

  const isSelected = useMemo(
    () =>
      typeof href == "string"
        ? href.includes(route.asPath) || route.asPath.includes(href)
        : href.pathname == route.pathname,
    [href, route.pathname],
  );

  return (
    <div
      className={twMerge(
        "px-10 py-3 rounded-2xl flex justify-center border-2 transition-colors border-purple-900 hover:text-yellow-500 hover:bg-purple-900 cursor-pointer",
        isSelected && "border-2 border-yellow-500 bg-purple-900",
      )}
      onClick={() => navigateTo(href)}
    >
      <p
        className={twMerge(
          "font-coiny text-2xl",
          isSelected && "text-yellow-500",
        )}
      >
        {children}
      </p>
    </div>
  );
};

const linksProps = [
  {
    href: "/pokemons/deck",
    children: "Selected Deck",
  },
  {
    href: "/pokemons/decks",
    children: "User Decks",
  },
];

export const PokemonsLayout: NextPage<{
  showSelectedDeck?: boolean;
  children: ReactNode;
}, ReactElement> = ({
  showSelectedDeck,
  children,
}) => {
  const router = useRouter();
  const [transitionState, setLayoutTransition] = useAtom(pokemonsLayoutAtom);
  const links = useMemo(
    () => (showSelectedDeck && transitionState == 'Finished' ? linksProps : [linksProps[1]!]),
    [showSelectedDeck, transitionState],
  );

  const pushRoute = useCallback((href: string | Partial<Url>) => {
    setLayoutTransition('Started');
    const timeoutId = setTimeout(() => {
      setLayoutTransition('Finished')
      router.push(href);
      clearTimeout(timeoutId);
    }, 500);
  }, [router]);

  const [parent] = useAutoAnimate();

  const transitions = useTransition(links, {
    trail: 200 / links.length,
    keys: (link) => link?.href,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
    config: config.stiff,
  });

  return (
    <div className="flex flex-col items-center">
      <div ref={parent} className={twMerge("grid grid-flow-col grid-cols-2 gap-5 max-w-xl")}>
        {transitions((style, linkProp) => (
          <a.div  style={style}>
            <TabLink key={linkProp.href} navigateTo={pushRoute} {...linkProp} />
          </a.div>
        ))}
      </div>
      {children}
    </div>
  );
};
