import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useClientgateApi } from "@packages/api";
import { useRef, useState } from "react";

import { PopupViewDetail } from "@/pages/Sys_Group/components";
import { HeaderPart } from "@/pages/Sys_Group/components/header-part";
import {
  dataEticketAtom,
  dataFormAtom,
  dataFuntionAtom,
  dataTableUserAtom,
  flagDetail,
  flagEdit,
  isLoadingAtom,
  selectedItemsAtom,
  showDetail,
  showInfoObjAtom,
} from "@/pages/Sys_Group/components/store";
import { searchPanelVisibleAtom } from "@layouts/content-searchpanel-layout";
import { useConfiguration, useVisibilityControl } from "@packages/hooks";
import { showErrorAtom } from "@packages/store";
import { FlagActiveEnum, Mst_Dealer, SearchParam } from "@packages/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useSetAtom } from "jotai";
import { toast } from "react-toastify";
import "./Sys_Group.scss";

import { useAuth } from "@/packages/contexts/auth";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { DataGrid } from "devextreme-react";
import { showPopup } from "../components/store";
import { useDepartMentGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";

export const Sys_GroupPage = () => {
  const { t } = useI18n("Sys_Group");
  let gridRef: any = useRef<DataGrid | null>(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setShowDetail = useSetAtom(showDetail);
  const setDataTable = useSetAtom(dataTableUserAtom);
  const setDataForm = useSetAtom(dataFormAtom);
  const setDataEticket = useSetAtom(dataEticketAtom);
  const setDataFuntion = useSetAtom(dataFuntionAtom);
  const setFlag = useSetAtom(flagEdit);
  const setShowInfoObj = useSetAtom(showInfoObjAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const setFlagDetail = useSetAtom(flagDetail);

  const [searchCondition, setSearchCondition] = useState<SearchParam>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    KeyWord: "",
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["Sys_GroupPage", JSON.stringify(searchCondition)],
    () =>
      api.Sys_GroupController_Search({
        ...searchCondition,
      }) as any
  );

  const { data: listUser } = useQuery(["listUser"], () =>
    api.Sys_User_GetAllActive()
  );
  const { data: company } = useQuery(["company"], () =>
    api.Mst_NNTController_GetOrgCode(auth?.orgData?.Id)
  );

  const columns = useDepartMentGridColumns({ data: data?.DataList });
  const formSettings = useFormSettings({ data: listUser?.DataList });

  const handleSelectionChanged = (rows: string[]) => {
    // console.log("row ", rows)
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    setIsLoading(true);
    setShowInfoObj(true);
    setFlag(true);
    setDataTable([]);
    setDataForm([]);
    setPopupVisible(true);
    setShowDetail(false);
    setFlagDetail("Addnew");
    // setDataEticket({});
    // gridRef.current?._instance?.addRow();
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

  const handleOnEditRow = async (e: any) => {
    setFlagDetail("Edit");
    setIsLoading(true);
    setShowInfoObj(false);
    setFlag(false);
    setShowDetail(false);
    const resp = await api.Sys_GroupController_GetByGroupCode(
      e.row.data.GroupCode
    );
    if (resp.isSuccess) {
      setIsLoading(false);
      setDataEticket({
        ...resp?.Data?.Lst_Sys_AbilityViewEticket[0],
        FlagViewUserAction: true,
        FlagViewDepartment:
          resp?.Data?.Lst_Sys_AbilityViewEticket[0]?.FlagViewDepartment === "1"
            ? true
            : false,
        FlagViewCompany:
          resp?.Data?.Lst_Sys_AbilityViewEticket[0]?.FlagViewCompany === "1"
            ? true
            : false,
        FlagViewAll:
          resp?.Data?.Lst_Sys_AbilityViewEticket[0]?.FlagViewAll === "1"
            ? true
            : false,
      });
      setDataTable(
        resp?.Data?.Lst_Sys_UserInGroup?.map((item: any) => {
          return {
            EMail: item.UserCode,
            UserName: item.su_UserName,
            PhoneNo: item.PhoneNo,
            UserCode: item.UserCode,
          };
        })
      );
      setDataForm({
        ...resp.Data?.Sys_Group,
        FlagActive: resp.Data?.Sys_Group.FlagActive === "1" ? true : false,
      });
      setDataFuntion(resp.Data?.Lst_Sys_Access);
    }
    setPopupVisible(true);
  };

  const onModify = (id: string, data: Mst_Dealer) => {};
  const onCreate = (data: any) => {};
  const onModifyNew = async (data: any) => {
    if (data.GroupCode !== "" && data.GroupName !== "") {
      const resp = await api.Sys_Access_Update({
        ...data,
        FlagActive: data.FlagActive === "true" ? "1" : "0",
      });
      if (resp.isSuccess) {
        setPopupVisible(false);
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
    }
  };
  // Section: CRUD operations

  const onCreateNew = async (data: any & { __KEY__: string }) => {
    if (data.GroupCode !== "" && data.GroupName !== "") {
      const resp = await api.Sys_Access_Create({
        ...data,
        FlagActive: data.FlagActive === "true" ? "1" : "0",
      });
      if (resp.isSuccess) {
        setPopupVisible(false);
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
    }
  };
  const onDelete = async (id: string) => {};
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

  const loadingControl = useVisibilityControl({ defaultVisible: false });
  const handleDeleteRows = async (ids: any) => {
    const resp = await api.Sys_Access_Delete(ids.row.data.GroupCode);

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
    <AdminContentLayout className={"Sys_Group"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart onAddNew={handleAddNew}></HeaderPart>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <GridViewCustomize
          isShowEditting={true}
          permissionEdit="BTN_ADMIN_SYSGRP_UPDATE"
          permissionDelete="BTN_ADMIN_SYSGRP_DELETE"
          isLoading={isLoading}
          dataSource={data?.isSuccess ? data.DataList ?? [] : []}
          columns={columns}
          keyExpr={"GroupCode"}
          onReady={(ref) => (gridRef = ref)}
          allowSelection={true}
          onSelectionChanged={handleSelectionChanged}
          onSaveRow={handleSavingRow}
          onEditorPreparing={handleEditorPreparing}
          onEditRowChanges={handleEditRowChanges}
          onDeleteRows={handleDeleteRows}
          onEditRow={handleOnEditRow}
          storeKey={"Sys_Group-control-columns"}
        />
        <PopupViewDetail
          onEdit={onModifyNew}
          formSettings={formSettings}
          onCreate={onCreateNew}
          title={t("SysGroup Control Information")}
          isLoadingData={isLoading}
        />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
