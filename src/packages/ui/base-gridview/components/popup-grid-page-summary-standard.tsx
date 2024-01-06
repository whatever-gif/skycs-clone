import { useAtomValue } from "jotai";
import { PagerSummary } from "@packages/ui/pager-summary";
import { useI18n } from "@/i18n/useI18n";
import {
  popupGridStandardStateAtom,
  popupGridStateAtom,
} from "@packages/ui/base-gridview/store/popup-grid-store";
import { Config } from "./PageStandardSize";

export const PopupGridStandardPageSummary = () => {
  const { t } = useI18n("Common");
  const { pageSize, pageIndex, totalCount } = useAtomValue(
    popupGridStandardStateAtom
  );
  const summaryText = t("{0}-{1} in {2}");
  return (
    <PagerSummary
      summaryTemplate={summaryText}
      currentPage={pageIndex}
      pageSize={pageSize}
      totalCount={totalCount}
    />
  );
};
