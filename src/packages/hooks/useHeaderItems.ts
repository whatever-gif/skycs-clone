import { useI18n } from "@/i18n/useI18n";
import { MenuBarItem } from "@/types";
import { useAuth } from "@packages/contexts/auth";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { usePermissions } from "../contexts/permission";

export const useHeaderItems = () => {
  const { t } = useI18n("Common");
  const {
    auth: { networkId },
  } = useAuth();
  const { hasMenuPermission } = usePermissions();
  const { pathname } = useLocation();
  const menuBarItems = useMemo<{
    mainItems: MenuBarItem[];
    extraItems: MenuBarItem[];
  }>(() => {
    let mainItems: MenuBarItem[] = [
      {
        text: t("Customer"),
        path: "/customer",
        permissionCode: "MNU_CUSTOMER",
      },
      {
        text: t("Campaign"),
        path: "/campaign",
        permissionCode: "MNU_CAMPAIGN",
      },
      {
        text: t("eTicket"),
        path: `/eticket/eticket_manager`,
        permissionCode: "MNU_ETICKET",
      },
      {
        text: t("Monitor"),
        path: `/monitor`,
        permissionCode: "MNU_GIAMSAT",
      },
      {
        text: t("KnowledgeBase"),
        path: `/search/SearchInformation`,
        permissionCode: "MNU_SEARCH_INFORMATION",
      },
      {
        text: t("Report"),
        path: "/report",
        permissionCode: "MNU_REPORT",
      },
      {
        text: t("Admin"),
        path: `/admin`,
        permissionCode: "MNU_ADMIN",
      },
      {
        text: t("Service"),
        path: `/service`,
        permissionCode: "MENU_SERVICE_IMPROVEMENT",
      },
    ].filter(
      (item) =>
        item.permissionCode === "" ||
        (item.permissionCode && hasMenuPermission(item.permissionCode))
    );
    let extraItems: MenuBarItem[] = [];
    if (mainItems.length > 5) {
      extraItems = mainItems.slice(5);
      mainItems = mainItems.slice(0, 5);
    }

    const selected = extraItems.find((item) =>
      pathname.startsWith(`/${networkId}${item.path}`)
    );

    // if selected item is extra item.
    if (!selected) {
      return {
        mainItems: mainItems.concat(extraItems.slice(0, 1)),
        extraItems: extraItems.slice(1),
      };
    } else {
      return {
        mainItems: mainItems.concat([selected]),
        extraItems: extraItems.filter((item) => item.path !== selected.path),
      };
    }
  }, [t, pathname]);

  return { items: menuBarItems.mainItems, extraItems: menuBarItems.extraItems };
};
