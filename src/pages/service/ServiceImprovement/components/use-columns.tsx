import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
import { getCurrentUserTime } from "@/utils/time";
import { requiredType } from "@packages/common/Validation_Rules";
import { Mst_CustomerGroupData } from "@packages/types";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { StatusButton } from "@packages/ui/status-button";
import { nanoid } from "nanoid";

interface useColumnProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const useColumn = () => {
  const { t } = useI18n("ServiceImprovement_Column");

  const navigate = useNetworkNavigate();

  const handleOpenDetail = (value: any) => {
    navigate(`/service/ServiceImprovement/${value}`);
  };

  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "SvImprvCode", // Tên loại chiến dịch
      caption: t("SvImprvCode"),
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data, rowIndex, value }) => {
        return (
          <div
            className="cursor-pointer text-[#00703c]"
            onClick={() => handleOpenDetail(data.SvImprvCode)}
          >
            {data.SvImprvCode}
          </div>
        );
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "SvImprvName", // Mô t ả
      caption: t("SvImprvName"),
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
      dataField: "msiitp_SvImprvItTypeName", // Mô tả
      caption: t("msiitp_SvImprvItTypeName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "LUDTimeUTC", // Tên ngân hàng
      caption: t("LUDTimeUTC"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data }: any) => {
        return getCurrentUserTime(data?.LUDTimeUTC);
      },
    },
    {
      dataField: "FlagActive",
      caption: t("FlagActive"),
      editorType: "dxSwitch",
      alignment: "center",
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      width: 200,
      cellRender: ({ data }: any) => {
        return <StatusButton key={nanoid()} isActive={data.FlagActive} />;
      },
    },
  ];
  // return array of the first item only

  return columns;
};
