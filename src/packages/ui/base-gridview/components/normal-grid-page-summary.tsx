import {useAtomValue} from "jotai";
import {gridStateAtom} from "@packages/ui/base-gridview/store/normal-grid-store";
import {PagerSummary} from "@packages/ui/pager-summary";
import {useI18n} from "@/i18n/useI18n";

export const NormalGridPageSummary = () => {
  const {t} = useI18n("Common")
  const {pageSize, pageIndex, totalCount} = useAtomValue(gridStateAtom)
  const summaryText = t("{0}-{1} in {2}")
  return (
    <PagerSummary
      summaryTemplate={summaryText}
      currentPage={pageIndex}
      pageSize={pageSize}
      totalCount={totalCount}
    />
  );
};
