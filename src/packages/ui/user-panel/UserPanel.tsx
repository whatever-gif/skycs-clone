import React, { useMemo } from "react";
import ContextMenu, { Position } from "devextreme-react/context-menu";
import List from "devextreme-react/list";
import type { UserPanelProps } from "@/types";
import { useAuthService } from "@packages/services/auth-services";
import { useAuth } from "@packages/contexts/auth";
import { useNetworkNavigate } from "@packages/hooks";

import "./UserPanel.scss";
import { useAtom, useSetAtom } from "jotai";
import { PopupProfileAtom, dataIMGAtom, fileAtom } from "./store";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";

export function UserPanel({ menuMode }: UserPanelProps) {
  const {
    auth: { currentUser },
  } = useAuth();

  const setDataImg = useSetAtom(dataIMGAtom);
  const navigate = useNetworkNavigate();
  const { signOut } = useAuthService();
  const setShowPopup = useSetAtom(PopupProfileAtom);
  const [file, setFile] = useAtom(fileAtom);
  const api = useClientgateApi();
  const { data: CurrentUser } = useQuery(["CurrentUser"], () =>
    api.GetForCurrentUser()
  );

  function navigateToProfile() {
    // navigate("/user/profile");

    setDataImg(CurrentUser?.Data?.Sys_User.Avatar);
    setFile("");
    setShowPopup(true);
  }
  const menuItems = useMemo(
    () => [
      {
        text: "Profile",
        icon: "user",
        onClick: navigateToProfile,
      },
      {
        text: "Logout",
        icon: "runner",
        onClick: signOut,
      },
    ],
    [signOut]
  );

  return (
    <div className={"user-panel"}>
      <div className={"user-info"}>
        <div className={"image-container"}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              backgroundImage: `url(${
                CurrentUser?.Data?.Sys_User.Avatar !== null
                  ? CurrentUser?.Data?.Sys_User.Avatar
                  : "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180"
              })`,
              backgroundSize: "cover",
            }}
            className={"user-image"}
          />
        </div>
      </div>

      {menuMode === "context" && (
        <ContextMenu
          items={menuItems}
          target={".user-button"}
          showEvent={"dxclick"}
          cssClass={"user-menu"}
        >
          <Position my={"top center"} at={"bottom center"} />
        </ContextMenu>
      )}
      {menuMode === "list" && (
        <List className={"dx-toolbar-menu-action"} items={menuItems} />
      )}
    </div>
  );
}
