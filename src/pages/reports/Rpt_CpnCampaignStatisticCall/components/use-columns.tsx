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
import { Link } from "react-router-dom";
import NavNetworkLink from "@/components/Navigate";
import { StatusUser } from "@/packages/ui/status-user";

const flagEditorOptions = {
  searchEnabled: true,
  valueExpr: "value",
  displayExpr: "text",
  items: [
    {
      value: "1",
      text: "1",
    },
    {
      value: "0",
      text: "0",
    },
  ],
};

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

  const { t } = useI18n("Rpt_CpnCampaignStatisticCall-columns");
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CampaignCode", // Mã ngân hàng
      caption: t("CampaignCode"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      filterType: "exclude",
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CampaignName", // Mã ngân hàng
      caption: t("CampaignName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      filterType: "exclude",
      visible: true,
    },

    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CreateDTimeUTC", // Tên ngân hàng
      caption: t("CreateDTimeUTC"),
      format: "yyyy-MM-dd",
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      filterType: "exclude",
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CampaignStatus", // Mã đại lý
      caption: t("CampaignStatus"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      cellRender: ({ data }: any) => {
        return <StatusUser key={nanoid()} status={data.CampaignStatus} />;
      },
      columnIndex: 2,
      filterType: "exclude",
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtySumCtm", // Mã đại lý
      caption: t("QtySumCtm"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      alignment: "left",
      cssClass: "TextLeftGrid",
      filterType: "exclude",
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtySumCall", // Mã đại lý
      caption: t("QtySumCall"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      alignment: "left",
      cssClass: "TextLeftGrid",
      filterType: "exclude",
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyCallDone", // Mã đại lý
      caption: t("QtyCallDone"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      alignment: "left",
      cssClass: "TextLeftGrid",
      columnIndex: 2,
      filterType: "exclude",
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyCallFailed", // Mã đại lý
      caption: t("QtyCallFailed"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      alignment: "left",
      cssClass: "TextLeftGrid",
      columnIndex: 2,
      filterType: "exclude",
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtySumCallTime", // Mã đại lý
      caption: t("QtySumCallTime"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      alignment: "left",
      cssClass: "TextLeftGrid",
      columnIndex: 2,
      filterType: "exclude",
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CallTimeAverage", // Mã đại lý
      caption: t("CallTimeAverage"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      alignment: "left",
      cssClass: "TextLeftGrid",
      columnIndex: 2,
      filterType: "exclude",
      visible: true,
    },
  ];
  // return array of the first item only

  return columns;
};
