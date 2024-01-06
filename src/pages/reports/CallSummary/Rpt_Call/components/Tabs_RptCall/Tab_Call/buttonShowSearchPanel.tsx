import { searchPanelVisibleAtom } from "@/packages/layouts/content-searchpanel-layout";
import { Button } from "devextreme-react";
import { useSetAtom } from "jotai";
import React from "react";

const ButtonShowSearchPanel = () => {
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);

  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  return (
    <Button
      className="button_Search  mr-1"
      icon={"/images/icons/search.svg"}
      onClick={handleToggleSearchPanel}
    />
  );
};

export default ButtonShowSearchPanel;
