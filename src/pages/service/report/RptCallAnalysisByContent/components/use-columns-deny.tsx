import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@packages/common/Validation_Rules";
import { Mst_CustomerGroupData } from "@packages/types";
import { atom } from "jotai";

interface useColumnProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const openDetailAtom = atom(false);
export const userCodeAtom = atom<any>(null);

export const useDenyColumn = () => {
  const { t } = useI18n("RptCallAnalysisByContent_DenyWord_Column");
  const { t: f } = useI18n("SvImprvWord");

  const columns: any = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Idx", // Tên loại chiến dịch
      caption: t("Idx"),
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "WordDesc", // Tên loại chiến dịch
      caption: t("WordDesc"),
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyStd", // Mô t ả
      caption: t("QtyStd"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyMathCount", // Mô t ả
      caption: t("QtyMathCount"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
  ];

  return columns;
};
