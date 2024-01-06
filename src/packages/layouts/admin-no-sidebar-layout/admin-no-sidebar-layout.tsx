import { Outlet, useLocation } from "react-router-dom";
import { useCallback, useMemo, useRef } from "react";
import { useHeaderItems } from "@packages/hooks/useHeaderItems";
import Drawer from "devextreme-react/drawer";
import { useNetworkNavigate } from "@packages/hooks";
import { useScreenSize } from "@/utils/media-query";
import { useMenuPatch } from "@/utils/patches";
import { ItemClickEvent } from "devextreme/ui/tree_view";
import ScrollView from "devextreme-react/scroll-view";
import { Button, Template } from "devextreme-react";
import { Sidebar } from "@packages/ui/sidebar";
import Toolbar, { Item as ToolbarItem } from "devextreme-react/toolbar";
import { protectedRoutes } from "@/app-routes";

import { MenuBarItem, SidebarItem } from "@/types";
import { Header } from "@packages/ui/header";
import { useAtomValue, useSetAtom } from "jotai";
import { sidebarAtom } from "@packages/store";
import { useI18n } from "@/i18n/useI18n";
import { usePermissions } from "@/packages/contexts/permission";

import "./admin-no-sidebar-layout.scss";

export const AdminNoSidebarLayout = () => {
  const { t } = useI18n("Common");
  const { items, extraItems } = useHeaderItems();
  const navigate = useNetworkNavigate();
  const { isXSmall, isLarge } = useScreenSize();
  const [patchCssClass, onMenuReady] = useMenuPatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const location = useLocation();
  const isSidebarOpen = useAtomValue(sidebarAtom);
  const setSidebarOpen = useSetAtom(sidebarAtom);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const openSidebar = () => {
    setSidebarOpen(true);
  };
  const { hasMenuPermission } = usePermissions();
  const sidebarItems = useMemo(() => {
    const mainKey = location.pathname.split("/")[2];
    return protectedRoutes
      .filter(
        (route) =>
          route.key !== route.mainMenuKey &&
          route.mainMenuKey === mainKey &&
          !!route.subMenuTitle
      )
      .filter(
        (route) =>
          !route.permissionCode ||
          (route.permissionCode && hasMenuPermission(route.permissionCode))
      )
      .map(
        (route) =>
          ({
            text: route.subMenuTitle,
            path: route.path,
            key: route.key,
          } as SidebarItem)
      );
  }, [location]);

  const onNavigationChanged = useCallback(
    ({ itemData, event, node }: ItemClickEvent) => {
      if (!itemData?.path || node?.selected) {
        event?.preventDefault();
        return;
      }
      navigate(itemData.path);
      scrollViewRef.current?.instance.scrollTo(0);
      toggleSidebar();
    },
    [navigate, isLarge]
  );
  const temporaryOpenMenu = useCallback(() => {}, []);
  const navigateItem = useCallback((item: MenuBarItem) => {
    navigate(item.path);
    openSidebar();
  }, []);

  // memo to avoid re-rendering header
  const header = useMemo(() => {
    return (
      <Header
        logo={true}
        menuToggleEnabled={false}
        title={t("SkyCS")}
        items={items}
        extraItems={extraItems}
        onMenuItemClick={navigateItem}
      />
    );
  }, [t, navigateItem, items]);
  const sidebarElement = useMemo(() => {
    // console.log("sidebarItems ",sidebarItems)
    return (
      <Sidebar
        compactMode={!isSidebarOpen}
        selectedItemChanged={onNavigationChanged}
        openMenu={temporaryOpenMenu}
        onMenuReady={onMenuReady}
        items={sidebarItems}
      >
        <Toolbar id={"navigation-header"}>
          {!isXSmall && (
            <ToolbarItem location={"before"} cssClass={"menu-button"}>
              <Button icon="menu" stylingMode="text" onClick={toggleSidebar} />
            </ToolbarItem>
          )}
        </Toolbar>
      </Sidebar>
    );
  }, [sidebarItems, toggleSidebar]);
  return (
    <div className={"skycs w-full h-full"}>
      {header}
      <Drawer
        className={["main-sidebar", "drawer", patchCssClass].join(" ")}
        position={"before"}
        openedStateMode={isLarge ? "shrink" : "overlap"}
        revealMode={isXSmall ? "slide" : "expand"}
        minSize={0}
        maxSize={250}
        shading={false}
        opened={isSidebarOpen}
        template={"menu"}
      >
        <div className={"w-full h-full"}>
          <Outlet />
        </div>
        <Template name={"menu"}>{sidebarElement}</Template>
      </Drawer>
    </div>
  );
};
