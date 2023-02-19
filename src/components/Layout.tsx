import { NextPage } from "next";

import { Header } from "./Header";

export const Layout: NextPage<{ children: React.ReactElement, showFlip?: boolean }, React.ReactElement> = ({ children, showFlip = true }: { children: React.ReactElement, showFlip?: boolean }): React.ReactElement => (
  <>
    <Header showFlip={showFlip} />
    <div className="pt-10 pb-5 px-5 flex-grow">
      {children}
    </div>
  </>
) 