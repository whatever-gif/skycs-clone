import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
import { LinkCell } from "@/packages/ui/link-cell";
import { ColumnOptions } from "@/types";
import { requiredType } from "@packages/common/Validation_Rules";
import { Mst_CustomerGroupData } from "@packages/types";
import { atom, useSetAtom } from "jotai";

interface useColumnProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const openDetailAtom = atom(false);
export const userCodeAtom = atom<any>(null);

export const useColumn = () => {
  const { t } = useI18n("RptCallAnalysisByContent_Column");

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
      dataField: "UserName", // Agent
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
      dataField: "ExtId", // Số máy lẻ
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
      dataField: "TotalCall", // Tổng số cuộc gọi
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
      dataField: "MinValue", // Giá trị tối thiểu Hz
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
      dataField: "MaxValue", // Giá trị tối đa Hz
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
      dataField: "QtyAllow", // Số lần được phép
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
      dataField: "TotalFail", // Số lượng cuộc gọi đáp ứng về tần số
      caption: t("TotalFail"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      cellRender: (e: any) => {
        return (
          <LinkCell
            onClick={() => handleOpen({ type: "Honorific", ...e })}
            value={e.displayValue}
          />
        );
        // return (
        //   <LinkCell onClick={() => handleOpen(e.displayValue)} value={"____"} />
        // );
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "FailPercent", // Tỉ lệ không đáp ứng
      caption: t("FailPercent"),
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
