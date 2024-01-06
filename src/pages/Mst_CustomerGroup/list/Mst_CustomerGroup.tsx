import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";
import { flagEditorOptionsSearch } from "@packages/common";
import { useConfiguration } from "@packages/hooks";
import { showErrorAtom } from "@packages/store";
import { FlagActiveEnum, Mst_CustomerGroupData } from "@packages/types";
import { GridViewPopup } from "@packages/ui/base-gridview";
import { useQuery } from "@tanstack/react-query";
import { IItemProps } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useSetAtom } from "jotai";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

import { HeaderPart } from "../components/header-part";
import {
  avatar,
  dataFormAtom,
  dataTableAtom,
  flagEdit,
  isLoadingAtom,
  selectedItemsAtom,
  showDetail,
  showPopup,
} from "../components/store";

import { useClientgateApi } from "@/packages/api";
import { useBankDealerGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";

import PermissionContainer, {
  checkPermision,
} from "@/components/PermissionContainer";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { PopupView } from "../components/popup-view";

export const Mst_CustomerGroupPage = () => {
  const { t } = useI18n("Mst_CustomerGroup");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setShowDetail = useSetAtom(showDetail);
  const setDataTable = useSetAtom(dataTableAtom);
  const setDataForm = useSetAtom(dataFormAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const setAvt = useSetAtom(avatar);
  const setFlag = useSetAtom(flagEdit);

  const [searchCondition] = useState<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    KeyWord: "",
  });
  const { data: listOrgID } = useQuery(
    ["listOrgID", JSON.stringify(searchCondition)],
    () => api.Mst_NNTController_GetAllActive()
  );

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["Mst_Customer", JSON.stringify(searchCondition)],
    () =>
      api.Mst_CustomerGroup_Search({
        ...searchCondition,
      })
  );

  const columns = useBankDealerGridColumns({
    data: data?.DataList || [],
    datalistOrgID: listOrgID?.Data?.Lst_Mst_NNT,
  });

  const formItems: IItemProps[] = [
    {
      caption: t("KeyWord"),
      label: {
        text: t("KeyWord"),
      },
      dataField: "KeyWord",
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Nhập tên, mã"),
      },
      visible: true,
    },
    {
      visible: true,
      dataField: "FlagActive",
      caption: t("FlagActive"),
      label: {
        text: t("FlagActive"),
      },
      editorType: "dxSelectBox",
      editorOptions: flagEditorOptionsSearch,
    },
  ];

  const handleDeleteRows = async (rows: any[]) => {
    if (rows?.length === 1) {
      const resp = await api.Mst_CustomerGroup_Delete(rows);
      if (resp.isSuccess) {
        toast.success(t("Delete Successfully"));
        await refetch();
      } else {
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
      }
    } else {
      const listDataDelete = rows.map((item: any) => ({
        CustomerGrpCode: item.CustomerGrpCode,
        OrgID: item.OrgID,
      }));
      const resp = await api.Mst_CustomerGroupData_DeleteMultiple(
        listDataDelete
      );
      if (resp.isSuccess) {
        toast.success(t("Delete Successfully"));
        await refetch();
      } else {
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
      }
    }
  };

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    setShowDetail(false);
    setAvt(undefined);
    setFlag(true);
    setDataTable([]);
    setDataForm([]);
    setPopupVisible(true);
  };

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    // console.log("handleToggleSearchPanel", gridRef?.instance);
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleCancel = () => {
    // console.log("cancel viewing item");
    gridRef.current?.instance?.cancelEditData();
  };
  const handleEdit = (rowIndex: number) => {
    gridRef.current?.instance?.editRow(rowIndex);
  };
  const handleSubmit = () => {
    gridRef.current?.instance?.saveEditData();
  };

  const handleEditorPreparing = (e: EditorPreparingEvent) => {
    // use this function to control how the editor looks like

    if (e.dataField) {
      if (["OrgID", "CustomerGrpCode"].includes(e.dataField!)) {
        e.editorOptions.readOnly = !e.row?.isNewRow;
      }
    }
  };

  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: t("Bank Dealer Information"),
    className: "bank-dealer-information-popup",
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
    datalistOrgID: listOrgID?.Data?.Lst_Mst_NNT ?? [],
  });

  const onModify = async (
    id: string,
    data: Partial<Mst_CustomerGroupData>
  ) => {};
  // Section: CRUD operations
  const onCreate = async (
    data: Mst_CustomerGroupData & { __KEY__: string }
  ) => {};

  const onCreateNew = async (
    data: Mst_CustomerGroupData & { __KEY__: string }
  ) => {
    const { __KEY__, ...rest } = data;
    if (
      data.OrgID !== "" &&
      data.CustomerGrpName !== "" &&
      data.CustomerGrpCode !== ""
    ) {
      const resp = await api.Mst_CustomerGroup_Create({
        ...rest,
        FlagActive: rest.FlagActive === "true" ? "1" : "0",
      });
      if (resp.isSuccess) {
        toast.success(t("Create Successfully"));
        setIsLoading(false);
        setPopupVisible(false);
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
    }
  };
  const onModifyNew = async (data: Mst_CustomerGroupData) => {
    if (
      data.OrgID !== "" &&
      data.CustomerGrpName !== "" &&
      data.CustomerGrpCode !== ""
    ) {
      const resp = await api.Mst_CustomerGroup_Update({
        ...data,
        FlagActive: data.FlagActive === "true" ? "1" : "0",
      });
      if (resp.isSuccess) {
        toast.success(t("Update Successfully"));
        setPopupVisible(false);
        setIsLoading(false);
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
    }
  };

  const onDelete = async (id: any) => {
    // const resp = await api.Mst_BankDealer_Delete(id);
    // if (resp.isSuccess) {
    //   toast.success(t("Delete Successfully"));
    //   await refetch();
    //   return true;
    // }
    // showError({
    //   message: (resp.errorCode),
    //   debugInfo: resp.debugInfo,
    //   errorInfo: resp.errorInfo,
    // });
    // throw new Error(resp._strErrCode);
  };
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
  const handleOnEditRow = async (e: any) => {
    setShowDetail(false);
    setFlag(false);
    setPopupVisible(true);
    const resp = await api.Mst_CustomerGroup_GetByCustomerGrpCode(
      e.row.data.CustomerGrpCode,
      e.row.data.OrgID
    );
    if (resp.isSuccess) {
      setAvt(resp?.Data?.CustomerGrpImage);
      setDataForm({
        ...resp.Data,
        FlagActive: resp.Data?.FlagActive === "1" ? true : false,
      });
    }
  };
  const handleEditRowChanges = () => {};
  return (
    <AdminContentLayout className={"Mst_CustomerGroup"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart
          onAddNew={handleAddNew}
          searchCondition={searchCondition}
        ></HeaderPart>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout searchPermissionCode="MNU_ADMIN_CUSTOMGRP_SEARCH">
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <PermissionContainer
              permission={"MNU_ADMIN_CUSTOMGRP_SEARCH"}
              children={
                <SearchPanelV2
                  storeKey="Mst_CustomerGroupr_Search"
                  conditionFields={formItems}
                  data={searchCondition}
                  onSearch={handleSearch}
                />
              }
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewPopup
              permissionEdit="MNU_ADMIN_CUSTOMGRP_UPDATE"
              permissionDelete="MNU_ADMIN_CUSTOMGRP_DELETE"
              permissionDeleteMulti="BTN_ADMIN_CUSTOMGRP_DELETEMULTI"
              isLoading={isLoading}
              dataSource={data?.isSuccess ? data.DataList ?? [] : []}
              columns={columns}
              keyExpr={["OrgID", "CustomerGrpCode"]}
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
                  visible: checkPermision("MNU_ADMIN_CUSTOMGRP_SEARCH"),
                  location: "before",
                  widget: "dxButton",
                  options: {
                    icon: "search",
                    onClick: handleToggleSearchPanel,
                  },
                },
              ]}
              storeKey={"Mst_Customer-Group-columns"}
            />
            <PopupView
              onCreate={onCreateNew}
              onEdit={onModifyNew}
              formSettings={formSettings}
              title={t("Mst_CustomerGroup")}
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
