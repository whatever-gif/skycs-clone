import { ColumnOptions } from "@packages/ui/base-gridview";
import {
  ExcludeSpecialCharactersType,
  RequiredField,
  requiredType,
} from "@packages/common/Validation_Rules";
import { filterByFlagActive, uniqueFilterByDataField } from "@packages/common";
import { StatusButton } from "@packages/ui/status-button";
import { useI18n } from "@/i18n/useI18n";
import { Mst_Dealer } from "@packages/types";
import { useSetAtom } from "jotai";
import { viewingDataAtom } from "@/pages/dealer/components/dealer-store";
import { nanoid } from "nanoid";
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

interface UseDealerGridColumnsProps {
  data: Mst_Dealer[];
}

export const useDealerGridColumns = ({ data }: UseDealerGridColumnsProps) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const viewRow = (rowIndex: number, data: Mst_Dealer) => {
    setViewingItem({
      rowIndex,
      item: data,
    });
  };

  const { t } = useI18n("Dealer");
  const columns: ColumnOptions[] = [
    {
      dataField: "DealerCode",
      caption: t("DealerCode"),
      visible: true,
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      cellRender: ({ data, rowIndex, value }: any) => {
        return (
          <LinkCell
            key={nanoid()}
            onClick={() => viewRow(rowIndex, data)}
            value={value}
          />
        );
      },
      setCellValue: (newData: any, value: any) => {
        newData.DealerCode = value;
        newData.BUCode = `HTV.${value}`;
        newData.BUPattern = `HTV.${value}%`;
      },
      validationRules: [
        RequiredField(t("DealerCodeIsRequired")),
        ExcludeSpecialCharactersType,
      ],
      editorOptions: {
        placeholder: t("Input"),
        validationMessageMode: "always",
      },
    },
    {
      dataField: "DealerType",
      caption: t("Dealer Type"),
      visible: true,
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      editorType: "dxSelectBox",
      validationRules: [RequiredField(t("DealerTypeIsRequired"))],
      headerFilter: {
        dataSource: uniqueFilterByDataField(data, "DealerType"),
      },
    },
    {
      dataField: "ProvinceCode",
      caption: t("Province Code"),
      visible: true,
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      editorType: "dxSelectBox",
      headerFilter: {
        dataSource: uniqueFilterByDataField(data, "ProvinceCode"),
      },
      validationRules: [RequiredField(t("ProvinceCodeIsRequired"))],
    },
    {
      dataField: "DealerName",
      caption: t("Dealer Name"),
      validationRules: [requiredType],
      headerFilter: {
        dataSource: uniqueFilterByDataField(data ?? [], "DealerName"),
      },
      editorOptions: {
        validationMessageMode: "always",
        placeholder: t("Input"),
      },
      visible: true,
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
    },
    {
      dataField: "DealerScale",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Dealer Scale"),
      headerFilter: {
        dataSource: uniqueFilterByDataField(
          data ?? [],
          "DealerScale",
          t("( Empty )")
        ),
      },
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "DealerPhoneNo",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Dealer Phone No"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "DealerFaxNo",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Dealer Fax No"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "BUCode",
      editorOptions: {
        readOnly: true,
      },
      headerFilter: {
        dataSource: uniqueFilterByDataField(
          data ?? [],
          "BUCode",
          t("( Empty )")
        ),
      },
      caption: t("BU Code"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "BUPattern",
      editorOptions: {
        readOnly: true,
      },
      headerFilter: {
        dataSource: uniqueFilterByDataField(
          data ?? [],
          "BUPattern",
          t("( Empty )")
        ),
      },
      caption: t("BU Pattern"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "HTCStaffInCharge",
      editorOptions: {
        placeholder: t("Input"),
      },
      headerFilter: {
        dataSource: uniqueFilterByDataField(
          data ?? [],
          "HTCStaffInCharge",
          t("( Empty )")
        ),
      },
      caption: t("HTC Staff In Charge"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "CompanyName",
      editorOptions: {
        placeholder: t("Input"),
      },
      headerFilter: {
        dataSource: uniqueFilterByDataField(
          data ?? [],
          "ContactName",
          t("( Empty )")
        ),
      },
      caption: t("Company Name"),
      columnIndex: 2,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "CompanyAddress",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Company Address"),
      columnIndex: 2,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "TaxCode",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Tax Code"),
      columnIndex: 2,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "DirectorName",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Director Name"),
      columnIndex: 2,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "DirectorPhoneNo",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Director Phone No"),
      columnIndex: 2,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "DirectorEmail",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Director Email"),
      columnIndex: 2,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "ContactName",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Contact Name"),
      columnIndex: 2,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "FlagDirect",
      caption: t("Flag Direct"),
      columnIndex: 2,
      headerFilter: {
        dataSource: uniqueFilterByDataField(
          data ?? [],
          "FlagDirect",
          t("( Empty )")
        ),
      },
      groupKey: "BASIC_INFORMATION",
      visible: true,
      editorType: "dxSelectBox",
      editorOptions: flagEditorOptions,
    },
    {
      dataField: "FlagTCG",
      caption: t("Flag TCG"),
      columnIndex: 2,
      headerFilter: {
        dataSource: uniqueFilterByDataField(
          data ?? [],
          "FlagTCG",
          t("( Empty )")
        ),
      },
      groupKey: "BASIC_INFORMATION",
      visible: true,
      editorType: "dxSelectBox",
      editorOptions: flagEditorOptions,
    },
    {
      dataField: "FlagActive",
      caption: t("Status"),
      editorType: "dxSwitch",
      columnIndex: 2,
      headerFilter: {
        dataSource: filterByFlagActive(data ?? [], {
          true: t("Active"),
          false: t("Inactive"),
        }),
      },
      groupKey: "BASIC_INFORMATION",
      visible: true,
      width: 100,
      cellRender: ({ data }: any) => {
        return <StatusButton key={nanoid()} isActive={data.FlagActive} />;
      },
    },
    {
      dataField: "CtrNoSigner",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Ctr No Signer"),
      visible: true,
      columnIndex: 1,
      groupKey: "SALES_INFORMATION",
    },
    {
      dataField: "CtrNoSignerPosition",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Ctr No Signer Position"),
      visible: true,
      columnIndex: 1,
      groupKey: "SALES_INFORMATION",
    },
    {
      dataField: "Signer",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Signer"),
      visible: true,
      columnIndex: 1,
      groupKey: "SALES_INFORMATION",
    },
    {
      dataField: "SignerPosition",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Signer Position"),
      visible: true,
      columnIndex: 1,
      groupKey: "SALES_INFORMATION",
    },
    {
      dataField: "ShowroomAddress",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Showroom Address"),
      visible: true,
      columnIndex: 2,
      groupKey: "SALES_INFORMATION",
    },
    {
      dataField: "SalesManagerName",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Sales Manager Name"),
      columnIndex: 2,
      groupKey: "SALES_INFORMATION",
      visible: true,
    },
    {
      dataField: "SalesManagerPhoneNo",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Sales Manager Phone No"),
      columnIndex: 2,
      groupKey: "SALES_INFORMATION",
      visible: true,
    },
    {
      dataField: "SalesManagerEmail",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Sales Manager Email"),
      columnIndex: 2,
      groupKey: "SALES_INFORMATION",
      visible: true,
    },
    {
      dataField: "DealerAddress01",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Dealer Address 01"),
      columnIndex: 1,
      groupKey: "DELIVERY_INFORMATION",
      visible: true,
    },
    {
      dataField: "DealerAddress02",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Dealer Address 02"),
      columnIndex: 1,
      groupKey: "DELIVERY_INFORMATION",
      visible: true,
    },
    {
      dataField: "DealerAddress03",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Dealer Address 03"),
      columnIndex: 1,
      groupKey: "DELIVERY_INFORMATION",
      visible: true,
    },
    {
      dataField: "DealerAddress04",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Dealer Address 04"),
      columnIndex: 2,
      groupKey: "DELIVERY_INFORMATION",
      visible: true,
    },
    {
      dataField: "DealerAddress05",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Dealer Address 05"),
      columnIndex: 2,
      groupKey: "DELIVERY_INFORMATION",
      visible: true,
    },
    {
      dataField: "Remark",
      editorType: "dxTextArea",
      editorOptions: {
        placeholder: t("Input"),
        height: 90,
        autoResizeEnabled: true,
      },
      caption: t("Remark"),
      columnIndex: 2,
      groupKey: "DELIVERY_INFORMATION",
      visible: true,
    },
    {
      dataField: "GarageAddress",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Garage Address"),
      columnIndex: 1,
      groupKey: "SERVICE_WORKSHOP_INFORMATION",
      visible: true,
    },
    {
      dataField: "GaragePhoneNo",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Garage Phone No"),
      columnIndex: 1,
      groupKey: "SERVICE_WORKSHOP_INFORMATION",
      visible: true,
    },
    {
      dataField: "GarageFaxNo",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Garage Fax No"),
      columnIndex: 1,
      groupKey: "SERVICE_WORKSHOP_INFORMATION",
      visible: true,
    },
    {
      dataField: "GarageManagerName",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Garage Manager Name"),
      columnIndex: 2,
      groupKey: "SERVICE_WORKSHOP_INFORMATION",
      visible: true,
    },
    {
      dataField: "GarageManagerPhoneNo",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Garage Manager Phone No"),
      columnIndex: 2,
      groupKey: "SERVICE_WORKSHOP_INFORMATION",
      visible: true,
    },
    {
      dataField: "GarageManagerEmail",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Garage Manager Email"),
      columnIndex: 2,
      groupKey: "SERVICE_WORKSHOP_INFORMATION",
      visible: true,
    },
    {
      dataField: "FlagAutoLXX",
      caption: t("Flag Auto LXX"),
      columnIndex: 1,
      groupKey: "AUTO_APPROVAL_INFORMATION",
      visible: true,
      editorType: "dxSelectBox",
      editorOptions: flagEditorOptions,
    },
    {
      dataField: "FlagAutoMapVIN",
      caption: t("Flag Auto Map VIN"),
      columnIndex: 1,
      groupKey: "AUTO_APPROVAL_INFORMATION",
      headerFilter: {
        dataSource: uniqueFilterByDataField(
          data ?? [],
          "FlagAutoMapVIN",
          t("( Empty )")
        ),
      },
      visible: true,
      editorType: "dxSelectBox",
      editorOptions: flagEditorOptions,
    },
    {
      dataField: "FlagAutoSOAppr",
      caption: t("Flag Auto SO Appr"),
      columnIndex: 2,
      headerFilter: {
        dataSource: uniqueFilterByDataField(
          data ?? [],
          "FlagAutoSOAppr",
          t("( Empty )")
        ),
      },
      groupKey: "AUTO_APPROVAL_INFORMATION",
      visible: true,
      editorType: "dxSelectBox",
      editorOptions: flagEditorOptions,
    },
  ];
  // return array of the first item only

  return columns;
};
