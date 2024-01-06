import { ColumnOptions } from "@packages/ui/base-gridview";
import {
  ExcludeSpecialCharactersType,
  RequiredField,
  requiredType,
} from "@packages/common/Validation_Rules";
import { filterByFlagActive, uniqueFilterByDataField } from "@packages/common";
import { StatusButton } from "@packages/ui/status-button";
import { useI18n } from "@/i18n/useI18n";
import { Mst_CustomerGroupData } from "@packages/types";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { LinkCell } from "@packages/ui/link-cell";
import { viewingDataAtom } from "./store";
import NavNetworkLink from "@/components/Navigate";

interface UseBankDealerGridColumnsProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const useBankDealerGridColumns = ({
  data,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const viewRow = (rowIndex: number, data: Mst_CustomerGroupData) => {
    setViewingItem({
      rowIndex,
      item: data,
    });
  };

  const { t } = useI18n("Mst_CampaignTypePage");
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Idx", // Số thứ tự
      caption: t("Idx"),
      width: 100,
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CampaignTypeName", // Tên loại chiến dịch
      caption: t("CampaignTypeName"),
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data, rowIndex, value }) => {
        return (
          <NavNetworkLink
            to={`/admin/Mst_CampaignTypePage/Customize/detail/${data.CampaignTypeCode}`}
          >
            {data.CampaignTypeName}
          </NavNetworkLink>
        );
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CampaignTypeDesc", // Mô tả
      caption: t("CampaignTypeDesc"),
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
      dataField: "QtyCampaign", // Mô tả
      caption: t("QtyCampaign"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "LogLUDTimeUTC", // Tên ngân hàng
      caption: t("LogLUDTimeUTC"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      dataField: "FlagActive",
      caption: t("FlagActive"),
      editorType: "dxSwitch",
      alignment: "center",
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      width: 100,
      cellRender: ({ data }: any) => {
        return <StatusButton key={nanoid()} isActive={data.FlagActive} />;
      },
    },
  ];
  // return array of the first item only

  return columns;
};
