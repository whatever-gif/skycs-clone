import { useI18n } from "@/i18n/useI18n";
import { ColumnOptions } from "@/packages/ui/base-gridview";
import { FormOptions } from "@/types";
import { zip } from "@packages/common";

interface UseFormSettingsProps {
  columns: ColumnOptions[];
}

export const useFormSettings = ({
  columns: inputColumns,
}: UseFormSettingsProps) => {
  const { t } = useI18n("Mst_PaymentTermController-form");

  const basicInformationFirstColumn = inputColumns.filter(
    (c) => c.groupKey === "BASIC_INFORMATION" && c.columnIndex === 1
  );
  const basicInformationSecondColumn = inputColumns.filter(
    (c) => c.groupKey === "BASIC_INFORMATION" && c.columnIndex === 2
  );

  const formSettings: FormOptions = {
    colCount: 2,
    labelLocation: "left",
    items: [
      {
        itemType: "group",
        caption: t(""),
        colSpan: 1,
        cssClass: "collapsible",
        items: basicInformationFirstColumn,
      },
      {
        itemType: "group",
        caption: t(""),
        colSpan: 1,
        cssClass: "collapsible",
        items: basicInformationSecondColumn,
      },
    ],
  };
  return formSettings;
};
