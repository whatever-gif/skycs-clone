import { useAtomValue } from "jotai";
import { PagerSummary } from "@packages/ui/pager-summary";
import { useI18n } from "@/i18n/useI18n";
import { popupGridStateAtom } from "../store/popup-grid-store";

export const PopUpGridPageSummary = () => {
  const { t } = useI18n("Common");
  const summaryText = t("{0}-{1} in {2}");
  const { pageSize, pageIndex, totalCount } = useAtomValue(popupGridStateAtom);
  return (
    <PagerSummary
      summaryTemplate={summaryText}
      currentPage={pageIndex}
      pageSize={pageSize}
      totalCount={totalCount}
    />
  );
};
