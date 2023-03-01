import { NextPage } from "next";

import { Header } from "./Header";
import { NotificationsPopups } from "./NotificationPopup";

export const Layout: NextPage<{ children: React.ReactElement, showFlip?: boolean }, React.ReactElement> = ({ children, showFlip = true }): React.ReactElement => (
  <>
    <Header showFlip={showFlip} />
    <div className="pt-10 pb-5 px-5 flex-grow relative">
      <NotificationsPopups/>
      {children}
    </div>
  </>
) 