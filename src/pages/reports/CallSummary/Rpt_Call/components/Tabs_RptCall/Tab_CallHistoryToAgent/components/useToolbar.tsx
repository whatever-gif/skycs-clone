import { searchPanelVisibleAtom } from "@/packages/layouts/content-searchpanel-layout";
import { useSetAtom } from "jotai";
import React from "react";

const UseToolbar = () => {
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };
  return [
    {
      location: "before",
      widget: "dxButton",
      options: {
        icon: "search",
        onClick: handleToggleSearchPanel,
      },
    },
  ];
};

export default UseToolbar;
