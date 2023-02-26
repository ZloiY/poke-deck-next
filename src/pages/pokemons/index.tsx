import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { Url } from "url";

import { a, config, useTransition } from "@react-spring/web";

import { Layout } from "../../components/Layout";
import SelectedDeck from "./deck/[deckId]";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    redirect: {
      destination: "/pokemons/decks",
    },
    props: {
      showSelectedDeck: !!context.query.deckId,
    },
  };
}

const TabLink = ({
  href,
  children,
}: {
  href: string | Partial<Url>;
  children: string;
}) => {
  const route = useRouter();

  const isSelected = useMemo(
    () =>
      typeof href == "string"
        ? route.asPath.includes(href)
        : href.pathname == route.pathname,
    [href, route.pathname],
  );

  return (
    <div
      className={twMerge(
        "px-10 py-3 rounded-2xl flex justify-center border-2 transition-colors border-purple-900 hover:text-yellow-500 hover:bg-purple-900 cursor-pointer",
        isSelected && "border-2 border-yellow-500 bg-purple-900",
      )}
    >
      <Link
        className={twMerge(
          "font-coiny text-2xl",
          isSelected && "text-yellow-500",
        )}
        href={href}
      >
        {children}
      </Link>
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
    children: "Selected Deck",
  },
];

const Pokemons = ({
  showSelectedDeck,
  children,
}: {
  showSelectedDeck?: boolean;
  children: ReactNode;
}) => {
  const links = useMemo(
    () => (showSelectedDeck ? linksProps : [linksProps[1]!]),
    [showSelectedDeck],
  );

  const transitions = useTransition(showSelectedDeck ? links : [...links], {
    trail: 200 / links.length,
    keys: (link) => link?.href,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    config: config.stiff,
  });

  return (
    <Layout showFlip={false}>
      <div className="flex flex-col items-center">
        <div className="grid grid-flow-col grid-cols-2 gap-5 max-w-xl">
          {transitions((style, linkProp) => 
          <a.div key={linkProp.href} style={style}>
            <TabLink {...linkProp} />
          </a.div>
          )}
        </div>
        {children}
      </div>
    </Layout>
  );
};

export default Pokemons;
