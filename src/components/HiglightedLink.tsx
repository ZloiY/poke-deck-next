import Link from "next/link";
import { useRouter } from "next/router"
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Url } from "url";

export const HighlightedLink = ({ href, children }: { href: string | Partial<Url>, children: string }) => {
  const route = useRouter();

  return <Link
  className={twMerge("font-modak hover:text-yellow-400", (route.pathname == href || route.asPath.includes((href as Url).pathname ?? '')) && "text-yellow-500")}
  href={href}>
    {children}
  </Link>
}