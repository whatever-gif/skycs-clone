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
  const { t } = useI18n("Cpn_CampaignAgent-forms");
  const columns = inputColumns.map((c) => {
    return {
      ...c,
      visible: true,
    };
  });

  const basicInformationFirstColumn = columns.filter(
    (c) => c.groupKey === "BASIC_INFORMATION" && c.columnIndex === 1
  );
  const basicInformationSecondColumn = columns.filter(
    (c) => c.groupKey === "BASIC_INFORMATION" && c.columnIndex === 2
  );

  // const salesInformationFirstColumn = columns.filter(
  //   (c) => c.groupKey === "SALES_INFORMATION" && c.columnIndex === 1
  // );
  // const salesInformationSecondColumn = columns.filter(
  //   (c) => c.groupKey === "SALES_INFORMATION" && c.columnIndex === 2
  // );

  // const deliveryInformationFirstColumn = columns.filter(
  //   (c) => c.groupKey === "DELIVERY_INFORMATION" && c.columnIndex === 1
  // );
  // const deliveryInformationSecondColumn = columns.filter(
  //   (c) => c.groupKey === "DELIVERY_INFORMATION" && c.columnIndex === 2
  // );

  // const serviceWorkshopInformationFirstColumn = columns.filter(
  //   (c) => c.groupKey === "SERVICE_WORKSHOP_INFORMATION" && c.columnIndex === 1
  // );
  // const serviceWorkshopInformationSecondColumn = columns.filter(
  //   (c) => c.groupKey === "SERVICE_WORKSHOP_INFORMATION" && c.columnIndex === 2
  // );

  // const autoApprovalInformationFirstColumn = columns.filter(
  //   (c) => c.groupKey === "AUTO_APPROVAL_INFORMATION" && c.columnIndex === 1
  // );
  // const autoApprovalInformationSecondColumn = columns.filter(
  //   (c) => c.groupKey === "AUTO_APPROVAL_INFORMATION" && c.columnIndex === 2
  // );

  const formSettings: FormOptions = {
    colCount: 1,
    labelLocation: "left",
    items: [
      {
        itemType: "group",
        caption: t("BASIC_INFORMATION"),
        colCount: 2,
        cssClass: "collapsible form-group",
        items: zip(basicInformationFirstColumn, basicInformationSecondColumn),
      },
      // {
      //   itemType: "group",
      //   colCount: 2,
      //   cssClass: "collapsible form-group",
      //   caption: t("SALES_INFORMATION"),
      //   items: zip(salesInformationFirstColumn, salesInformationSecondColumn),
      // },
      // {
      //   itemType: "group",
      //   colCount: 2,
      //   cssClass: "collapsible form-group",
      //   caption: t("DELIVERY_INFORMATION"),
      //   items: zip(
      //     deliveryInformationFirstColumn,
      //     deliveryInformationSecondColumn
      //   ),
      // },
      // {
      //   itemType: "group",
      //   colCount: 2,
      //   cssClass: "collapsible form-group",
      //   caption: t("SERVICE_WORKSHOP_INFORMATION"),
      //   items: zip(
      //     serviceWorkshopInformationFirstColumn,
      //     serviceWorkshopInformationSecondColumn
      //   ),
      // },
      // {
      //   itemType: "group",
      //   colCount: 2,
      //   cssClass: "collapsible form-group",
      //   caption: t("AUTO_APPROVAL_INFORMATION"),
      //   items: zip(autoApprovalInformationFirstColumn, [
      //     autoApprovalInformationSecondColumn,
      //     { itemType: "empty" },
      //   ]),
      // },
    ],
  };
  return formSettings;
};
