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
  datalistOrgID: any;
}

export const useBankDealerGridColumns = ({
  data,
  datalistOrgID,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const viewRow = (rowIndex: number, data: Mst_CustomerGroupData) => {
    setViewingItem({
      rowIndex,
      item: data,
    });
  };
  const PTTypeData = [
    {
      text: "Sale",
      value: "SALE",
    },
    {
      text: "Purchase",
      value: "PURCHASE",
    },
  ];

  const { t } = useI18n("Mst_PaymentTermController-colums");
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "OrgID", // Mã ngân hàng
      caption: t("OrgID"),
      editorType: "dxSelectBox",
      editorOptions: {
        dataSource: datalistOrgID,
        valueExpr: "OrgID",
        displayExpr: "NNTFullName",
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      visible: true,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "PaymentTermCode", // Mã ngân hàng
      caption: t("PaymentTermCode"),
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data, rowIndex, value }) => {
        return (
          <LinkCell
            key={nanoid()}
            onClick={() => viewRow(rowIndex, data)}
            value={value}
          />
        );
      },
      visible: true,
      filterType: "exclude",
      width: 210,
    },

    {
      groupKey: "BASIC_INFORMATION",
      dataField: "PaymentTermName", // Tên ngân hàng
      caption: t("PaymentTermName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      validationRules: [requiredType],
      columnIndex: 1,
      visible: true,
      filterType: "exclude",
      width: 210,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "PTDesc", // Mã đại lý
      caption: t("PTDesc"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
        height: 70,
      },
      editorType: "dxTextArea",
      columnIndex: 2,
      visible: true,
      validationRules: [requiredType],
      filterType: "exclude",
      width: 200,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "PTType", // Mã đại lý
      caption: t("PTType"),
      editorType: "dxSelectBox",
      editorOptions: {
        dataSource: PTTypeData,
        valueExpr: "value",
        displayExpr: "text",
        readOnly: false,
        placeholder: t("Input"),
      },
      validationRules: [requiredType],
      columnIndex: 1,
      visible: true,
      filterType: "exclude",
    },

    {
      groupKey: "BASIC_INFORMATION",
      dataField: "OwedDay", // Mã đại lý
      caption: t("OwedDay"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input number"),
      },
      cssClass: "TextLeftGrid",
      alignment: "left",
      editorType: "dxNumberBox",
      columnIndex: 2,
      visible: true,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CreditLimit", // Mã đại lý
      caption: t("CreditLimit"),
      cssClass: "TextLeftGrid",
      alignment: "left",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input number"),
      },
      editorType: "dxNumberBox",
      columnIndex: 2,
      visible: true,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "DepositPercent", // Mã đại lý
      caption: t("DepositPercent"),
      cssClass: "TextLeftGrid",
      alignment: "left",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input number"),
      },
      visible: true,
      editorType: "dxNumberBox",
      columnIndex: 2,
      filterType: "exclude",
    },
    {
      dataField: "FlagActive",
      caption: t("FlagActive"),
      headerFilter: {
        dataSource: filterByFlagActive(data ?? [], {
          true: t("Active"),
          false: t("Inactive"),
        }),
      },
      editorType: "dxSwitch",
      alignment: "center",
      columnIndex: 2,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      cellRender: ({ data }: any) => {
        return <StatusButton key={nanoid()} isActive={data.FlagActive} />;
      },
      filterType: "exclude",
    },
  ];
  // return array of the first item only

  return columns;
};
