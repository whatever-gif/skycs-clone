import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";

import { useConfiguration } from "@packages/hooks";
import { showErrorAtom } from "@packages/store";
import {
  FlagActiveEnum,
  Mst_CampaignTypeSearchParam,
  Mst_PaymentTermData,
} from "@packages/types";
import { GridViewPopup } from "@packages/ui/base-gridview";
import { useQuery } from "@tanstack/react-query";
import { IItemProps } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

import { HeaderPart } from "../components/header-part";
import { selectedItemsAtom } from "../components/store";

import { getYearMonthDate } from "@/components/ulti";
import { useClientgateApi } from "@/packages/api";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { useColumn } from "../components/use-columns";

export const ServiceImprovementManager = () => {
  const { t } = useI18n("ServiceImprovementManager");
  const { t: placeholder } = useI18n("Placeholder");
  const { t: common } = useI18n("Common");

  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const [searchCondition] = useState<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    SvImprvCode: "",
    KeyWord: "",
    SvImprvItType: "",
    CreateDTimeUTC: [null, null],
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["ServiceImprovement_List", JSON.stringify(searchCondition)],
    queryFn: async () => {
      const response = await api.SvImpSvImprv_Search({
        ...searchCondition,
        CreateDTimeUTCFrom: searchCondition?.CreateDTimeUTC[0]
          ? getYearMonthDate(searchCondition?.CreateDTimeUTC[0])
          : "",
        CreateDTimeUTCTo: searchCondition?.CreateDTimeUTC[1]
          ? getYearMonthDate(searchCondition?.CreateDTimeUTC[1])
          : "",
      });

      if (response.isSuccess) {
        const data: any[] = response.DataList ?? [];
        return data;
      } else {
        showError({
          message: response._strErrCode,
          _strErrCode: response._strErrCode,
          _strTId: response._strTId,
          _strAppTId: response._strAppTId,
          _objTTime: response._objTTime,
          _strType: response._strType,
          _dicDebug: response._dicDebug,
          _dicExcs: response._dicExcs,
        });
      }
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  const columns = useColumn();

  const { data: listSvImprvItType } = useQuery(
    ["ListSvImprvItType"],
    api.MstSvImprvItemType_GetAllActive
  );

  const flagEditorOptionsSearch = {
    searchEnabled: true,
    valueExpr: "value",
    displayExpr: "text",
    items: [
      {
        value: "",
        text: common("All"),
      },
      {
        value: "1",
        text: common("Active"),
      },
      {
        value: "0",
        text: common("Inactive"),
      },
    ],
  };

  const formItems: IItemProps[] = [
    {
      caption: t("SvImprvCode"),
      label: {
        text: t("SvImprvCode"),
      },
      dataField: "SvImprvCode",
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: placeholder("Input"),
      },
      visible: true,
    },
    {
      caption: t("KeyWord"),
      label: {
        text: t("KeyWord"),
      },
      dataField: "KeyWord",
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: placeholder("Input"),
      },
      visible: true,
    },

    {
      dataField: "SvImprvItType",
      caption: t("SvImprvItType"),
      label: {
        text: t("SvImprvItType"),
      },
      editorType: "dxSelectBox",
      editorOptions: {
        dataSource: listSvImprvItType?.DataList,
        valueExpr: "SvImprvItType",
        displayExpr: "SvImprvItTypeName",
      },
      visible: true,
    },
    {
      dataField: "CreateDTimeUTC",
      caption: t("CreateDTimeUTC"),
      visible: true,
      label: {
        text: t("CreateDTimeUTC"),
      },
      colSpan: 1,
      editorType: "dxDateRangeBox",
      editorOptions: {
        type: "date",
        displayFormat: "yyyy-MM-dd",
      },
    },
    {
      dataField: "FlagActive",
      caption: t("FlagActive"),
      label: {
        text: t("FlagActive"),
      },
      editorType: "dxSelectBox",
      editorOptions: flagEditorOptionsSearch,
      visible: true,
    },
  ];

  const handleDeleteRows = async (rows: Mst_CampaignTypeSearchParam[]) => {};

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleEdit = (rowData: any) => {
    // gridRef.current?.instance?.editRow(rowData);
    // console.log("rowData ", rowData.CampaignTypeCode);
  };

  const handleEditorPreparing = (e: EditorPreparingEvent) => {
    // use this function to control how the editor looks like
    // if (e.dataField) {
    //   if (["OrgID", "PaymentTermCode"].includes(e.dataField!)) {
    //     e.editorOptions.readOnly = !e.row?.isNewRow;
    //   }
    // }
  };

  const popupSettings: IPopupOptions = {};

  const formSettings = {};

  const onModify = async (id: any, data: Partial<any>) => {};
  // Section: CRUD operations
  const onCreate = async (
    data: Mst_PaymentTermData & { __KEY__: string }
  ) => {};

  const onDelete = async (id: any) => {};
  const handleSavingRow = (e: any) => {
    // console.log(e);
    // stop grid behaviour
    if (e.changes && e.changes.length > 0) {
      // we don't enable batch mode, so only 1 change at a time.
      const { type } = e.changes[0];
      if (type === "remove") {
        const id = e.changes[0].key;
        e.promise = onDelete(id);
      } else if (type === "insert") {
        const data = e.changes[0].data!;
        e.promise = onCreate(data);
      } else if (type === "update") {
        e.promise = onModify(e.changes[0].key, e.changes[0].data!);
      }
    }
    e.cancel = true;
  };
  // End Section: CRUD operations

  const handleSearch = async () => {
    await refetch();
  };
  const handleOnEditRow = (e: any) => {
    const { row, column } = e;
    handleEdit(row.data);
  };
  const handleEditRowChanges = (e: any) => {
    console.log("e", e);
  };

  return (
    <AdminContentLayout className={"ServiceImprovementManager "}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart></HeaderPart>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout searchPermissionCode="">
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            {/* <div className={"w-[200px]"}> */}
            <SearchPanelV2
              storeKey="ServiceImprovementManager_Search_V2"
              conditionFields={formItems}
              data={searchCondition}
              onSearch={handleSearch}
            />
            {/* </div> */}
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewPopup
              isLoading={isLoading}
              dataSource={data ?? []}
              columns={columns}
              keyExpr={"SvImprvCode"}
              allowInlineEdit={false}
              popupSettings={popupSettings}
              formSettings={formSettings}
              onReady={(ref) => (gridRef = ref)}
              allowSelection={true}
              onSelectionChanged={handleSelectionChanged}
              onSaveRow={handleSavingRow}
              onEditorPreparing={handleEditorPreparing}
              onEditRow={handleOnEditRow}
              onEditRowChanges={handleEditRowChanges}
              onDeleteRows={handleDeleteRows}
              toolbarItems={[
                {
                  location: "before",
                  widget: "dxButton",
                  options: {
                    icon: "search",
                    onClick: handleToggleSearchPanel,
                  },
                },
              ]}
              storeKey={"ServiceImprovementManager-search"}
              checkboxMode="none"
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
