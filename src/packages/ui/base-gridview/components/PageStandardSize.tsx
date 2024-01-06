import { useI18n } from "@/i18n/useI18n";
import { PageSize } from "@packages/ui/page-size";
import { useAtomValue } from "jotai";
import {
  popupGridStandardStateAtom,
  popupGridStateAtom,
} from "../store/popup-grid-store";
import { pageSizeAtom } from "../store/normal-grid-store";

export interface Config {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
}

interface Props {
  onChangePageSize: any;
  // config: Config;
}

const PageStandardSizeComponent = ({ onChangePageSize }: Props) => {
  const { t } = useI18n("Common");
  const pageSizeValue = useAtomValue(pageSizeAtom);

  const { pageSize } = useAtomValue(popupGridStandardStateAtom);
  return (
    <PageSize
      title={t("Showing")}
      onChangePageSize={onChangePageSize}
      allowdPageSizes={pageSizeValue}
      showAllOption={true}
      showAllOptionText={t("ShowAll")}
      defaultPageSize={pageSize ?? 100}
    />
  );
};

export default PageStandardSizeComponent;
