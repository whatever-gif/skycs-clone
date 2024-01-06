import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
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

  const columns: any = [
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
      dataField: "TotalCallAnalysis", // Mô t ả
      caption: t("TotalCallAnalysis"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      caption: t("HonorificWord"),
      editorType: "dxTextBox",
      alignment: "center",
      columns: [
        {
          dataField: "TotalHonorificFail", // Mô t ả
          caption: t("TotalHonorificFail"),
          cellRender: ({ data }: any) => {
            return (
              <div
                className="text-[#00703c] font-semibold underline cursor-pointer"
                onClick={() => handleOpen({ type: "Honorific", ...data })}
              >
                {data.TotalHonorificFail}
              </div>
            );
          },
        },
        {
          dataField: "HonorificFailPercent", // Mô t ả
          caption: t("HonorificFailPercent"),
          cellRender: ({ data }: any) => {
            return <div>{data.HonorificFailPercent}%</div>;
          },
        },
      ],
    },
    {
      groupKey: "BASIC_INFORMATION",
      caption: t("DenyWord"),
      editorType: "dxTextBox",
      alignment: "center",
      columns: [
        {
          dataField: "TotalDenyWordFail", // Mô t ả
          caption: t("TotalDenyWordFail"),
          cellRender: ({ data }: any) => {
            return (
              <div
                className="text-[#00703c] font-semibold underline cursor-pointer"
                onClick={() => handleOpen({ type: "Deny", ...data })}
              >
                {data.TotalDenyWordFail}
              </div>
            );
          },
        },
        {
          dataField: "DenyWordFailPercent", // Mô t ả
          caption: t("DenyWordFailPercent"),
          cellRender: ({ data }: any) => {
            return <div>{data.DenyWordFailPercent}%</div>;
          },
        },
      ],
    },
  ];

  return columns;
};
