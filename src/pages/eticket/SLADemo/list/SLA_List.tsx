import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration, useNetworkNavigate } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { PageHeaderLayout } from "@/packages/layouts/page-header-layout";
import { showErrorAtom } from "@/packages/store";
import { GridViewPopup } from "@/packages/ui/base-gridview";
import { GridCustomToolbar } from "@/packages/ui/base-gridview/components/grid-custom-toolbar";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { HeaderPart } from "../components/header-part";
import { keywordAtom } from "../components/store";
import { useMst_SLAColumns } from "../components/use-columns";
import useCustomToolbar from "../components/useCustomToolbar";

const SLA_ListDemo = () => {
  const { t } = useI18n("SLA_List");

  const { t: common } = useI18n("Common");

  const api = useClientgateApi();

  const showError = useSetAtom(showErrorAtom);

  const config = useConfiguration();

  const navigate = useNetworkNavigate();

  const { auth } = useAuth();

  const keyword = useAtomValue(keywordAtom);

  const { data, isLoading, refetch }: any = useQuery(
    ["Mst_SLA", JSON.stringify(keyword)],

    async () => {
      return await api.Mst_SLA_Search({
        Ft_PageIndex: 0,
        Ft_PageSize: config.MAX_PAGE_ITEMS,
        KeyWord: keyword,
      });
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  let gridRef: any = useRef();

  const handleAddNew = () => {
    navigate(`/admin/SLADemoPage/add`);
  };

  // const handleSearch = async (params: any) => {
  //   setSearchCondition({
  //     ...searchCondition,
  //     KeyWord: params,
  //   });
  // };

  const columns = useMst_SLAColumns();

  const formSettings = {};

  const handleSelectionChanged = (rows: string[]) => {};

  const handleSavingRow = () => {};

  const handleEditorPreparing = () => {};

  const handleEditRowChanges = () => {};

  const handleDeleteRows = async (key: any) => {
    if (key?.length == 1) {
      const req = {
        Mst_SLA: {
          SLAID: key[0],
          OrgID: auth.orgData?.Id,
        },
        Lst_Mst_SLATicketType: [],
        Lst_Mst_SLATicketCustomType: [],
        Lst_Mst_SLACustomer: [],
        Lst_Mst_SLACustomerGroup: [],
        Lst_Mst_SLAHoliday: [],
        Lst_Mst_SLAWorkingDay: [],
      };

      const resp: any = await api.Mst_SLA_Delete(req);

      if (resp.isSuccess) {
        toast.success(common("Delete successfully!"));
        refetch();
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

      return;
    }

    if (key?.length > 1) {
      const result = key?.map((item: any) => {
        return {
          Mst_SLA: {
            SLAID: item,
            OrgID: auth.orgData?.Id,
          },
        };
      });

      const resp: any = await api.Mst_SLA_DeleteMultiple(result);

      if (resp.isSuccess) {
        toast.success(common("Delete successfully!"));
        refetch();
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

  const handleOnEditRow = ({ row }: any) => {
    navigate(`/admin/SLADemoPage/edit/${row.key}`);
  };

  const customPopup = () => {};

  const customToolbar = useCustomToolbar();

  return (
    <AdminContentLayout className={"Category_Manager overflow-hidden"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderLayout>
          <PageHeaderLayout.Slot name={"Before"}>
            <div className="text-header font-bold dx-font-m">
              {t("SLA Manager")}
            </div>
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"Center"}>
            <HeaderPart refetch={refetch} onAddNew={handleAddNew} />
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"After"}></PageHeaderLayout.Slot>
        </PageHeaderLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <GridViewPopup
          isLoading={isLoading}
          dataSource={data?.isSuccess ? data.DataList ?? [] : []}
          columns={columns}
          keyExpr={"SLAID"}
          formSettings={formSettings}
          onReady={(ref) => (gridRef = ref)}
          allowSelection={true}
          onSelectionChanged={handleSelectionChanged}
          onSaveRow={handleSavingRow}
          onEditorPreparing={handleEditorPreparing}
          onEditRowChanges={handleEditRowChanges}
          onDeleteRows={handleDeleteRows}
          onEditRow={handleOnEditRow}
          storeKey={"card-view"}
          ref={null}
          permissionDelete="BTN_ADMIN_SLA_LIST_DELETE"
          permissionDeleteMulti="BTN_ADMIN_SLA_LIST_DELETEMULTI"
          permissionEdit="BTN_ADMIN_SLA_LIST_EDIT"
          toolbarItems={[
            {
              location: "before",
              render: () => {
                return (
                  <GridCustomToolbar items={customToolbar} ref={gridRef} />
                );
              },
            },
          ]}
        />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default SLA_ListDemo;
