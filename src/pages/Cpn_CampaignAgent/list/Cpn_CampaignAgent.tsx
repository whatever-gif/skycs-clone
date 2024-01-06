import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { callApi } from "@/packages/api/call-api";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";
import { useConfiguration } from "@packages/hooks";
import { authAtom, showErrorAtom } from "@packages/store";
import { FlagActiveEnum, Mst_Area } from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { LoadPanel, TagBox } from "devextreme-react";
import { IItemProps } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { removeDuplicateCampaigns } from "../components/RemoveDataDuplicate";
import { dataGridAtom, selectedItemsAtom } from "../components/store";
import { useBankDealerGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";
import "./Cpn_CampaignAgent.scss";

export const Cpn_CampaignAgentPage = () => {
  const { t } = useI18n("Cpn_CampaignAgent");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const setSelectedItems = useSetAtom(selectedItemsAtom);
  const api = useClientgateApi();
  const [dataGrid, setDataGrid] = useAtom(dataGridAtom);

  const [searchCondition, setSearchCondition] = useState<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    KeyWord: "",
    CampaignCode: "",
    AgentCode: "",
  });
  const auth = useAtomValue(authAtom);
  const { data: listUser } = useQuery(
    ["listUser"],
    () => api.Sys_User_GetAllActive() as any
  );

  const { data: getCampaing, isLoading: isLoadingGetCampaign } = useQuery({
    queryKey: ["Cpn_CampaignAgent_GetActive"],
    queryFn: async () => {
      return api.Cpn_Campaign_Search({
        FlagActive: FlagActiveEnum.Active,
        Ft_PageIndex: 0,
        Ft_PageSize: 10000,
      });
    },
  });

  // console.log(getCampaing);

  const { data, isLoading, refetch } = useQuery(
    ["Cpn_CampaignAgent", JSON.stringify(searchCondition)],
    async () => {
      const response = await api.Sys_User_GetAllActive();

      if (response.isSuccess) {
        const resp = api.Cpn_CampaignAgent_Search({
          ...searchCondition,
          CampaignCode: searchCondition.CampaignCode
            ? searchCondition.CampaignCode.join(",")
            : null,
          AgentCode: searchCondition.AgentCode
            ? searchCondition.AgentCode.join(",")
            : response?.DataList?.filter(
                (item: any) =>
                  item.EMail.toLowerCase() ===
                  auth.currentUser.Email.toLowerCase()
              )
            ? response?.DataList?.filter(
                (item: any) =>
                  item.EMail.toLowerCase() ===
                  auth.currentUser.Email.toLowerCase()
              )[0]?.UserCode
            : "",
        });
        return resp;
      }
    }
  );

  useEffect(() => {
    if (data) {
      callApi.getOrgAgentList(auth.networkId).then((resp) => {
        if (resp.Success) {
          const dataGridFormat = data?.Data?.map((item: any, index: any) => {
            const matchedUser = resp?.Data?.find(
              (user: any) =>
                user.Name?.toLowerCase() === item?.UserName?.toLowerCase()
            );
            const Ext = matchedUser ? matchedUser.Alias : "";
            return {
              ...item,
              Extension: Ext,
            };
          });
          setDataGrid(dataGridFormat ?? []);
        }
      });
    }
  }, [data]);

  const columns = useBankDealerGridColumns({ data: data?.Data || [] });

  const formItems: IItemProps[] = [
    {
      caption: t("CampaignCode"),
      dataField: "CampaignCode",
      label: {
        text: t("CampaignName"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        placeholder: t("Input"),
        displayExpr: "CampaignName",
        valueExpr: "CampaignCode",
        searchEnabled: true,
        dataSource: removeDuplicateCampaigns(getCampaing?.DataList ?? []),
      },
      visible: true,
    },
    {
      dataField: "AgentCode",
      caption: t("AgentCode"),
      label: {
        text: t("Agent"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        // placeholder: t("Input"),
        displayExpr: "UserName",
        valueExpr: "UserCode",
        searchEnabled: true,
        dataSource: listUser?.DataList ?? [],
      },
      render: (param: any) => {
        const { dataField, component: formComponent } = param;
        return (
          <TagBox
            className="mb-2"
            defaultValue={
              searchCondition.AgentCode
                ? searchCondition.AgentCode
                : [
                    listUser?.DataList?.filter(
                      (item: any) =>
                        item.EMail.toLowerCase() ===
                        auth.currentUser.Email.toLowerCase()
                    )
                      ? listUser?.DataList?.filter(
                          (item: any) =>
                            item.EMail.toLowerCase() ===
                            auth.currentUser.Email.toLowerCase()
                        )[0]?.UserCode
                      : "",
                  ]
            }
            height={30}
            onValueChange={(data) => {
              formComponent.updateData(dataField, data);
            }}
            dataSource={listUser?.DataList ?? []}
            searchEnabled={true}
            displayExpr="UserName"
            valueExpr="UserCode"
          />
        );
      },
      visible: true,
    },
  ];

  const handleDeleteRows = async (rows: any) => {
    const resp = await api.Mst_Area_Delete(rows);
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
  };

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    gridRef.current._instance.addRow();
  };

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
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
      if (["OrgID", "AreaCode"].includes(e.dataField!)) {
        e.editorOptions.readOnly = !e.row?.isNewRow;
      }
    }
  };

  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: t("Cpn_CampaignAgent Information"),
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

  const onModify = async (id: any, data: Partial<Mst_Area>) => {};
  // Section: CRUD operations
  const onCreate = async (data: Mst_Area & { __KEY__: string }) => {};

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
    handleEdit(row.rowIndex);
  };
  const handleEditRowChanges = () => {};

  return (
    <AdminContentLayout className={"Cpn_CampaignAgent"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="font-bold dx-font-m py-[16px] ml-[40px]">
          {t("Cpn_CampaignAgent")}
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout searchPermissionCode="BTN_CAMPAIGN_AGENTMANAGER_SEARCH">
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              storeKey="Cpn_CampaignAgent_Search"
              conditionFields={formItems}
              data={searchCondition}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <LoadPanel
              container={".dx-viewport"}
              shadingColor="rgba(0,0,0,0.4)"
              position={"center"}
              visible={isLoading || isLoadingGetCampaign}
              showIndicator={true}
              showPane={true}
            />
            <GridViewCustomize
              cssClass="Cpn_CampaignAgent_Grid"
              // isHidenHeaderFilter={false}
              isLoading={isLoading || isLoadingGetCampaign}
              dataSource={dataGrid ?? []}
              columns={columns}
              keyExpr={"CampaignCode"}
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
              storeKey={"Cpn_CampaignAgent-columns"}
              customToolbarItems={[]}
              isHiddenCheckBox={true}
              isSingleSelection={false}
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
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
