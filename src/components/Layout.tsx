import { NextPage } from "next";
import { useEffect } from "react";
import { setNewMessages } from "../hooks/useMessageBus";

import { Header } from "./Header";
import { NotificationsPopups } from "./NotificationPopup";

export const Layout: NextPage<
  { children: React.ReactElement; showFlip?: boolean },
  React.ReactElement
> = ({ children, showFlip = true }): React.ReactElement => {
  useEffect(() => {
    setNewMessages([]);
  }, []);
  return (
    <>
      <Header showFlip={showFlip} />
      <div className="pt-10 pb-5 px-5 font-fredoka flex-grow relative">
        <NotificationsPopups />
        {children}
      </div>
    </>
  );
};
