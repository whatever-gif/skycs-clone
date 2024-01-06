import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { TagBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import React, { memo, useCallback, useEffect, useState } from "react";
import { FlagTagAtom } from "../store";

export default memo(function TagboxCustom({
  data,
  formComponent,
  dataDefault,
  readOnly,
}: any) {
  const [datatag, setDataTag] = useState(data);
  const [dataTagnew, setDataTagNew] = useState<any>(undefined);
  const api = useClientgateApi();

  const onCustomItemCreating = (args: any) => {
    if (!args.text) {
      args.customItem = null;
      return;
    }
    const { component, text } = args;
    const currentItems = component.option("items");
    const newItem = {
      TagID: text.trim(),
      TagName: text.trim(),
      Slug: "",
    };
    const itemInDataSource = currentItems.find(
      (item: any) => item.TagName === newItem.TagName
    );
    if (itemInDataSource) {
      args.customItem = itemInDataSource;
    } else {
      setDataTagNew(newItem);
      setDataTag([newItem, ...datatag]);
      currentItems.push(newItem);
      component.option("items", currentItems);
      args.customItem = newItem;
    }
  };
  const { data: ListdataTagNew } = useQuery(["dataTagNew", dataTagnew], () =>
    api.Mst_Tag_Create({ ...dataTagnew, TagDesc: dataTagnew?.TagName })
  );

  const onKeyDown = (e: any) => {
    if (e.event.code === "Enter") {
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        keyCode: 13,
        which: 13,
      });
      const target = e.event.target;
      target.dispatchEvent(event);
    }
  };
  return (
    <TagBox
      readOnly={false}
      inputAttr={{ "aria-label": "Product" }}
      searchEnabled={true}
      defaultValue={dataDefault}
      items={datatag}
      displayExpr="TagName"
      valueExpr="TagName"
      acceptCustomValue={true}
      onCustomItemCreating={onCustomItemCreating}
      onKeyDown={onKeyDown}
      onValueChanged={(e) => {
        formComponent.updateData("Tags", e.value);
      }}
    />
  );
});
