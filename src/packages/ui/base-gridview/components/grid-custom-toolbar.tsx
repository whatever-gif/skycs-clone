import Button from "devextreme-react/button";
import { ReactNode, forwardRef, memo } from "react";
import PermissionContainer from "@/components/PermissionContainer";
import { nanoid } from "nanoid";
import { useAtomValue } from "jotai";
import { loadingColumnAtom } from "../store/normal-grid-store";

export interface GridCustomerToolBarItem {
  text: string;
  customerText?: (ref: any) => string;
  onClick: any;
  shouldShow: any;
  widget?: string;
  customize?: (ref: any) => ReactNode;
  permissionCode?: string;
}

export const GridCustomToolbar = forwardRef(({ items }: any, ref: any) => {
  const loadingColumn = useAtomValue(loadingColumnAtom);
  if (!items || !items.length) return null;
  return (
    <div className="flex items-center">
      {items.map((item: GridCustomerToolBarItem, idx: number) => {
        if (item?.widget === "customize") {
          if (item.shouldShow(ref.current)) {
            return (
              (
                <div key={nanoid()}>
                  {item?.customize ? item.customize(ref.current) : <></>}
                </div>
              ) ?? <div key={nanoid()}></div>
            );
          } else {
            return null;
          }
        } else if (item?.widget === "dxTextBox") {
          return (
            <span className="font-bold px-2" key={nanoid()}>
              {item?.customerText?.(ref.current) ?? item.text}
            </span>
          );
        } else if (item?.permissionCode) {
          if (item?.permissionCode) {
            return (
              <PermissionContainer
                permission={item?.permissionCode}
                key={nanoid()}
                children={
                  <Button
                    text={item?.customerText?.(ref.current) ?? item.text}
                    onClick={(e) => {
                      item.onClick(e, ref.current);
                    }}
                    visible={item.shouldShow(ref.current)}
                  />
                }
              />
            );
          } else {
            return (
              <Button
                key={nanoid()}
                text={item?.customerText?.(ref.current) ?? item.text}
                onClick={(e) => {
                  item.onClick(e, ref.current);
                }}
                visible={item.shouldShow(ref.current)}
              />
            );
          }
        } else {
          return (
            <Button
              key={nanoid()}
              text={item?.customerText?.(ref.current) ?? item.text}
              onClick={(e) => {
                item.onClick(e, ref.current);
              }}
              visible={item.shouldShow(ref.current)}
            />
          );
        }
      })}
    </div>
  );
});
