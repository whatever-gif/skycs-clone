import { useAtomValue } from "jotai";
import { PagerSummary } from "@packages/ui/pager-summary";
import { useI18n } from "@/i18n/useI18n";
import { Config } from "./PageStandardSize";

interface Props {
  config: Config;
}

export const PopupGridPageSummary = ({ config }: Props) => {
  const { t } = useI18n("Common");
  const summaryText = t("{0}-{1} in {2}");
  return (
    <PagerSummary
      summaryTemplate={summaryText}
      currentPage={config.pageIndex}
      pageSize={config.pageSize}
      totalCount={config.totalCount}
    />
  );
};
