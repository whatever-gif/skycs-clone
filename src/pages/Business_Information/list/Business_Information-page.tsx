import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useClientgateApi } from "@packages/api";
import { useEffect, useRef, useState } from "react";

import { HeaderPart, PopupView } from "@/pages/Business_Information/components";

import { searchPanelVisibleAtom } from "@layouts/content-searchpanel-layout";
import { useConfiguration, useVisibilityControl } from "@packages/hooks";
import { authAtom, showErrorAtom } from "@packages/store";
import {
  FlagActiveEnum,
  Mst_Dealer,
  Mst_NNTController,
  SearchParam,
} from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useAtomValue, useSetAtom } from "jotai";
import "./Business_Information.scss";

import { DataGrid } from "devextreme-react";
import { useDealerGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";

import { PageHeaderLayout } from "@/packages/layouts/page-header-layout";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import {
  activeInputAtom,
  dataFormAtom,
  dataTableAtom,
  flagEdit,
  keywordAtom,
  readOnly,
  selectedItemsAtom,
  showDetail,
  showPopup,
} from "@/pages/Business_Information/components/store";
import { toast } from "react-toastify";

export const Business_InformationPage = () => {
  const { t } = useI18n("Business_Information");

  let gridRef: any = useRef<DataGrid | null>(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const keyword = useAtomValue(keywordAtom);
  const setShowDetail = useSetAtom(showDetail);
  const setDataTable = useSetAtom(dataTableAtom);
  const setDataForm = useSetAtom(dataFormAtom);
  const setFlag = useSetAtom(flagEdit);
  const setReadOnly = useSetAtom(readOnly);
  const setActiveInput = useSetAtom(activeInputAtom);
  const formRef = useRef<any>();
  const auth = useAtomValue(authAtom);
  // console.log(65, auth);
  const [dataChangeOrgID, setDataChangeOrgID] = useState([]);
  const setSelectedItems = useSetAtom(selectedItemsAtom);
  const [dataGrid, setDataGrid] = useState<any>([]);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["Business_Information", keyword],
    () =>
      api.Mst_NNTController_Search({
        KeyWord: keyword,
        FlagActive: FlagActiveEnum.All,
        Ft_PageIndex: 0,
        Ft_PageSize: config.MAX_PAGE_ITEMS,
      } as SearchParam),
    {}
  );
  useEffect(() => {
    if (data && data.isSuccess) {
      setDataGrid(data?.DataList);
    } else if (!!data && !data.isSuccess) {
      showError({
        message: data._strErrCode,
        _strErrCode: data._strErrCode,
        _strTId: data._strTId,
        _strAppTId: data._strAppTId,
        _objTTime: data._objTTime,
        _strType: data._strType,
        _dicDebug: data._dicDebug,
        _dicExcs: data._dicExcs,
      });
    }
  }, [data]);
  const { data: listNNT } = useQuery(["listNNT"], () =>
    api.Mst_NNTController_GetAllActive()
  );
  const { data: listProvince } = useQuery(["listProvince"], () =>
    api.Mst_Province_GetAllActive()
  );
  const { data: listOrgID } = useQuery(["listOrgID"], () =>
    api.MstOrg_GetOrgsNotInSolution()
  );
  useEffect(() => {
    if (listOrgID) {
      setDataChangeOrgID(
        listOrgID?.Data?.Lst_Mst_Org?.map((item: any) => {
          return {
            ...item,
            OrgID: item.Id.toString(),
            Id: item.Id.toString(),
          };
        })
      );
    }
  }, [listOrgID]);

  const formSettings = useFormSettings({
    dataNNT: listNNT?.DataList,
    dataProvince: listProvince?.DataList,
    dataOrgID: listOrgID?.Data?.Lst_Mst_Org,
  });
  const columns = useDealerGridColumns({
    data: data?.DataList,
    dataOrgID: dataChangeOrgID,
  });

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    setFlag(true);
    setDataTable([]);
    setDataForm({ FlagActive: true });
    setShowDetail(false);
    setReadOnly(true);
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
    if (["DealerCode", "DealerType", "ProvinceCode"].includes(e.dataField!)) {
      e.editorOptions.readOnly = !e.row?.isNewRow;
    } else if (e.dataField === "FlagActive") {
      e.editorOptions.value = true;
    } else if (["FlagDirect", "FlagTCG"].includes(e.dataField!)) {
      e.editorOptions.value = "0";
    }
  };
  const handleOnEditRow = async (e: any) => {
    setFlag(false);
    setReadOnly(false);
    setActiveInput(true);
    const resp = await api.Mst_NNTController_GetNNTCode(e);
    if (resp.isSuccess) {
      setDataForm({
        ...resp.Data,
        FlagActive: resp.Data?.FlagActive === "1" ? true : false,
      });
    }

    console.log(resp);
    setShowDetail(false);
    setPopupVisible(true);
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

  const onModifyNew = async (data: any) => {
    const resp = await api.Mst_NNTController_GetNNTCode(data.MST);

    const isSame =
      JSON.stringify(data) ===
      JSON.stringify({
        OrgID: resp?.Data?.OrgID ?? "",
        NNTFullName: resp?.Data?.NNTFullName ?? "",
        MST: resp?.Data?.MST ?? "",
        NNTShortName: resp?.Data?.NNTShortName ?? "",
        PresentBy: resp?.Data?.PresentBy ?? "",
        NNTPosition: resp?.Data?.NNTPosition ?? "",
        Website: resp?.Data?.Website ?? "",
        ProvinceCode: resp?.Data?.ProvinceCode ?? "",
        NNTAddress: resp?.Data?.NNTAddress ?? "",
        ContactName: resp?.Data?.ContactName ?? "",
        ContactPhone: resp?.Data?.ContactPhone ?? "",
        ContactEmail: resp?.Data?.ContactEmail ?? "",
        FlagActive: resp?.Data?.FlagActive === "1" ? "true" : "false",
      });
    if (data.invalidate === true && isSame === false) {
      delete data.invalidate;
      const resp = await api.Mst_NNTController_Update({
        ...data,
        FlagActive: data.FlagActive === "true" ? "1" : "0",
      });
      if (resp.isSuccess) {
        // dataGrid.current?.instance.deselectRows(data.MST);
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
  const onModify = (id: string, data: Mst_Dealer) => {};
  // Section: CRUD operations
  const onCreateNew = async (data: Mst_NNTController & { __KEY__: string }) => {
    const { __KEY__, ...rest } = data;
    if (data.invalidate === true) {
      const resp = await api.Mst_NNTController_Create({
        ...rest,
        FlagActive: rest.FlagActive ? "1" : "0",
      });
      if (resp.isSuccess) {
        toast.success(t("Create Successfully"));
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
  const onCreate = (data: any) => {};
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

  const handleEditRowChanges = () => {};
  const handleOnEditRowOld = () => {};

  const loadingControl = useVisibilityControl({ defaultVisible: false });
  const handleDeleteRows = async (ids: any) => {
    const resp = await api.Mst_NNTController_Delete(ids);
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
    <AdminContentLayout className={"Business_Information"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderLayout>
          <PageHeaderLayout.Slot name={"Before"}>
            <div className="text-header font-bold dx-font-m">
              {t("Business_Information")}
            </div>
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"Center"}>
            <HeaderPart
              permission={"MNU_ADMIN_ORG_BUSINESS_INFOMATION"}
              refetch={refetch}
              onAddNew={handleAddNew}
              handleOnEditRow={handleOnEditRow}
            />
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"After"}></PageHeaderLayout.Slot>
        </PageHeaderLayout>
      </AdminContentLayout.Slot>

      <AdminContentLayout.Slot name={"Content"}>
        <GridViewCustomize
          isLoading={isLoading}
          dataSource={
            data?.isSuccess
              ? auth.orgId === auth.networkId
                ? dataGrid
                : dataGrid.filter(
                    (item: any) => item.OrgID === auth.orgId.toString()
                  ) ?? []
              : []
          }
          columns={columns}
          keyExpr={"MST"}
          popupSettings={popupSettings}
          formSettings={formSettings}
          onReady={(ref) => (gridRef = ref)}
          allowSelection={true}
          onSelectionChanged={handleSelectionChanged}
          onSaveRow={handleSavingRow}
          onEditorPreparing={handleEditorPreparing}
          onEditRowChanges={handleEditRowChanges}
          onDeleteRows={handleDeleteRows}
          onEditRow={handleOnEditRowOld}
          storeKey={"Business_Information-columns"}
          isSingleSelection
          customToolbarItems={[
            {
              permissionCode: "BTN_ADMIN_ORG_BUSINESS_INFOMATION_UPDATE",
              text: t("Edit"),
              shouldShow: (ref: any) => {
                return ref.instance.getSelectedRowKeys().length === 1;
              },
              onClick: (e: any, ref: any) => {
                const selectedRow = ref.instance.getSelectedRowsData();
                handleOnEditRow(selectedRow[0].MST);
              },
            },
            {
              permissionCode: "BTN_ADMIN_ORG_BUSINESS_INFOMATION_DELETE",
              text: t("Delete"),
              shouldShow: (ref: any) => {
                return ref.instance.getSelectedRowKeys().length === 1;
              },
              onClick: (e: any, ref: any) => {
                const selectedRow = ref.instance.getSelectedRowsData();
                handleDeleteRows(selectedRow[0].MST);
              },
            },
          ]}
        />
        <PopupView
          formRef={formRef}
          onEdit={onModifyNew}
          formSettings={formSettings}
          title={t("Thông tin công ty/chi nhánh")}
          onCreate={onCreateNew}
        />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
