import { NextPage } from "next";

import { Header } from "./Header";

export const Layout: NextPage<{ children: React.ReactElement }, React.ReactElement> = ({ children }: { children: React.ReactElement}): React.ReactElement => (
  <>
    <Header/>
    <div className="h-full pt-10 pb-5 px-5">
      {children}
    </div>
  </>
) 