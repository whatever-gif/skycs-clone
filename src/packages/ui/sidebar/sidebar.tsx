import React, { useEffect, useRef, useCallback, useMemo } from "react";
import TreeView from "devextreme-react/tree-view";
import { useScreenSize } from "@/utils/media-query";
import "src/packages/ui/sidebar/sidebar.scss";

import * as events from "devextreme/events";
import dxTreeView, { ItemClickEvent } from "devextreme/ui/tree_view";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/i18n/useI18n";
import ScrollView from "devextreme-react/scroll-view";
import { useAuth } from "@packages/contexts/auth";
import { ColumnChooserSelection } from "devextreme-react/data-grid";

export interface SidebarProps {
  selectedItemChanged: (e: ItemClickEvent) => void;
  openMenu: (e: React.PointerEvent) => void;
  compactMode: boolean;
  onMenuReady: (e: events.EventInfo<dxTreeView>) => void;
  items: any[];
}
export function Sidebar(props: React.PropsWithChildren<SidebarProps>) {
  const {
    children,
    selectedItemChanged,
    openMenu,
    compactMode,
    onMenuReady,
    items,
  } = props;

  const {
    auth: { networkId },
  } = useAuth();
  const { t } = useI18n("MENU");
  const { pathname: currentPath } = useLocation();

  const { isLarge } = useScreenSize();
  function normalizePath() {
    return items
      .filter((item) => !item.isHidden)
      .map((item) => ({
        ...item,
        text: t(item.text),
        expanded: isLarge,
        path: item.path && !/^\//.test(item.path) ? `/${item.path}` : item.path,
        children: item.children
          ?.filter((subItem: any) => !subItem.isHidden)
          .map((subItem: any) => ({
            ...subItem,
            text: t(subItem.text),
            path: subItem.subMenuTitle
              ? `${item.path}/${subItem.path}`
              : `/${subItem.path}`,
          })),
      }));
  }
  const treeItems = useMemo(normalizePath, [items]);

  const treeViewRef = useRef<TreeView>(null);
  const wrapperRef = useRef<HTMLDivElement>();
  const getWrapperRef = useCallback(
    (element: HTMLDivElement) => {
      const prevElement = wrapperRef.current;
      if (prevElement) {
        events.off(prevElement, "dxclick");
      }

      wrapperRef.current = element;
      events.on(element, "dxclick", (e: React.PointerEvent) => {
        openMenu(e);
      });
    },
    [openMenu]
  );

  useEffect(() => {
    const treeView = treeViewRef.current && treeViewRef.current.instance;
    if (!treeView) {
      return;
    }
    if (currentPath !== undefined) {
      //treeView.collapseAll();
      const cleanedPath = currentPath.replace(`/${networkId}`, "");
      treeView.selectItem(cleanedPath);

      var selectedParents = treeView.getSelectedNodes().map(function (node) {
        return node.parent;
      });

      var selectedParent =
        selectedParents.length > 0 ? selectedParents[0]?.itemData : null;

      customerTreeItems.forEach((item) => {
        if (selectedParent && item.key == selectedParent.key)
          treeView.expandItem(item);
        else treeView.collapseItem(item);
      });
    }

    if (compactMode) {
      treeView.collapseAll();
    }
  }, [currentPath, compactMode, items]);

  const customerTreeItems = treeItems.map((item) => {
    if (item.children) {
      return {
        ...item,
        text: t(item.text),
        children: item.children.map((subItem: any) => {
          return {
            ...subItem,
            text: t(subItem.text),
            subMenuTitle: t(subItem.subMenuTitle),
          };
        }),
      };
    }
    return {
      ...item,
      text: t(item.text),
    };
  });

  console.log("customerTreeItems ",customerTreeItems)

  return (
    <div
      className={"dx-swatch-additional side-navigation-menu"}
      ref={getWrapperRef}
    >
      {children}
      <div className={"menu-container pl-2"}>
        <ScrollView className={"pb-4"} showScrollbar={"always"}>
          <TreeView
            className={"pb-4 mb-6 menu-list"}
            visible={!compactMode}
            ref={treeViewRef}
            items={customerTreeItems}
            keyExpr={"path"}
            selectionMode={"single"}
            focusStateEnabled={false}
            itemsExpr={"children"}
            expandEvent={"click"}
            onItemClick={selectedItemChanged}
            onContentReady={onMenuReady}
            expandAllEnabled={false}
          />
        </ScrollView>
      </div>
    </div>
  );
}
