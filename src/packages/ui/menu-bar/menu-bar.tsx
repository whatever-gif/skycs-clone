import { Tabs } from "devextreme-react/tabs";
import { useLocation } from "react-router-dom";
import './menu-bar.scss';
import { logger } from "@packages/logger";
import { MenuBarProps, MenuBarItem } from "@/types";
import { useCallback, useMemo } from "react";
import { Button } from "devextreme-react";
import DropDownButton, { Item as DropDownButtonItem } from "devextreme-react/drop-down-button";

export const MenuBar = ({ items, onClick, extraItems }: MenuBarProps) => {
  const location = useLocation()
  const navigateItem = (e: any, item: MenuBarItem) => {
    if (item.path === "/") {
      e.cancel = true
    } else {
      onClick?.(item)
    }
  };

  const filterSelectedItem = useMemo(() => items.filter(item => {
    const mainKey = location.pathname.split('/')[2]
    return item.path.startsWith(`/${mainKey}`)
  }).map(item => item.path), [items, location])
  return (
    <div className="flex justify-center menu-bar-container">
      {!!items && items?.length > 0 &&
        <Tabs
          selectionMode='single'
          items={items}
          keyExpr={'path'}
          selectedItemKeys={filterSelectedItem}
          onItemClick={(e) => navigateItem(e, e.itemData as MenuBarItem)}
        >

        </Tabs>
      }
      {!!extraItems && extraItems?.length > 0 &&
        <DropDownButton
          showArrowIcon={false}
          className={'view-more'}
          keyExpr={"path"}
          displayExpr={"text"}
          wrapItemText={false}
          dropDownOptions={{
            width: 200,
            wrapperAttr: {
              class: 'menu-bar-drop-down'
            }
          }}
          onItemClick={(e) => { navigateItem(e, e.itemData as MenuBarItem) }}
          icon={"/images/icons/more.svg"}
          items={extraItems}
        >
        </DropDownButton>}
    </div >
  );
};