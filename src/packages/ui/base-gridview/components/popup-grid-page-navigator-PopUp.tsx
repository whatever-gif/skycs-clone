import { useAtomValue } from "jotai";
import { PageNavigator } from "@packages/ui/page-navigator";
import { popupGridStateAtom } from "@packages/ui/base-gridview/store/popup-grid-store";
import { Config } from "./PageStandardSize";
import { forwardRef } from "react";

interface PopupGridPageNavigatorProps {
  onPageChanged: (pageIndex: number) => void;
}

export const PopupGridPageNavigatorPopUp = forwardRef(
  ({ onPageChanged }: PopupGridPageNavigatorProps, ref: any) => {
    const { pageIndex, pageSize, pageCount, totalCount } =
      useAtomValue(popupGridStateAtom);
    return (
      <PageNavigator
        itemCount={totalCount ?? 0}
        currentPage={pageIndex}
        onPageChanged={onPageChanged}
        pageSize={pageSize}
        pageCount={pageCount ?? 0}
      />
    );
  }
);
