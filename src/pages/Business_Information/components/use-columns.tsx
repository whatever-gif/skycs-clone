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

import { nanoid } from "nanoid";
import { LinkCell } from "@packages/ui/link-cell";
import {
  dataFormAtom,
  flagEdit,
  readOnly,
  showDetail,
  showPopup,
  viewingDataAtom,
} from "./store";
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

interface UseDealerGridColumnsProps {
  data: any;
  dataOrgID: any;
}

export const useDealerGridColumns = ({
  data,
  dataOrgID,
}: UseDealerGridColumnsProps) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setShowDetail = useSetAtom(showDetail);
  const setReadOnly = useSetAtom(readOnly);
  const setDataForm = useSetAtom(dataFormAtom);
  const setFlag = useSetAtom(flagEdit);
  const api = useClientgateApi();
  const viewRow = async (rowIndex: number, data: any) => {
    setReadOnly(false);
    setFlag(false);
    setShowDetail(true);
    // setViewingItem({
    //   rowIndex,
    //   item: data,
    // });
    const resp = await api.Mst_NNTController_GetNNTCode(data.MST);
    if (resp.isSuccess) {
      setDataForm({
        ...resp.Data,
        FlagActive: resp.Data?.FlagActive === "1" ? true : false,
      });
    }
    setPopupVisible(true);
  };
  const { t } = useI18n("Business_Information-colums");
  const columns: ColumnOptions[] = [
    {
      dataField: "OrgID",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("OrgID"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      filterType: "exclude",
    },
    {
      dataField: "NNTFullName",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("NNTFullName"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      filterType: "exclude",
      cellRender: ({ data, rowIndex, value }: any) => {
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
      dataField: "MST",
      editorOptions: {
        readOnly: true,
      },
      filterType: "exclude",
      caption: t("MST"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "PresentBy",
      editorOptions: {
        readOnly: true,
      },
      caption: t("PresentBy"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      filterType: "exclude",
    },
    {
      dataField: "NNTPosition",
      editorOptions: {
        readOnly: true,
      },
      caption: t("NNTPosition"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      filterType: "exclude",
    },
    {
      dataField: "ContactName",
      editorOptions: {
        readOnly: true,
      },
      caption: t("ContactName"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      filterType: "exclude",
    },
    {
      dataField: "ContactPhone",
      editorOptions: {
        readOnly: true,
      },
      caption: t("ContactPhone"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      filterType: "exclude",
    },
    {
      dataField: "ContactEmail",
      editorOptions: {
        readOnly: true,
      },
      caption: t("ContactEmail"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      filterType: "exclude",
    },
    {
      dataField: "FlagActive",
      caption: t("FlagActive"),
      editorType: "dxSwitch",
      columnIndex: 2,
      headerFilter: {
        dataSource: filterByFlagActive(data ?? [], {
          true: t("Hoạt động"),
          false: t("Không hoạt động"),
        }),
      },
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
