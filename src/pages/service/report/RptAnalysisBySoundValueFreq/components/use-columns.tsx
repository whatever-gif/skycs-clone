import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
import { requiredType } from "@packages/common/Validation_Rules";
import { Mst_CustomerGroupData } from "@packages/types";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { atom, useSetAtom } from "jotai";

interface useColumnProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const openDetailAtom = atom(false);
export const userCodeAtom = atom<any>(null);

export const useColumn = () => {
  const { t } = useI18n("RptCallAnalysisBySoundValueFreq_Column");

  const setOpen = useSetAtom(openDetailAtom);
  const setUserCode = useSetAtom(userCodeAtom);

  const handleOpen = (code: any) => {
    setUserCode(code);
    setOpen(true);
  };

  const navigate = useNetworkNavigate();

  const handleOpenDetail = (value: any) => {};

  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "UserName", // Tên loại chiến dịch
      caption: t("UserName"),
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
      dataField: "ExtId", // Mô t ả
      caption: t("ExtId"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TotalCall", // Mô t ả
      caption: t("TotalCall"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "MinValue", // Mô t ả
      caption: t("MinValue"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "MaxValue", // Mô t ả
      caption: t("MaxValue"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyAllow", // Mô t ả
      caption: t("QtyAllow"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TotalFail", // Mô t ả
      caption: t("TotalFail"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data }) => {
        return (
          <div
            className="text-[#00703c] font-semibold underline cursor-pointer"
            onClick={() => handleOpen(data)}
          >
            {data.TotalFail}
          </div>
        );
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "FailPercent", // Mô t ả
      caption: t("FailPercent"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data }) => {
        return <>{data.FailPercent}%</>;
      },
    },
  ];

  return columns;
};
