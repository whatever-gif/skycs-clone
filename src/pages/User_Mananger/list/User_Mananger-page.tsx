import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useClientgateApi } from "@packages/api";
import { useEffect, useRef } from "react";

import { PopupView } from "@/pages/User_Mananger/components";
import {
  avatar,
  dataFormAtom,
  dataGridAtom,
  dataTableAtom,
  flagEdit,
  isLoadingAtom,
  keywordAtom,
  selectedItemsAtom,
  showDetail,
} from "@/pages/User_Mananger/components/store";

import { searchPanelVisibleAtom } from "@layouts/content-searchpanel-layout";
import { useConfiguration, useVisibilityControl } from "@packages/hooks";
import { authAtom, showErrorAtom } from "@packages/store";
import { FlagActiveEnum, Mst_Dealer, SysUserData } from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useAtomValue, useSetAtom } from "jotai";
import "./User_Mananger.scss";

import { DataGrid } from "devextreme-react";
import { useDealerGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";

import { checkPermision } from "@/components/PermissionContainer";
import { callApi } from "@/packages/api/call-api";
import { PageHeaderLayout } from "@/packages/layouts/page-header-layout";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { showPopup } from "@/pages/User_Mananger/components/store";
import { toast } from "react-toastify";
import { HeaderPart } from "../components/header-part";

export const UserManangerPage = () => {
  const { t } = useI18n("User_Mananger");
  let gridRef: any = useRef<DataGrid | null>(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setShowDetail = useSetAtom(showDetail);
  const setDataTable = useSetAtom(dataTableAtom);
  const setDataForm = useSetAtom(dataFormAtom);
  const setFlag = useSetAtom(flagEdit);
  const setAvt = useSetAtom(avatar);
  const keyword = useAtomValue(keywordAtom);
  const setSelectedItems = useSetAtom(selectedItemsAtom);
  const setDataGrid = useSetAtom(dataGridAtom);
  const auth = useAtomValue(authAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const api = useClientgateApi();
  const { data, isLoading, refetch } = useQuery(
    ["User_Mananger", keyword],
    () =>
      api.Sys_User_Search({
        FlagActive: FlagActiveEnum.All,
        Ft_PageIndex: 0,
        Ft_PageSize: config.MAX_PAGE_ITEMS,
        UserName: "",
        EMail: "",
        UserCode: "",
        PhoneNo: "",
        KeyWord: keyword,
      }) as any
  );

  useEffect(() => {
    if (data) {
      callApi.getOrgAgentList(auth.networkId).then((resp) => {
        const dataGridFormat = data?.DataList?.filter((item: any) => {
          const userCode = item.UserCode;
          return userCode;
        })?.map((item: any, index: any) => {
          const matchedUser = resp?.Data?.find(
            (user: any) => user.Email.toLowerCase() === item.EMail.toLowerCase()
          );
          const Ext = matchedUser
            ? matchedUser.Alias
            : index ===
              data?.DataList?.filter((item: any) => {
                const userCode = item.UserCode;
                return userCode;
              })?.length -
                1
            ? ""
            : "";
          return {
            ...item,
            UserCode: item.EMail.toUpperCase(),
            UserName: item.UserName,
            EMail: item.EMail.toLowerCase(),
            Extension: Ext,
          };
        });
        setDataGrid(dataGridFormat ?? []);
      });
    }
  }, [data]);

  const { data: listMST } = useQuery(["listMST"], () =>
    api.Mst_NNTController_GetAllActive()
  );
  const { data: listDepartMent } = useQuery(["listDepartMent"], () =>
    api.Mst_DepartmentControl_GetAllActive()
  );
  const { data: listGroup } = useQuery(["listGroup"], () =>
    api.Sys_GroupController_GetAllActive()
  );
  const { data: dataMST } = useQuery(
    ["MSTController"],
    () => api.Mst_NNTController_GetOrgCode(auth.orgId.toString()) as any
  );
  const columns = useDealerGridColumns({ data: data?.DataList });
  const formSettings = useFormSettings({
    dataMST: listMST?.Data?.Lst_Mst_NNT,
    dataListDepartment: listDepartMent?.DataList,
    dataListGroup: listGroup?.DataList,
  });

  const handleSelectionChanged = (rows: string[]) => {
    // console.log("selection change");
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    setShowDetail(false);
    setAvt(undefined);
    setFlag(true);
    setDataTable([]);
    setDataForm({
      UserName: "",
      ACTimeZone: "7",
      ACLanguage: "vi",
      MST: dataMST?.Data?.MST,
    });

    setPopupVisible(true);
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
    // if (["DealerCode", "DealerType", "ProvinceCode"].includes(e.dataField!)) {
    //   e.editorOptions.readOnly = !e.row?.isNewRow;
    // } else if (e.dataField === "FlagActive") {
    //   e.editorOptions.value = true;
    // } else if (["FlagDirect", "FlagTCG"].includes(e.dataField!)) {
    //   e.editorOptions.value = "0";
    // }
  };
  const handleOnEditRow = async (e: any) => {
    setShowDetail(false);
    setFlag(false);
    setPopupVisible(true);
    const resp = await api.Sys_User_Data_GetByUserCode(e);
    if (resp.isSuccess) {
      const { GroupName, DepartmentName, DepartmentCode, ...updatedData } =
        resp.Data?.Lst_Sys_User;
      setAvt(resp?.Data?.Lst_Sys_User.Avatar);
      setDataForm({
        ...updatedData,
        FlagNNTAdmin: updatedData?.FlagNNTAdmin === "1" ? true : false,
        FlagActive: updatedData?.FlagActive === "1" ? true : false,
        FlagSysAdmin: updatedData?.FlagSysAdmin === "1" ? true : false,
        DepartmentName: resp.Data?.Lst_Sys_UserMapDepartment.map(
          (item: any) => item.DepartmentCode
        ),
        GroupName: resp.Data?.Lst_Sys_UserInGroup.map(
          (item: any) => item.GroupCode
        ),
        ReUserPassword: updatedData.UserPassword,
      });
    }
  };

  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: t("Department_Control Information"),
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

  const onModifyNew = async (data: SysUserData) => {
    const { GroupName, DepartmentName, DepartmentCode, ...updatedData } =
      data as any;
    const resp = await api.Sys_User_Data_GetByUserCode(updatedData.UserCode);
    const isSame =
      JSON.stringify(updatedData) ===
      JSON.stringify({
        EMail: resp.Data?.Lst_Sys_User.EMail,
        UserName: resp.Data?.Lst_Sys_User.UserName,
        PhoneNo: resp.Data?.Lst_Sys_User.PhoneNo,
        ACLanguage: resp.Data?.Lst_Sys_User.ACLanguage,
        ACTimeZone: resp.Data?.Lst_Sys_User.ACTimeZone,
        MST: resp.Data?.Lst_Sys_User.MST,
        FlagSysAdmin:
          resp.Data?.Lst_Sys_User.FlagSysAdmin === "1" ? "true" : "false",
        FlagActive:
          resp.Data?.Lst_Sys_User.FlagActive === "1" ? "true" : "false",
        FlagNNTAdmin:
          resp.Data?.Lst_Sys_User.FlagNNTAdmin === "1" ? "true" : "false",
        Avatar: resp.Data?.Lst_Sys_User.Avatar,
        UserPassword: resp.Data?.Lst_Sys_User.UserPassword,
        UserCode: resp.Data?.Lst_Sys_User.EMail,
        Lst_Sys_UserMapDepartment: resp.Data?.Lst_Sys_UserMapDepartment.map(
          (item: any) => ({
            UserCode: resp.Data?.Lst_Sys_User.EMail,
            DepartmentCode: item.DepartmentCode,
          })
        ),
        Lst_Sys_UserInGroup: resp.Data?.Lst_Sys_UserInGroup.map(
          (item: any) => ({
            UserCode: resp.Data?.Lst_Sys_User.EMail,
            GroupCode: item.GroupCode,
          })
        ),
      });
    if (!isSame && updatedData.EMail !== "" && updatedData.UserCode !== "") {
      const resp = await api.Sys_User_Update({
        ...updatedData,
        FlagNNTAdmin: updatedData.FlagNNTAdmin === "true" ? "1" : "0",
        FlagSysAdmin: updatedData.FlagSysAdmin === "true" ? "1" : "0",
        FlagActive: updatedData.FlagActive === "true" ? "1" : "0",
      });
      if (resp.isSuccess) {
        toast.success(t("Update Successfully"));
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
  // Section: CRUD operations
  const onCreateNew = async (
    data: SysUserData & { __KEY__: string },
    exist: boolean
  ) => {
    const { __KEY__, ...rest } = data;
    if (
      (data.EMail !== "" &&
        data.UserCode !== "" &&
        data.UserPassword !== "" &&
        data.ReUserPassword !== "" &&
        data.ReUserPassword === data.UserPassword) ||
      exist
    ) {
      const resp = await api.Sys_User_Create(
        {
          ...rest,
          FlagNNTAdmin: rest.FlagNNTAdmin === "true" ? "1" : "0",
          FlagSysAdmin: rest.FlagSysAdmin === "true" ? "1" : "0",
          FlagActive: "1",
        },
        exist
      );
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
    } else {
      toast.warning(t("Password không khớp, vui lòng kiểm tra lại"));
    }
  };
  const onDelete = async (id: string) => {
    // const resp = await api.Mst_Dealer_Delete(id);
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
  const onCreate = (data: any) => {};
  const onModify = (id: string, data: Mst_Dealer) => {};
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

  const handleEditRowChanges = () => {};

  const loadingControl = useVisibilityControl({ defaultVisible: false });
  const handleDeleteRows = async (ids: any) => {
    const resp = await api.Sys_User_Data_Delete(ids);
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
  const handleUploadFile = () => {};
  const handleDownloadTemplate = () => {};
  const handleDeleteRowsOld = () => {};
  const handleOnEditRowOld = () => {};

  return (
    <AdminContentLayout className={"User_Mananger"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderLayout>
          <PageHeaderLayout.Slot name={"Before"}>
            <div className="text-header font-bold dx-font-m">
              {t("User Manager")}
            </div>
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"Center"}>
            <HeaderPart
              refetch={refetch}
              onAddNew={handleAddNew}
              handleOnEditRow={handleOnEditRow}
            />
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"After"}></PageHeaderLayout.Slot>
        </PageHeaderLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        {/* const output = input.filter(item => item.UserCode !== null || item.UserName !== null); */}
        <GridViewCustomize
          isLoading={isLoading}
          dataSource={data ? data.DataList : []}
          columns={columns}
          keyExpr={"UserCode"}
          popupSettings={popupSettings}
          formSettings={formSettings.formSettings}
          onReady={(ref) => (gridRef = ref)}
          allowSelection={true}
          onSelectionChanged={handleSelectionChanged}
          onSaveRow={handleSavingRow}
          onEditorPreparing={handleEditorPreparing}
          onEditRowChanges={handleEditRowChanges}
          onDeleteRows={handleDeleteRowsOld}
          onEditRow={handleOnEditRowOld}
          storeKey={"User-Manager-columns"}
          isSingleSelection
          customToolbarItems={[
            {
              text: t("Update"),
              shouldShow: (ref: any) => {
                const check = checkPermision("BTN_ADMIN_USERMANAGER_UPDATE");

                return ref.instance.getSelectedRowKeys().length === 1 && check;
              },
              onClick: (e: any, ref: any) => {
                const selectedRow = ref.instance.getSelectedRowsData();
                handleOnEditRow(selectedRow[0].UserCode);
              },
            },
            {
              text: t("Delete"),
              shouldShow: (ref: any) => {
                const check = checkPermision("BTN_ADMIN_USERMANAGER_DELETE");

                return ref.instance.getSelectedRowKeys().length === 1 && check;
              },
              onClick: (e: any, ref: any) => {
                const selectedRow = ref.instance.getSelectedRowsData();
                handleDeleteRows(selectedRow[0].UserCode);
              },
            },
          ]}
          toolbarItems={[]}
        />
        <PopupView
          onCreate={onCreateNew}
          onEdit={onModifyNew}
          formSettings={formSettings}
          title={t("User Manager")}
        />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
