import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useClientgateApi } from "@packages/api";
import { useRef, useState } from "react";

import { DepartMentControlPopupView } from "@/pages/Department_Control/components";
import { HeaderPart } from "@/pages/Department_Control/components/header-part";
import {
  UserAutoAssignTicketAtom,
  dataFormAtom,
  dataTableUserAtom,
  flagDetail,
  flagEdit,
  selectedItemsAtom,
  showDetail,
} from "@/pages/Department_Control/components/store";
import { useConfiguration } from "@packages/hooks";
import { authAtom, showErrorAtom } from "@packages/store";
import { FlagActiveEnum, SearchParam } from "@packages/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "react-toastify";
import "./Department_Control.scss";

import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { DataGrid } from "devextreme-react";
import { uniqBy } from "lodash-es";
import { showPopup } from "../components/store";
import { useDepartMentGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";

export const Department_ControlPage = () => {
  const { t } = useI18n("Department_Control");
  const queryClient = useQueryClient();
  let gridRef: any = useRef<DataGrid | null>(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setShowDetail = useSetAtom(showDetail);
  const setDataTable = useSetAtom(dataTableUserAtom);
  const setDataForm = useSetAtom(dataFormAtom);
  const setFlag = useSetAtom(flagEdit);
  const setUserAutoAssignTicket = useSetAtom(UserAutoAssignTicketAtom);
  const setFlagDetail = useSetAtom(flagDetail);
  const [searchCondition, setSearchCondition] = useState<SearchParam>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    KeyWord: "",
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);
  const auth = useAtomValue(authAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["Department_Control", JSON.stringify(searchCondition)],
    () =>
      api.Mst_DepartmentControl_Search({
        ...searchCondition,
      }) as any
  );
  const { data: listUser, isLoading: isLoadinglistUser } = useQuery(
    ["listUser"],
    () => api.Sys_User_GetAllActive()
  );
  const { data: listDepartmentOrgID, isLoading: isLoadinglistDepartmentOrgID } =
    useQuery(["listDepartmentOrgID"], () =>
      api.Mst_DepartmentControl_GetByOrgID(auth.orgId.toString())
    );

  const columns = useDepartMentGridColumns({ data: data?.DataList });
  const formSettings = useFormSettings({
    data: listUser?.DataList,
    listDepartmentControl: listDepartmentOrgID?.Data?.Lst_Mst_Department as any,
  });

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    setDataTable([]);
    setDataForm({});
    setShowDetail(false);
    setPopupVisible(true);
    setFlag(true);
    setFlagDetail("Addnew");
    // gridRef.current?._instance?.addRow();
  };

  // toggle search panel
  const handleEditorPreparing = (e: EditorPreparingEvent) => {
    // use this function to control how the editor looks like
  };

  const handleOnEditRow = async (DepartmentCode: any) => {
    setFlagDetail("Edit");
    const resp = await api.Mst_DepartmentControl_GetByDepartmentCode(
      DepartmentCode
    );
    if (resp.isSuccess) {
      setDataForm({
        ...resp.Data?.Mst_Department,
        FlagActive: resp.Data?.Mst_Department.FlagActive === "1" ? true : false,
      });
      setDataTable(
        resp?.Data?.Lst_Sys_UserMapDepartment.map((item: any) => {
          return {
            UserCode: item.UserCode,
            UserName: item.FullName,
            EMail: item.Email,
            PhoneNo: item.PhoneNo,
            OrgID: item.OrgID,
          };
        })
      );

      setUserAutoAssignTicket(
        resp?.Data?.Lst_Sys_UserAutoAssignTicket?.map((item: any) => {
          return {
            ...item,
            UserName: item?.su_UserName,
          };
        })
      );
    }
    setFlag(false);
    setShowDetail(false);
    setPopupVisible(true);
  };

  const onModifyNew = async (data: any) => {
    if (
      data.Mst_Department.DepartmentCode !== "" &&
      data.Mst_Department.DepartmentName !== ""
    ) {
      const resp = await api.Mst_DepartmentControl_Update({
        ...data,
      });
      if (resp.isSuccess) {
        queryClient.refetchQueries({
          queryKey: ["listDepartmentOrgID"],
          exact: true,
        });
        queryClient.refetchQueries({
          queryKey: ["listDepartMent"],
          exact: true,
        });
        toast.success(t("Update Successfully"));
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

  const onCreateNew = async (data: any & { __KEY__: string }) => {
    if (
      data.Mst_Department.DepartmentCode !== "" &&
      data.Mst_Department.DepartmentName !== ""
    ) {
      const resp = await api.Mst_DepartmentControl_Create({
        ...data,
      });

      if (resp.isSuccess) {
        await refetch();
        setPopupVisible(false);
        queryClient.refetchQueries({
          queryKey: ["listDepartmentOrgID"],
          exact: true,
        });
        queryClient.refetchQueries({
          queryKey: ["listDepartMent"],
          exact: true,
        });
        toast.success(t("Create Successfully"));
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
  const onModify = (data: any, id: any) => {};
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

  const handleDeleteRows = async (rows: any) => {
    // loadingControl.open();
    const dataDelete = {
      DepartmentCode: rows[0].DepartmentCode,
      OrgID: rows[0].OrgID,
    };
    if (rows[0].su_QtyUser === 0) {
      const resp = await api.Mst_DepartmentControl_Delete(dataDelete);
      // loadingControl.close();
      if (resp.isSuccess) {
        queryClient.refetchQueries({
          queryKey: ["listDepartmentOrgID"],
          exact: true,
        });
        queryClient.refetchQueries({
          queryKey: ["listDepartMent"],
          exact: true,
        });
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
    } else {
      toast.warning("Phòng ban vẫn còn thành viên");
    }
  };
  const handleEditRowChanges = () => {};
  const handleDeleteRowsOld = () => {};
  const handleOnEditRowOld = () => {};

  const GridComponent = () => {
    if (isLoading || isLoadinglistUser || isLoadinglistDepartmentOrgID) {
      return null;
    } else {
      return (
        <GridViewCustomize
          isLoading={false}
          dataSource={uniqBy(
            data?.DataList?.filter(
              (item: any) => item.OrgID === auth.orgId.toString()
            ) ?? [],
            "DepartmentCode"
          )}
          columns={columns}
          keyExpr={["DepartmentCode"]}
          formSettings={formSettings}
          onReady={(ref) => (gridRef = ref)}
          allowSelection={true}
          onSelectionChanged={handleSelectionChanged}
          onSaveRow={handleSavingRow}
          onEditorPreparing={handleEditorPreparing}
          onEditRowChanges={handleEditRowChanges}
          onDeleteRows={handleDeleteRowsOld}
          onEditRow={handleOnEditRowOld}
          storeKey={"department-control-columns"}
          isShowEditting={false}
          customToolbarItems={[
            {
              text: t("Update"),
              shouldShow: (ref: any) => {
                return ref.instance.getSelectedRowKeys().length === 1;
              },
              permissionCode: "BTN_ADMIN_DEPARTMENTCONTROL_UPDATE",
              onClick: (e: any, ref: any) => {
                const selectedRow = ref.instance.getSelectedRowsData();
                handleOnEditRow(selectedRow[0].DepartmentCode);
              },
            },
            {
              text: t("Delete"),
              shouldShow: (ref: any) => {
                return ref.instance.getSelectedRowKeys().length === 1;
              },
              permissionCode: "BTN_ADMIN_DEPARTMENTCONTROL_DELETE",
              onClick: (e: any, ref: any) => {
                const selectedRow = ref.instance.getSelectedRowsData();
                handleDeleteRows(selectedRow);
              },
            },
          ]}
          isSingleSelection
        />
      );
    }
  };

  return (
    <AdminContentLayout className={"Department_Control"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart onAddNew={handleAddNew}></HeaderPart>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        {GridComponent()}
        <DepartMentControlPopupView
          onEdit={onModifyNew}
          formSettings={formSettings}
          onCreate={onCreateNew}
          title={t("DepartMent Control Information")}
        />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
