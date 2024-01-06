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
import {
  avatar,
  dataFormAtom,
  flagEdit,
  showDetail,
  showPopup,
  viewingDataAtom,
} from "./store";
import AvatarCustomerGroup from "./AvatarCustomerGroup";
import { useClientgateApi } from "@/packages/api";

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
  data?: any;
  datalistOrgID?: any;
}

export const useBankDealerGridColumns = ({
  data,
  datalistOrgID,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setShowDetail = useSetAtom(showDetail);
  const api = useClientgateApi();
  const setDataForm = useSetAtom(dataFormAtom);
  const setAvt = useSetAtom(avatar);
  const setFlag = useSetAtom(flagEdit);

  const viewRow = async (rowIndex: number, data: any) => {
    setShowDetail(true);
    setFlag(false);
    setPopupVisible(true);
    const resp = await api.Mst_CustomerGroup_GetByCustomerGrpCode(
      data.CustomerGrpCode,
      data.OrgID
    );

    if (resp.isSuccess) {
      setAvt(resp?.Data?.CustomerGrpImage);
      setDataForm({
        ...resp.Data,
        FlagActive: resp.Data?.FlagActive === "1" ? true : false,
      });
    }
  };

  const { t } = useI18n("Mst_CustomerGroup");
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "OrgID", // Mã ngân hàng
      caption: t("OrgID"),
      editorType: "dxSelectBox",
      validationRules: [requiredType],
      columnIndex: 1,
      visible: true,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CustomerGrpCode", // Mã ngân hàng
      caption: t("CustomerGrpCode"),
      editorType: "dxTextBox",
      validationRules: [requiredType],
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
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CustomerGrpName", // Tên ngân hàng
      caption: t("CustomerGrpName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
      },
      columnIndex: 1,
      visible: true,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CustomerGrpImage", // Tên ngân hàng
      caption: t("CustomerGrpImage"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
      },
      columnIndex: 1,
      cellRender: ({ data, rowIndex, value }) => {
        return <AvatarCustomerGroup key={nanoid()} data={data} />;
      },
      visible: true,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CustomerGrpDesc", // Mã đại lý
      caption: t("CustomerGrpDesc"),
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: true,
      filterType: "exclude",
    },
    {
      dataField: "FlagActive",
      caption: t("FlagActive"),
      editorType: "dxSwitch",
      alignment: "center",
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
      filterType: "exclude",
    },
  ];
  // return array of the first item only

  return columns;
};
