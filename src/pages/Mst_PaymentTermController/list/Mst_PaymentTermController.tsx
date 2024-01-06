import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";
import { flagEditorOptionsSearch } from "@packages/common";
import { useConfiguration } from "@packages/hooks";
import { showErrorAtom } from "@packages/store";
import { FlagActiveEnum, Mst_PaymentTermData } from "@packages/types";
import { GridViewPopup } from "@packages/ui/base-gridview";
import { useQuery } from "@tanstack/react-query";
import { IItemProps } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useSetAtom } from "jotai";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

import { HeaderPart } from "../components/header-part";
import { selectedItemsAtom } from "../components/store";

import PermissionContainer, {
  checkPermision,
} from "@/components/PermissionContainer";
import { useClientgateApi } from "@/packages/api";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { useBankDealerGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";
import { PopupViewComponent } from "../components/use-popup-view";

export const Mst_PaymentTermControllerPage = () => {
  const { t } = useI18n("Mst_PaymentTermController");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);

  const [searchCondition] = useState<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    KeyWord: "",
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["Mst_PaymentTermController", JSON.stringify(searchCondition)],
    () =>
      api.Mst_PaymentTermController_Search({
        ...searchCondition,
      })
  );
  const { data: listOrgID } = useQuery(
    ["listOrgID", JSON.stringify(searchCondition)],
    () => api.Mst_NNTController_GetAllActive()
  );

  const columns = useBankDealerGridColumns({
    data: data?.DataList || [],
    datalistOrgID: listOrgID?.Data?.Lst_Mst_NNT,
  });

  const formItems: IItemProps[] = [
    {
      caption: t("KeyWord"),
      dataField: "KeyWord",
      label: {
        text: t("KeyWord"),
      },
      visible: true,
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Nhập tên, mã"),
      },
    },
    {
      dataField: "FlagActive",
      caption: t("FlagActive"),
      label: {
        text: t("FlagActive"),
      },
      visible: true,
      editorType: "dxSelectBox",
      editorOptions: flagEditorOptionsSearch,
    },
  ];

  const handleDeleteRows = async (rows: any[]) => {
    if (rows?.length === 1) {
      const resp = await api.Mst_PaymentTermController_Delete(rows);
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
        PaymentTermCode: item.PaymentTermCode,
        OrgID: item.OrgID,
      }));
      const resp = await api.Mst_PaymentTermController_DeleteMulti(
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
    gridRef.current.instance.addRow();
  };

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    console.log("handleToggleSearchPanel", gridRef?.instance);
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
      if (["OrgID", "PaymentTermCode"].includes(e.dataField!)) {
        e.editorOptions.readOnly = !e.row?.isNewRow;
      }
      if (e.dataField === "FlagActive") {
        if (e.row?.isNewRow) {
          e.editorOptions.value = true;
          e.row.data.FlagActive = true;
        } else {
          e.editorOptions.value =
            e.row?.data.FlagActive === true ? true : false;
        }
      }
    }
  };

  const popupSettings: IPopupOptions = {
    showTitle: true,
    height: "auto",
    title: t("Mst_PaymentTermController Information"),
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
  });

  const onModify = async (id: any, data: Partial<any>) => {
    const resp = await api.Mst_PaymentTermController_Update({
      ...id,
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
  const onCreate = async (data: Mst_PaymentTermData & { __KEY__: string }) => {
    const { __KEY__, ...rest } = data;
    // console.log(230, data);
    const resp = await api.Mst_PaymentTermController_Create({
      ...rest,
      FlagActive:
        rest.FlagActive !== undefined
          ? rest.FlagActive === true
            ? "1"
            : "0"
          : "1",
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
  const handleOnEditRow = (e: any) => {
    const { row, column } = e;
    handleEdit(row.rowIndex);
  };
  const handleEditRowChanges = () => {};
  return (
    <AdminContentLayout className={"Mst_PaymentTermController"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart
          onAddNew={handleAddNew}
          searchCondition={searchCondition}
        ></HeaderPart>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout searchPermissionCode="MNU_ADMIN_PAYMENTTERM_SEARCH">
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <PermissionContainer
              permission={"MNU_ADMIN_PAYMENTTERM_SEARCH"}
              children={
                <SearchPanelV2
                  storeKey="Mst_PaymentTermController_Search"
                  conditionFields={formItems}
                  data={searchCondition}
                  onSearch={handleSearch}
                />
              }
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewPopup
              permissionEdit="MNU_ADMIN_PAYMENTTERM_UPDATE"
              permissionDelete="MNU_ADMIN_PAYMENTTERM_DELETE"
              permissionDeleteMulti="BTN_ADMIN_PAYMENTTERM_DELETEMULTI"
              isLoading={isLoading}
              dataSource={data?.isSuccess ? data.DataList ?? [] : []}
              columns={columns}
              keyExpr={[
                "PaymentTermCode",
                "OrgID",
                "PTType",
                "PTDesc",
                "PaymentTermName",
                "FlagActive",
                "OwedDay",
                "CreditLimit",
                "DepositPercent",
                "Remark",
              ]}
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
                  visible: checkPermision("MNU_ADMIN_PAYMENTTERM_SEARCH"),
                  options: {
                    icon: "search",
                    onClick: handleToggleSearchPanel,
                  },
                },
              ]}
              storeKey={"Mst_Payment-Term-Controller-columns"}
            />
            <PopupViewComponent
              onEdit={handleEdit}
              formSettings={formSettings}
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
