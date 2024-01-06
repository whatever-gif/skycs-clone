import Button from "devextreme-react/button";
import React from "react";
import {sidebarAtom} from "@packages/store";
import {useAtomValue, useSetAtom} from "jotai";

import './toggle-sidebar-button.scss'
export const ToggleSidebarButton = () => {
  const isOpen = useAtomValue(sidebarAtom)
  const setSidebarOpen = useSetAtom(sidebarAtom)
  const toggleSidebar = () => {
    setSidebarOpen(true)
  }
  return (
    <Button icon={'menu'} visible={!isOpen} className={'toggle-sidebar'} stylingMode={'text'} onClick={toggleSidebar} ></Button>
  )
}