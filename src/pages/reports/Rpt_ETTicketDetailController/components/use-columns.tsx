import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
import { Mst_CustomerGroupData } from "@packages/types";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { LinkCell } from "@packages/ui/link-cell";

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

  const { t } = useI18n("Rpt_ETTicketDetailController-columns");
  const columns: ColumnOptions[] = [
    {
      dataField: "STT", // Mã ngân hàng
      caption: t("STT"),
      editorType: "dxTextBox",
      width: 50,
      alignment: "left",
      allowFiltering: false,
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
      filterType: "exclude",
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
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CustomerName", // Mã ngân hàng
      caption: t("CustomerName"),
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
      dataField: "TicketName", // Tên ngân hàng
      caption: t("TicketName"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      minWidth: 200,
      width: 350,
      visible: true,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "AgentName", // Mã đại lý
      caption: t("AgentName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      // cellRender: ({ data }: any) => {
      //   return <StatusUser key={nanoid()} status={data.CampaignStatus} />;
      // },
      columnIndex: 2,
      filterType: "exclude",
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TicketStatus", // Mã đại lý
      caption: t("TicketStatus"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      filterType: "exclude",
      visible: true,
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
      visible: true,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TicketDeadline", // Mã đại lý
      caption: t("TicketDeadline"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: true,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TicketWarning", // Mã đại lý
      caption: t("TicketWarning"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      filterType: "exclude",
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "RemindWork", // Mã đại lý
      caption: t("RemindWork"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CreateBy", // Mã đại lý
      caption: t("CreateBy"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "LUDTimeUTC", // Mã đại lý
      caption: t("LUDTimeUTC"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "LUBy", // Mã đại lý
      caption: t("LUBy"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CloseBy", // Mã đại lý
      caption: t("CloseBy"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CloseDTimeUTC", // Mã đại lý
      caption: t("CloseDTimeUTC"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "RemindDTimeUTC", // Mã đại lý
      caption: t("RemindDTimeUTC"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "ProcessBy", // Mã đại lý
      caption: t("ProcessBy"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "ProcessDTimeUTC", // Mã đại lý
      caption: t("ProcessDTimeUTC"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Description", // Mã đại lý
      caption: t("Description"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "FistTicketMessage", // Mã đại lý
      caption: t("FistTicketMessage"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "FirstResTime", // Mã đại lý
      caption: t("FirstResTime"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "ResolutionTime", // Mã đại lý
      caption: t("ResolutionTime"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TicketPriority", // Mã đại lý
      caption: t("TicketPriority"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CustomerTicketTypeName", // Phân loại tùy chọn
      caption: t("CustomerTicketTypeName"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: false,
    },
  ];
  // return array of the first item only

  return columns;
};
