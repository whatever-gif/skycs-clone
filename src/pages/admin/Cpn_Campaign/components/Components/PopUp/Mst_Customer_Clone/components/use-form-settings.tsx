import { useI18n } from "@/i18n/useI18n";
import { Mst_CarModel, Mst_Dealer } from "@/packages/types";
import { ColumnOptions } from "@/packages/ui/base-gridview";
import { FormOptions } from "@/types";

interface UseFormSettingsProps {
  columns: ColumnOptions[];
  listDealer?: Mst_Dealer[];
  listModel?: Mst_CarModel[];
  listSpec?: any[];
}

export const useFormSettings = ({
  columns: inputColumns,
  listDealer,
  listModel,
  listSpec,
}: UseFormSettingsProps) => {
  const { t } = useI18n("Mst_Transporter");
  const columns = inputColumns.map((c) => {
    if (c.dataField === "DealerCode") {
      return {
        ...c,
        visible: true,
        editorOptions: {
          displayExpr: "DealerCode",
          valueExpr: "DealerCode",
          searchEnabled: true,
          validationMessageMode: "always",
          dataSource: listDealer ?? [],
        },
      };
    }
    if (c.dataField === "md_DealerName") {
      return {
        ...c,
        visible: true,
        editorOptions: {
          displayExpr: "DealerName",
          valueExpr: "DealerCode",
          searchEnabled: true,
          validationMessageMode: "always",
          dataSource: listDealer ?? [],
        },
      };
    }
    if (["ModelPromotion", "ModelCondition"].includes(c.dataField)) {
      return {
        ...c,
        visible: true,
        editorOptions: {
          displayExpr: "ModelCode",
          valueExpr: "ModelCode",
          searchEnabled: true,
          validationMessageMode: "always",
          dataSource: listModel ?? [],
        },
      };
    }
    if (
      ["mcm1_ModelNameCondition", "mcm2_ModelNamePromotion"].includes(
        c.dataField
      )
    ) {
      return {
        ...c,
        visible: true,
        editorOptions: {
          displayExpr: "ModelName",
          valueExpr: "ModelCode",
          dataSource: listModel ?? [],
        },
      };
    }
    if (
      [
        "mcs1_SpecDescriptionCondition",
        "mcs2_SpecDescriptionPromotion",
      ].includes(c.dataField)
    ) {
      return {
        ...c,
        visible: true,
        editorOptions: {
          displayExpr: "SpecDescription",
          valueExpr: "SpecCode",
          searchEnabled: true,
          validationMessageMode: "always",
          dataSource: listSpec ?? [],
        },
      };
    } else {
      return {
        ...c,
        visible: true,
      };
    }
  });

  const listInfo = columns.filter((c) => c.groupKey === "INFORMATION");
  const listInfoLow = columns.filter((c) => c.groupKey === "INFORMATION LOW");

  const formSettings: FormOptions = {
    colCount: 1,
    labelLocation: "left",
    items: [
      {
        itemType: "group",
        disableCollapsible: true,
        caption: t("Information"),
        colCount: 2,
        cssClass: "collapsible form-group",
        items: listInfo,
      },
      {
        itemType: "group",
        disableCollapsible: true,
        caption: t(""),
        colCount: 2,
        cssClass: "collapsible form-group",
        items: listInfoLow,
      },
    ],
  };
  return formSettings;
};
