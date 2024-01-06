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

export const openDtlContentAtom = atom(false);
export const dtlContentAtom = atom<any>(null);

export const useColumnDetail = () => {
  const { t } = useI18n("RptCallAnalysisByWaitTime_Column");

  const setOpen = useSetAtom(openDtlContentAtom);
  const setDtlContent = useSetAtom(dtlContentAtom);

  const handleOpen = (code: any) => {
    setDtlContent(code);
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
      dataField: "TotalHonorific", // Mô t ả
      caption: t("TotalHonorific"),
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
            onClick={() => handleOpen({ type: "Honorific", ...data })}
          >
            {data.TotalHonorific}/{data.TotalQtyStdHonorificNoRequire}
          </div>
        );
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TotalDenyWord", // Mô t ả
      caption: t("TotalDenyWord"),
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
            onClick={() => handleOpen({ type: "Deny", ...data })}
          >
            {data.TotalDenyWordFail}/{data.TotalDenyWord}
          </div>
        );
      },
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
