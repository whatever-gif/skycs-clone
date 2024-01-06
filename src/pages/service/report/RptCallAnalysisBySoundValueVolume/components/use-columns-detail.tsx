import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
import { Icon } from "@/packages/ui/icons";
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
      dataField: "CallId", // Mã cuộc gọi
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
      dataField: "StartDTime", // Thời điểm gọi
      caption: t("StartDTime"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CustomerCodeSys", // Mã Khách hàng
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
      dataField: "CustomerName", // Tên Khách hàng
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
      dataField: "ToNumber", // Số điện thoại khách hàng
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
      dataField: "RecFilePathFull", // File ghi âm
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
      dataField: "BizType", // Nghiệp vụ liên quan
      caption: t("BizType"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "BizRefCode", // Mã nghiệp vụ liên quan
      caption: t("BizRefCode"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    // {
    //   groupKey: "BASIC_INFORMATION",
    //   dataField: "Json_Call_CallBizRef", // Mô t ả
    //   caption: t("Json_Call_CallBizRef"),
    //   editorType: "dxTextBox",
    //   editorOptions: {
    //     readOnly: false,
    //     placeholder: t("Input"),
    //   },
    //   columnIndex: 1,
    //   visible: false,
    // },
  ];

  return columns;
};
