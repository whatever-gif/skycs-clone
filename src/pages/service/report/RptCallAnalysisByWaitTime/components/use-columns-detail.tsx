import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
import { Icon } from "@/packages/ui/icons";
import { getCurrentUserTime } from "@/utils/time";
import { requiredType } from "@packages/common/Validation_Rules";
import { Mst_CustomerGroupData } from "@packages/types";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { atom, useSetAtom } from "jotai";

interface useColumnProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const openDetailAtom = atom(false);
export const userCodeAtom = atom(null);

export const useColumnDetail = () => {
  const { t } = useI18n("RptCallAnalysisByWaitTime_Column");

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
      dataField: "CallId", // Mô t ả
      caption: t("CallId"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "StartDTime", // Mô t ả
      caption: t("StartDTime"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data }: any) => {
        return getCurrentUserTime(data?.StartDTime);
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CustomerCodeSys", // Mô t ả
      caption: t("CustomerCodeSys"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CustomerName", // Mô t ả
      caption: t("CustomerName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "ToNumber", // Mô t ả
      caption: t("ToNumber"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "RecFilePathFull", // Mô t ả
      caption: t("RecFilePathFull"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data }) => {
        if (data.RecFilePathFull) {
          return (
            <Icon
              name="headphone"
              className="cursor-pointer"
              onClick={() => {
                window.open(data.RecFilePathFull);
              }}
            ></Icon>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "HoldTime", // Mô t ả
      caption: t("HoldTime"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TalkDTime", // Mô t ả
      caption: t("TalkDTime"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data }: any) => {
        return getCurrentUserTime(data?.TalkDTime);
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TalkTime", // Mô t ả
      caption: t("TalkTime"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CallType", // Mô t ả
      caption: t("CallType"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Json_Call_CallBizRef", // Mô t ả
      caption: t("Json_Call_CallBizRef"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      visible: false,
    },
  ];

  return columns;
};
