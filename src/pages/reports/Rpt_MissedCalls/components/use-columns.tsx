import { ColumnOptions } from "@packages/ui/base-gridview";
import { useI18n } from "@/i18n/useI18n";
import { Mst_CustomerGroupData } from "@packages/types";
import { LinkCell } from "@/packages/ui/link-cell";
import { useNetworkNavigate } from "@/packages/hooks";

interface UseBankDealerGridColumnsProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const useBankDealerGridColumns = ({
  data,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const { t } = useI18n("Rpt_MissedCalls");
  const navigate = useNetworkNavigate();
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "STT", // Mã ngân hàng
      caption: t("STT"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: (column: any) => {
        return <>{column.rowIndex + 1}</>;
      },
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TicketID", // Mã ngân hàng
      caption: t("TicketID"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
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
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CustomerPhoneNo", // Mã ngân hàng
      caption: t("CustomerPhoneNo"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      filterType: "exclude",
    },

    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CustomerName", // Tên ngân hàng
      caption: t("CustomerName"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "MissCallDTimeUTC", // Mã đại lý
      caption: t("MissCallDTimeUTC"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      filterType: "exclude",
      // cellRender: ({ data }: any) => {
      //   return <StatusUser key={nanoid()} status={data.CampaignStatus} />;
      // },
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "AgentName", // Mã đại lý
      caption: t("AgentName"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "FirstResTime", // Mã đại lý
      caption: t("FirstResTime"),
      cssClass: "TextLeftSLA",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "ProcessTime", // Mã đại lý
      caption: t("ProcessTime"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      alignment: "right",
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "RecFilePath", // Mã đại lý
      caption: t("RecFilePath"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyMissCall", // Mã đại lý
      caption: t("QtyMissCall"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "AgentTicketStatusName", // Mã đại lý
      caption: t("AgentTicketStatusName"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      filterType: "exclude",
    },
  ];
  // return array of the first item only

  return columns;
};
