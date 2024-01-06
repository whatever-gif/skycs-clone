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
export const userCodeAtom = atom(null);

export const useColumn = () => {
  const { t } = useI18n("RptCallAnalysisByCallTime_Column");

  const setOpen = useSetAtom(openDetailAtom);
  const setUserCode = useSetAtom(userCodeAtom);

  const handleOpen = (code: any) => {
    setUserCode(code);
    setOpen(true);
  };

  const navigate = useNetworkNavigate();

  const handleOpenDetail = (value: any) => {
    navigate(`/service/ServiceImprovement/${value}`);
  };

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
      // cellRender: ({ data, rowIndex, value }) => {
      //   return (
      //     <div
      //       className="cursor-pointer text-[#00703c]"
      //       onClick={() => handleOpenDetail(data.SvImprvCode)}
      //     >
      //       {data.SvImprvCode}
      //     </div>
      //   );
      // },
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
      dataField: "TimeMinValue", // Mô t ả
      caption: t("TimeMinValue"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TimeMaxValue", // Mô t ả
      caption: t("TimeMaxValue"),
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
            onClick={() => handleOpen(data.UserCode)}
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
