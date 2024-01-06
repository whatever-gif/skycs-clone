import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";
import { useConfiguration, useNetworkNavigate } from "@packages/hooks";
import { showErrorAtom } from "@packages/store";
import {
  Mst_CampaignTypeSearchParam,
  Mst_PaymentTermData,
} from "@packages/types";
import { GridViewPopup } from "@packages/ui/base-gridview";
import { useQuery } from "@tanstack/react-query";
import { IItemProps } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

import { HeaderPart } from "../components/header-part";
import { selectedItemsAtom } from "../components/store";

import { getYearMonthDate } from "@/components/ulti";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { useColumn } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";

export const SvImpAudioAnalysisManager = () => {
  const { t } = useI18n("SvImpAudioAnalysisManager");
  const { t: placeholder } = useI18n("Placeholder");
  const { t: error } = useI18n("ErrorMessage");

  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const navigate = useNetworkNavigate();
  const showError = useSetAtom(showErrorAtom);

  const { auth } = useAuth();

  const [searchCondition] = useState<any>({
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    AudioAnalysisCodeSys: "",
    CreateDTimeUTC: [null, null],
    CreateBy: "",
    OrgID: auth?.orgData?.Id,
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["SvImpAudioAnalysis_List", JSON.stringify(searchCondition)],
    queryFn: async () => {
      const response = await api.SvImpAudioAnalysis_Search({
        ...searchCondition,
        CreateDTimeUTCFrom: searchCondition?.CreateDTimeUTC[0]
          ? `${getYearMonthDate(searchCondition?.CreateDTimeUTC[0])} 00:00:00`
          : "",
        CreateDTimeUTCTo: searchCondition?.CreateDTimeUTC[1]
          ? `${getYearMonthDate(searchCondition?.CreateDTimeUTC[1])} 23:59:59`
          : "",
        CreateBy:
          searchCondition?.CreateBy?.length > 0
            ? searchCondition?.CreateBy?.join(",")
            : "",
      });

      if (response.isSuccess) {
        const data: any[] = response.DataList ?? [];
        const result = data?.map((item: any) => {
          return {
            ...item,
            TotalAudioAnalysisTime: Number(
              item?.TotalAudioAnalysisTime?.toFixed(2)
            ),
            TotalAudioAnalysisOkTime: Number(
              item?.TotalAudioAnalysisOkTime?.toFixed(2)
            ),
            TotalAudioAnalysisFailTime: Number(
              item?.TotalAudioAnalysisFailTime?.toFixed(2)
            ),
            TotalAudioAnalysisRemainTime: Number(
              item?.TotalAudioAnalysisRemainTime?.toFixed(2)
            ),
          };
        });

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

  console.log("data ", data);

  useEffect(() => {
    refetch();
  }, []);

  const { data: listOrg } = useQuery(
    ["SvImpAudioAnalysisManager_GetlistOrg"],
    async () => {
      const resp: any = await api.GetMyOrgList();

      return resp?.Data?.Lst_OS_Inos_Org ?? [];
    }
  );

  const { data: listUser } = useQuery(["getListUser"], async () => {
    const resp: any = await api.Sys_User_GetAllActive();

    return resp?.DataList ?? [];
  });

  console.log("listOrg ", listOrg);

  const columns = useColumn();

  const formItems: IItemProps[] = [
    {
      caption: t("AudioAnalysisCodeSys"),
      label: {
        text: t("AudioAnalysisCodeSys"),
      },
      dataField: "AudioAnalysisCodeSys",
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: placeholder("Input"),
      },
    },

    {
      dataField: "CreateDTimeUTC",
      caption: t("CreateDTimeUTC"),
      visible: true,
      label: {
        text: t("CreateDTimeUTC"),
      },
      colSpan: 1,
      editorType: "dxDateRangeBox",
      editorOptions: {
        type: "date",
        displayFormat: "yyyy-MM-dd",
      },
    },
    {
      caption: t("OrgID"),
      label: {
        text: t("OrgID"),
      },
      dataField: "OrgID",
      editorType: "dxSelectBox",
      editorOptions: {
        placeholder: placeholder("Input"),
        dataSource: listOrg,
        valueExpr: "Id",
        displayExpr: "Name",
        searchEnabled: true,
      },
    },
    {
      caption: t("CreateBy"),
      label: {
        text: t("CreateBy"),
      },
      dataField: "CreateBy",
      editorType: "dxTagBox",
      editorOptions: {
        placeholder: placeholder("Select"),
        dataSource: listUser,
        valueExpr: "UserCode",
        displayExpr: "UserName",
        searchEnabled: true,
      },
    },
  ];

  const handleDeleteRows = async (rows: Mst_CampaignTypeSearchParam[]) => {};

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleCancel = () => {
    gridRef.current?.instance?.cancelEditData();
  };
  const handleEdit = (rowData: any) => {};
  const handleSubmit = () => {
    gridRef.current?.instance?.saveEditData();
  };

  const handleEditorPreparing = (e: EditorPreparingEvent) => {};

  const popupSettings: IPopupOptions = {};

  const formSettings = useFormSettings({
    columns,
  });

  const onModify = async (id: any, data: Partial<any>) => {};
  // Section: CRUD operations
  const onCreate = async (
    data: Mst_PaymentTermData & { __KEY__: string }
  ) => {};

  const onDelete = async (id: any) => {};
  const handleSavingRow = (e: any) => {
    if (e.changes && e.changes.length > 0) {
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

  const handleSearch = async () => {
    await refetch();
  };
  const handleOnEditRow = (e: any) => {
    const { row, column } = e;
    handleEdit(row.data);
  };
  const handleEditRowChanges = (e: any) => {};

  return (
    <AdminContentLayout className={"ServiceImprovementManager "}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart></HeaderPart>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout searchPermissionCode="">
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            {/* <div className={"w-[200px]"}> */}
            <SearchPanelV2
              storeKey="ServiceImprovementManager_Search"
              conditionFields={formItems}
              data={searchCondition}
              onSearch={handleSearch}
            />
            {/* </div> */}
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewPopup
              isLoading={isLoading}
              dataSource={data ?? []}
              columns={columns}
              keyExpr={"SvImprvCode"}
              allowInlineEdit={false}
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
                  options: {
                    icon: "search",
                    onClick: handleToggleSearchPanel,
                  },
                },
              ]}
              storeKey={"ServiceImprovementManager-columns"}
              checkboxMode="none"
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
