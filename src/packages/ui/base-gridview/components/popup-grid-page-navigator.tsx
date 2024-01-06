import { useAtomValue } from "jotai";
import { PageNavigator } from "@packages/ui/page-navigator";
import { popupGridStateAtom } from "@packages/ui/base-gridview/store/popup-grid-store";
import { Config } from "./PageStandardSize";
import { forwardRef } from "react";

interface PopupGridPageNavigatorProps {
  onPageChanged: (pageIndex: number) => void;
  config: Config;
}

export const PopupGridPageNavigator = forwardRef(
  ({ onPageChanged, config }: PopupGridPageNavigatorProps, ref: any) => {
    // const { pageIndex, pageSize, pageCount, totalCount } =
    //   useAtomValue(popupGridStateAtom);
    return (
      <PageNavigator
        itemCount={config.totalCount ?? 0}
        currentPage={config.pageIndex}
        onPageChanged={onPageChanged}
        pageSize={config.pageSize}
        pageCount={config.pageCount ?? 0}
      />
    );
  }
);
