import { ColumnOptions } from "@packages/ui/base-gridview";
import { Button } from "devextreme-react";
import React from "react";
import { Icon } from "@packages/ui/icons";

interface SelectedColumnProps {
  onClick: () => void;
  item: ColumnOptions;
}
export function SelectedColumn({ item, onClick }: SelectedColumnProps) {
  return (
    <div className={"flex justify-end items-center"}>
      <Button
        stylingMode={"text"}
        className={"ml-auto icon-remove mr-3"}
        onClick={onClick}
      >
        <Icon
          style={{ height: "10px", width: "10px" }}
          name={"remove"}
          className="icon-remove"
          color={"#FF0000"}
          size={10}
        />
      </Button>
      {item.caption}
    </div>
  );
}
