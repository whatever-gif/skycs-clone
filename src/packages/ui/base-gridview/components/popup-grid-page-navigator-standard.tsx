import { useAtomValue } from "jotai";
import { PageNavigator } from "@packages/ui/page-navigator";
import {
  popupGridStandardStateAtom,
  popupGridStateAtom,
} from "@packages/ui/base-gridview/store/popup-grid-store";
import { Config } from "./PageStandardSize";

interface PopupGridPageNavigatorProps {
  onPageChanged: (pageIndex: number) => void;
}

export const PopupGridStandardPageNavigator = ({
  onPageChanged,
}: PopupGridPageNavigatorProps) => {
  const { pageIndex, pageSize, pageCount, totalCount } = useAtomValue(
    popupGridStandardStateAtom
  );
  return (
    <PageNavigator
      itemCount={totalCount ?? 0}
      currentPage={pageIndex}
      onPageChanged={onPageChanged}
      pageSize={pageSize}
      pageCount={pageCount ?? 0}
    />
  );
};
