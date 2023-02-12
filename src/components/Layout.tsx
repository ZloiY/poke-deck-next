import { NextPage } from "next";

import { Header } from "./Header";

export const Layout: NextPage<{ children: React.ReactElement }, React.ReactElement> = ({ children }: { children: React.ReactElement}): React.ReactElement => (
  <>
    <Header/>
    {children}
  </>
) 