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
import { useNetworkNavigate } from "@/packages/hooks";

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
  const navigate = useNetworkNavigate();

  const { t } = useI18n("Rpt_ETTicketSynthesisController-columns");
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TicketID", // Mã ngân hàng
      caption: t("TicketID"),
      editorType: "dxTextBox",
      visible: true,
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      cellRender: (column: any) => {
        return (
          <LinkCell
            onClick={() =>
              navigate(`/eticket/detail/${column.data.TicketID ?? ""}`)
            }
            value={column.data.TicketID}
          />
        );
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CustomerName", // Mã ngân hàng
      caption: t("CustomerName"),
      visible: true,
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },

    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TicketName", // Tên ngân hàng
      caption: t("TicketName"),
      visible: true,
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "AgentName", // Mã đại lý
      caption: t("AgentName"),
      visible: true,
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      // cellRender: ({ data }: any) => {
      //   return <StatusUser key={nanoid()} status={data.CampaignStatus} />;
      // },
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TicketStatus", // Mã đại lý
      caption: t("TicketStatus"),
      visible: true,
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "ProcessTime", // Mã đại lý
      caption: t("ProcessTime"),
      visible: true,
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TicketDeadline", // Mã đại lý
      caption: t("TicketDeadline"),
      visible: true,
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TicketWarning", // Mã đại lý
      caption: t("TicketWarning"),
      visible: true,
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
