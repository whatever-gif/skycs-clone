import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { showErrorAtom } from "@packages/store";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

import { DataGrid } from "devextreme-react";
import { useColumn } from "../components/use-columns";

import { callApi } from "@/packages/api/call-api";
import { useAuth } from "@/packages/contexts/auth";
import { GridCustomerToolBarItem } from "@/packages/ui/base-gridview/components/grid-custom-toolbar";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { toast } from "react-toastify";
import PopupView from "../components/popup-view";
import { flagAtom, formValueAtom, visiblePopupAtom } from "../components/store";

export const BlackList = () => {
  const { t } = useI18n("BlackList");
  let gridRef: any = useRef<DataGrid | null>(null);
  const setFlag = useSetAtom(flagAtom);
  const setFormValue = useSetAtom(formValueAtom);
  const setVisiblePopUp = useSetAtom(visiblePopupAtom);
  const showError = useSetAtom(showErrorAtom);
  const { auth: authent } = useAuth();
  const { networkId } = authent;
  // const refetchData = async () => {
  //   const response: any = await callApi.getBlackList(networkId, {});
  //   if (response.Success) {
  //     const result = {
  //       ...response,
  //       DataList: response.Data ?? [],
  //     };
  //     return result;
  //   } else {
  //     showError({
  //       message: (response?.errorCode),
  //       debugInfo: response?.debugInfo,
  //       errorInfo: response?.errorInfo,
  //     });
  //   }
  // };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getBlackList"],
    queryFn: async () => {
      const response: any = await callApi.getBlackList(networkId, {});
      if (response.Success) {
        const result = {
          ...response,
          DataList: response.Data ?? [],
        };
        return result;
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

  // const { data: listMST } = useQuery(["listMST"], () =>
  //   api.Mst_NNTController_GetAllActive()
  // );

  const onShowDetail = (index: number, data: any) => {
    setFormValue(data);
    setVisiblePopUp(true);
    setFlag("Detail");
  };
  const columns = useColumn({
    onShowDetail: onShowDetail,
    data: data ? data.DataList : [],
  });

  const handleOnEditRow = async (e: any) => {
    setFormValue(e);
    setVisiblePopUp(true);
    setFlag("Update");
  };

  const onModifyNew = async (data: any, flag: string) => {
    const response = await callApi.saveBlackListNumber(networkId, data);
    if (response.Success) {
      toast.success(
        t(`Blacklist ${flag == "Update" ? "Updated" : "Added"} successfully`)
      );
      refetch();
    } else {
      toast.error(t(`Failed to ${flag}`));
    }
    setVisiblePopUp(false);
  };

  const handleDeleteRows = async (ids: any) => {
    const param = {
      Number: ids.Number,
      Enabled: ids.Enabled,
      Remark: ids.Remark,
    };
    const response = await callApi.deleteBlackListNumber(networkId, param);
    if (response.Success) {
      toast.success(t("Delete Successfully"));
      // gridRef?.current.refetchData();
      refetch();
    } else {
      toast.error(t("Delete item from black list failed"));
    }
  };

  useEffect(() => {
    if (!isLoading) {
      refetch();
    }
  }, []);

  const handleAdd = () => {
    setFlag("Add");
    setFormValue({
      OrgId: authent.orgData?.Id ?? "",
      Enabled: true,
    });
    setVisiblePopUp(true);
  };

  const toolbar: GridCustomerToolBarItem[] = [
    {
      text: t("Add"),
      // permissionCode: "BTN_ADMIN_BLACKLIST_ADD",
      shouldShow: (ref: any) => {
        return true;
      },
      onClick: (e: any, ref: any) => {
        handleAdd();
      },
    },
    {
      text: t("Edit"),
      permissionCode: "BTN_ADMIN_BLACKLIST_EDIT",
      shouldShow: (ref: any) => {
        const condition = ref.instance.getSelectedRowsData();
        let visible = condition.length ? condition : false;
        return ref.instance.getSelectedRowKeys().length === 1 && visible;
      },
      onClick: (e: any, ref: any) => {
        const selectedRow = ref.instance.getSelectedRowsData();
        handleOnEditRow(selectedRow[0]);
      },
    },
    {
      text: t("Delete"),
      permissionCode: "BTN_ADMIN_BLACKLIST_DELETE",
      shouldShow: (ref: any) => {
        return ref.instance.getSelectedRowKeys().length === 1;
      },
      onClick: (e: any, ref: any) => {
        const selectedRow = ref.instance.getSelectedRowsData();
        handleDeleteRows(selectedRow[0]);
      },
    },
  ];

  return (
    <AdminContentLayout className={"BlackList"}>
      <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        {/* const output = input.filter(item => item.UserCode !== null || item.UserName !== null); */}
        <GridViewCustomize
          isSingleSelection={false}
          isLoading={isLoading}
          // fetchData={refetchData}
          dataSource={data ? data?.DataList ?? [] : []}
          columns={columns}
          keyExpr={["Number"]}
          onReady={(ref) => {
            gridRef = ref;
          }}
          allowSelection={true}
          onSelectionChanged={() => {}}
          hidenTick={true}
          onSaveRow={() => {}}
          onEditorPreparing={() => {}}
          onEditRowChanges={() => {}}
          onDeleteRows={() => {}}
          storeKey={"BlackList"}
          toolbarItems={[]}
          customToolbarItems={toolbar}
        />
        <PopupView
          onEdit={onModifyNew}
          title={"Number"}
          oncancel={() => {
            setVisiblePopUp(false);
            setFormValue({});
          }}
        />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
