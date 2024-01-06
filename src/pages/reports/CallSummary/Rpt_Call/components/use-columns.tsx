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

  const { t } = useI18n("Rpt_Call");
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
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyCtmNew", // Mã đại lý
      caption: t("QtyCtmNew"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyPending", // Mã đại lý
      caption: t("QtyPending"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyDone", // Mã đại lý
      caption: t("QtyDone"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyFailed", // Mã đại lý
      caption: t("QtyFailed"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyNoAnswer", // Mã đại lý
      caption: t("QtyNoAnswer"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyCallAgain", // Mã đại lý
      caption: t("QtyCallAgain"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyNoAnswerRetry", // Mã đại lý
      caption: t("QtyNoAnswerRetry"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyDoNotCall", // Mã đại lý
      caption: t("QtyDoNotCall"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyFailedRetry", // Mã đại lý
      caption: t("QtyFailedRetry"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
  ];
  // return array of the first item only

  return columns;
};
