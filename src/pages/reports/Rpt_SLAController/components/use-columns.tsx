import { ColumnOptions } from "@packages/ui/base-gridview";
import { useI18n } from "@/i18n/useI18n";
import { Mst_CustomerGroupData } from "@packages/types";

interface UseBankDealerGridColumnsProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const useBankDealerGridColumns = ({
  data,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const { t } = useI18n("Rpt_SLAController");
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "AgentName", // Mã ngân hàng
      caption: t("AgentName"),
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
      dataField: "AgentTicketTypeName", // Mã ngân hàng
      caption: t("AgentTicketTypeName"),
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
      dataField: "QtyTicket", // Tên ngân hàng
      caption: t("QtyTicket"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      filterType: "exclude",
      alignment: "left",
      cssClass: "TextLeftSLA",
      // width: 110,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtySLAResponding", // Mã đại lý
      caption: t("QtySLAResponding"),
      editorType: "dxTextBox",
      cssClass: "TextLeftSLA",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      // cellRender: ({ data }: any) => {
      //   return <StatusUser key={nanoid()} status={data.CampaignStatus} />;
      // },
      // width: 150,
      columnIndex: 2,
      filterType: "exclude",
      alignment: "left",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtySLANotResponding", // Mã đại lý
      caption: t("QtySLANotResponding"),
      alignment: "left",
      cssClass: "TextLeftSLA",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      filterType: "exclude",
      // width: 190,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "SLARespondingRate", // Mã đại lý
      caption: t("SLARespondingRate"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      alignment: "left",
      // width: 150,
      cssClass: "TextLeftSLA",
      editorType: "dxTextBox",
      filterType: "exclude",
      columnIndex: 2,
      cellRender: ({ data }: any) => {
        return <span>{`${data.SLARespondingRate}%`}</span>;
      },
    },
  ];
  // return array of the first item only

  return columns;
};
