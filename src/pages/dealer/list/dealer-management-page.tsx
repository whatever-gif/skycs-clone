import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useClientgateApi } from "@packages/api";
import { GridViewPopup } from "@packages/ui/base-gridview";
import { useRef, useState } from "react";

import { DealerPopupView } from "@/pages/dealer/components";
import { selectedItemsAtom } from "@/pages/dealer/components/dealer-store";
import { HeaderPart } from "@/pages/dealer/components/header-part";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";
import { useConfiguration, useVisibilityControl } from "@packages/hooks";
import { logger } from "@packages/logger";
import { showErrorAtom } from "@packages/store";
import { FlagActiveEnum, Mst_Dealer, SearchDealerParam } from "@packages/types";
import { SearchPanelV2 } from "@packages/ui/search-panel";
import { useQuery } from "@tanstack/react-query";
import { DataGrid, LoadPanel } from "devextreme-react";
import { IItemProps } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { useDealerGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";
import "./dealer-management.scss";

export const DealerManagementPage = () => {
  const { t } = useI18n("Dealer");
  let gridRef: any = useRef<DataGrid | null>(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const [searchCondition, setSearchCondition] = useState<
    Partial<SearchDealerParam>
  >({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    KeyWord: "",
    DealerCode: "",
    DealerName: "",
    FlagAutoLXX: FlagActiveEnum.All,
    FlagAutoMapVIN: FlagActiveEnum.All,
    FlagAutoSOAppr: FlagActiveEnum.All,
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["dealer", JSON.stringify(searchCondition)],
    () =>
      api.Mst_Dealer_Search({
        ...searchCondition,
      })
  );
  const { data: provinceDs } = useQuery(["provinces"], () =>
    api.Mst_Province_Search({
      FlagActive: FlagActiveEnum.All,
      Ft_PageIndex: 0,
      Ft_PageSize: config.MAX_PAGE_ITEMS,
      KeyWord: "",
    })
  );

  const { data: dealerTypeDs } = useQuery(["dealerTypes"], () =>
    api.Mst_DealerType_Search({
      FlagActive: FlagActiveEnum.All,
      Ft_PageIndex: 0,
      Ft_PageSize: config.MAX_PAGE_ITEMS,
      KeyWord: "",
    })
  );

  const flagFilterOptions = {
    searchEnabled: true,
    valueExpr: "value",
    displayExpr: "text",
    items: [
      {
        value: "",
        text: t("All"),
      },
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

  const columns = useDealerGridColumns({ data: data?.DataList ?? [] });

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    gridRef.current?.instance?.addRow();
  };

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleCancel = () => {
    gridRef.current?.instance?.cancelEditData();
  };
  const handleEdit = (rowIndex: number) => {
    // clear viewing item info before start edit it
    gridRef.current?.instance?.editRow(rowIndex);
  };
  const handleSubmit = () => {
    gridRef.current?.instance?.saveEditData();
  };

  const handleEditorPreparing = (e: EditorPreparingEvent) => {
    // use this function to control how the editor looks like
    if (["DealerCode", "DealerType", "ProvinceCode"].includes(e.dataField!)) {
      e.editorOptions.readOnly = !e.row?.isNewRow;
    } else if (e.dataField === "FlagActive") {
      e.editorOptions.value = true;
    } else if (["FlagDirect", "FlagTCG"].includes(e.dataField!)) {
      e.editorOptions.value = "0";
    }
  };
  const handleOnEditRow = (e: any) => {
    const { row, column } = e;
    handleEdit(row.rowIndex);
  };

  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: t("Dealer Information"),
    className: "dealer-information-popup",
    toolbarItems: [
      {
        toolbar: "bottom",
        location: "after",
        widget: "dxButton",
        options: {
          text: t("Save"),
          stylingMode: "contained",
          type: "default",
          onClick: handleSubmit,
        },
      },
      {
        toolbar: "bottom",
        location: "after",
        widget: "dxButton",
        options: {
          text: t("Cancel"),
          type: "default",
          onClick: handleCancel,
        },
      },
    ],
  };
  const formSettings = useFormSettings({
    columns,
    provinceDs: provinceDs?.DataList,
    dealerTypeDs: dealerTypeDs?.DataList,
  });

  const onModify = async (id: string, data: Mst_Dealer) => {
    logger.debug("id:", id);
    const resp = await api.Mst_Dealer_Update(id, {
      ...data,
    });
    if (resp.isSuccess) {
      toast.success(t("Update Successfully"));
      await refetch();
      return true;
    }
    showError({
      message: resp._strErrCode,
      _strErrCode: resp._strErrCode,
      _strTId: resp._strTId,
      _strAppTId: resp._strAppTId,
      _objTTime: resp._objTTime,
      _strType: resp._strType,
      _dicDebug: resp._dicDebug,
      _dicExcs: resp._dicExcs,
    });
    throw new Error(resp._strErrCode);
  };
  // Section: CRUD operations
  const onCreate = async (data: Mst_Dealer & { __KEY__: string }) => {
    const { __KEY__, ...rest } = data;
    const resp = await api.Mst_Dealer_Create({
      ...rest,
    });
    if (resp.isSuccess) {
      toast.success(t("Create Successfully"));
      await refetch();
      return true;
    }
    showError({
      message: resp._strErrCode,
      _strErrCode: resp._strErrCode,
      _strTId: resp._strTId,
      _strAppTId: resp._strAppTId,
      _objTTime: resp._objTTime,
      _strType: resp._strType,
      _dicDebug: resp._dicDebug,
      _dicExcs: resp._dicExcs,
    });
    throw new Error(resp._strErrCode);
  };
  const onDelete = async (id: string) => {
    const resp = await api.Mst_Dealer_Delete(id);
    if (resp.isSuccess) {
      toast.success(t("Delete Successfully"));
      await refetch();
      return true;
    }
    showError({
      message: resp._strErrCode,
      _strErrCode: resp._strErrCode,
      _strTId: resp._strTId,
      _strAppTId: resp._strAppTId,
      _objTTime: resp._objTTime,
      _strType: resp._strType,
      _dicDebug: resp._dicDebug,
      _dicExcs: resp._dicExcs,
    });
    throw new Error(resp._strErrCode);
  };
  const handleSavingRow = (e: any) => {
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
    } else {
      // no changes
      // just close it
      e.promise = Promise.resolve();
      gridRef?.instance.cancelEditData();
    }
    e.cancel = true;
  };
  // End Section: CRUD operations

  const handleSearch = async (data: any) => {
    setSearchCondition({
      ...searchCondition,
      ...data,
    });
    // await refetch();
  };
  const handleEditRowChanges = () => {};
  const searchConditions: IItemProps[] = [
    {
      caption: t("Dealer Code"),
      dataField: "DealerCode",
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      dataField: "DealerName",
      caption: t("Dealer Name"),
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      dataField: "FlagAutoLXX",
      caption: t("Flag Auto LXX"),
      editorType: "dxSelectBox",
      editorOptions: flagFilterOptions,
    },
    {
      dataField: "FlagAutoMapVIN",
      caption: t("Flag Auto Map VIN"),
      editorType: "dxSelectBox",
      editorOptions: flagFilterOptions,
    },
    {
      dataField: "FlagAutoSOAppr",
      caption: t("Flag Auto SO Appr"),
      editorType: "dxSelectBox",
      editorOptions: flagFilterOptions,
    },
    {
      dataField: "FlagActive",
      caption: t("Flag Active"),
      editorType: "dxSelectBox",
      editorOptions: {
        searchEnabled: true,
        valueExpr: "value",
        displayExpr: "text",
        items: [
          {
            value: "",
            text: t("All"),
          },
          {
            value: "1",
            text: t("Active"),
          },
          {
            value: "0",
            text: t("Inactive"),
          },
        ],
      },
    },
  ];
  const loadingControl = useVisibilityControl({ defaultVisible: false });
  const handleDeleteRows = async (ids: string[]) => {
    loadingControl.open();
    const resp = await api.Mst_Dealer_DeleteMultiple(ids);
    loadingControl.close();
    if (resp.isSuccess) {
      toast.success(t("Delete Successfully"));
      await refetch();
      return true;
    }
    showError({
      message: resp._strErrCode,
      _strErrCode: resp._strErrCode,
      _strTId: resp._strTId,
      _strAppTId: resp._strAppTId,
      _objTTime: resp._objTTime,
      _strType: resp._strType,
      _dicDebug: resp._dicDebug,
      _dicExcs: resp._dicExcs,
    });
    throw new Error(resp._strErrCode);
  };
  return (
    <AdminContentLayout className={"dealer-management"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart onAddNew={handleAddNew}></HeaderPart>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <div className={"w-[200px]"}>
              <SearchPanelV2
                conditionFields={searchConditions}
                data={searchCondition}
                onSearch={handleSearch}
                storeKey={"dealer-search-panel"}
              />
            </div>
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <LoadPanel
              container={".dx-viewport"}
              shadingColor="rgba(0,0,0,0.4)"
              position={"center"}
              visible={loadingControl.visible}
              showIndicator={true}
              showPane={true}
            />
            {!loadingControl.visible && (
              <>
                <GridViewPopup
                  isLoading={isLoading}
                  dataSource={data?.isSuccess ? data.DataList ?? [] : []}
                  columns={columns}
                  keyExpr={"DealerCode"}
                  popupSettings={popupSettings}
                  formSettings={formSettings}
                  onReady={(ref) => (gridRef = ref)}
                  allowSelection={true}
                  onSelectionChanged={handleSelectionChanged}
                  onSaveRow={handleSavingRow}
                  onEditorPreparing={handleEditorPreparing}
                  onEditRowChanges={handleEditRowChanges}
                  onDeleteRows={handleDeleteRows}
                  onEditRow={handleOnEditRow}
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
                  storeKey={"dealer-management-columns"}
                />
                <DealerPopupView
                  onEdit={handleEdit}
                  formSettings={formSettings}
                />
              </>
            )}
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
