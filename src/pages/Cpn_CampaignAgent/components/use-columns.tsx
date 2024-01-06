import { useI18n } from "@/i18n/useI18n";
import { StatusUser } from "@/packages/ui/status-user";
import { requiredType } from "@packages/common/Validation_Rules";
import { Cpn_CampaignAgentData } from "@packages/types";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { LinkCell } from "@packages/ui/link-cell";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { viewingDataAtom } from "./store";

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
  data?: Cpn_CampaignAgentData[] | any;
}

export const useBankDealerGridColumns = ({
  data,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const viewRow = (rowIndex: number, data: Cpn_CampaignAgentData) => {
    setViewingItem({
      rowIndex,
      item: data,
    });
  };

  const { t } = useI18n("Cpn_CampaignAgent-columns");
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CampaignCode", // Mã ngân hàng
      caption: t("CampaignCode"),
      visible: true,
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      filterType: "exclude",
      cellRender: ({ data, rowIndex, value }) => {
        return (
          <LinkCell
            key={nanoid()}
            onClick={() => viewRow(rowIndex, data)}
            value={value}
          />
        );
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CampaignName", // Mã ngân hàng
      caption: t("CampaignName"),
      visible: true,
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      filterType: "exclude",
    },

    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CampaignStatus", // Tên ngân hàng
      caption: t("CampaignStatus"),
      visible: true,
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },

      columnIndex: 1,
      cellRender: ({ data }: any) => {
        return <StatusUser key={nanoid()} status={data.CampaignStatus} />;
      },
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "UserName", // Mã đại lý
      caption: t("UserName"),
      visible: true,
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      filterType: "exclude",
      columnIndex: 2,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Extension", // Mã đại lý
      caption: t("Extension"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      alignment: "center",
      visible: true,
      editorType: "dxTextBox",
      columnIndex: 2,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyCustomer", // Mã đại lý
      caption: t("QtyCustomer"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      visible: true,
      editorType: "dxTextBox",
      columnIndex: 2,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "QtyCustomerSuccess", // Mã đại lý
      caption: t("QtyCustomerSuccess"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      visible: true,
      editorType: "dxTextBox",
      columnIndex: 2,
      filterType: "exclude",
    },
  ];
  // return array of the first item only

  return columns;
};
