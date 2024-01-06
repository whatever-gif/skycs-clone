import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";
import { useConfiguration } from "@packages/hooks";
import { showErrorAtom } from "@packages/store";
import { Mst_Area } from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useSetAtom } from "jotai";
import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { HeaderPart } from "../components/header-part";
import { selectedItemsAtom } from "../components/store";
import { useBankDealerGridColumns } from "../components/use-columns";
import "./Rpt_CpnCampaignStatisticCall.scss";

import { SearchPanelV2 } from "@/packages/ui/search-panel";

import { DateRangeBox } from "devextreme-react";

import { checkPermision } from "@/components/PermissionContainer";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { format } from "date-fns";

export const Rpt_CpnCampaignStatisticCallPage = () => {
  const { t } = useI18n("Rpt_CpnCampaignStatisticCall");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const msInDay = 1000 * 60 * 60 * 24;
  const now = new Date();
  const startDate = new Date(now.getTime() - msInDay * 3);
  const endDate = new Date(now.getTime());

  //tạo thời gian
  var currentDate = new Date();

  // Lấy năm hiện tại
  var currentYear = currentDate.getFullYear();

  // Tạo một đối tượng Date mới với ngày đầu tiên của năm
  var firstDayOfYear = new Date(currentYear, 0, 1);

  const [searchCondition] = useState<any>({
    AgentCodeConditionList: "",
    CampaignCodeConditionList: "",
    MonthReport: [null, null],
  } as any);

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Rpt_CpnCampaignStatisticCall", JSON.stringify(searchCondition)],
    queryFn: async () => {
      const resp = await api.Rpt_CpnCampaignStatisticCall_Search({
        AgentCodeConditionList: searchCondition.AgentCodeConditionList
          ? searchCondition.AgentCodeConditionList.join(",")
          : "",
        CampaignCodeConditionList: searchCondition.CampaignCodeConditionList
          ? searchCondition.CampaignCodeConditionList.join(",")
          : "",
        ReportDTimeFrom: searchCondition.MonthReport[0]
          ? format(searchCondition.MonthReport[0], "yyyy-MM-dd ")
          : format(firstDayOfYear, "yyyy-MM-dd "),
        ReportDTimeTo: searchCondition.MonthReport[1]
          ? format(searchCondition.MonthReport[1], "yyyy-MM-dd")
          : format(endDate, "yyyy-MM-dd"),
      });
      return resp;
    },
  });
  const { data: CampaignList } = useQuery(["CampaignList"], () =>
    api.Cpn_CampaignAgent_Search({
      Ft_PageIndex: 0,
      Ft_PageSize: 999999999999,
    })
  );

  const { data: listUser } = useQuery(
    ["listAgent"],
    () => api.Sys_User_GetAllActive() as any
  );

  const columns = useBankDealerGridColumns({
    data: data?.Data?.Rpt_Cpn_CampaignResultCall || [],
  });

  const formItems: any[] = useMemo(() => {
    return [
      {
        dataField: "MonthReport",
        visible: true,
        caption: t("MonthReport"),
        label: {
          text: t("Time create"),
        },
        editorType: "dxDateRangeBox",
        editorOptions: {
          type: "date",
          displayFormat: "yyyy-MM-dd",
        },
        render: ({ editorOptions, component: formRef }: any) => {
          return (
            <DateRangeBox
              displayFormat=" yyyy-MM-dd"
              defaultStartDate={
                searchCondition.MonthReport[0] ||
                format(firstDayOfYear, "yyyy-MM-dd")
              }
              defaultEndDate={searchCondition.MonthReport[1] || endDate}
              showClearButton={true}
              useMaskBehavior={true}
              openOnFieldClick={true}
              labelMode="hidden"
              onValueChanged={(e: any) => {
                formRef.instance().updateData("MonthReport", e.value);
              }}
            />
          );
        },
      },
      {
        caption: t("CampaignCodeConditionList"),
        dataField: "CampaignCodeConditionList",
        label: {
          text: t("Campaign list"),
        },
        editorType: "dxTagBox",
        editorOptions: {
          dataSource: CampaignList?.Data ?? [],
          displayExpr: "CampaignName",
          valueExpr: "CampaignCode",
          placeholder: t("Input"),
          searchEnabled: true,
        },
      },
      {
        caption: t("AgentCodeConditionList"),
        dataField: "AgentCodeConditionList",
        label: {
          text: t("Agent list"),
        },
        editorType: "dxTagBox",
        editorOptions: {
          placeholder: t("Input"),
          searchEnabled: true,
          dataSource: listUser?.DataList ?? [],
          displayExpr: "UserName",
          valueExpr: "UserCode",
        },
      },
    ];
  }, [CampaignList, listUser]);

  const handleDeleteRows = async (rows: any) => {
    // console.log(175, rows);
  };
  const [checkTab, setCheckTab] = useState(false);

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    // gridRef.current._instance.addRow();
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
      if (["OrgID", "AreaCode"].includes(e.dataField!)) {
        e.editorOptions.readOnly = !e.row?.isNewRow;
      }
    }
  };

  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: t("Rpt_CpnCampaignStatisticCall_Information"),
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

  const onModify = async (id: any, data: Partial<Mst_Area>) => {};
  // Section: CRUD operations
  const onCreate = async (data: Mst_Area & { __KEY__: string }) => {};

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
  const handleExportExcel = async () => {
    const resp = await api.Rpt_CpnCampaignStatisticCall_ExportExcel({
      AgentCodeConditionList: searchCondition.AgentCodeConditionList
        ? searchCondition.AgentCodeConditionList.join(",")
        : "",
      CampaignCodeConditionList: searchCondition.CampaignCodeConditionList
        ? searchCondition.CampaignCodeConditionList.join(",")
        : "",
      ReportDTimeFrom: searchCondition.MonthReport[0]
        ? format(searchCondition.MonthReport[0], "yyyy-MM-dd ")
        : format(firstDayOfYear, "yyyy-MM-dd "),
      ReportDTimeTo: searchCondition.MonthReport[1]
        ? format(searchCondition.MonthReport[1], "yyyy-MM-dd")
        : format(endDate, "yyyy-MM-dd"),
    });
    if (resp.isSuccess) {
      toast.success(t("Download Successfully"));
      window.location.href = resp.Data;
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
    <AdminContentLayout className={"Rpt_CpnCampaignStatisticCall"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart
          onAddNew={handleAddNew}
          searchCondition={searchCondition}
        ></HeaderPart>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              storeKey="Rpt_CpnCampaignStatisticCall_Search"
              conditionFields={formItems}
              data={searchCondition}
              onSearch={handleSearch}
              permission="MNU_RPT_CPNCAMPAIGN_STATISTIC_CALL_SEARCH"
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewCustomize
              isLoading={isLoading}
              dataSource={
                data?.isSuccess
                  ? data?.Data?.Rpt_Cpn_CampaignStatisticCall ?? []
                  : []
              }
              cssClass="Rpt_CpnCampaignStatisticCallGrid"
              columns={columns}
              keyExpr={"CampaignCode"}
              popupSettings={popupSettings}
              onReady={(ref) => (gridRef = ref)}
              allowSelection={true}
              onSelectionChanged={handleSelectionChanged}
              onSaveRow={handleSavingRow}
              onEditorPreparing={handleEditorPreparing}
              // allowInlineEdit={false}
              onEditRowChanges={handleEditRowChanges}
              onDeleteRows={handleDeleteRows}
              // inlineEditMode="row"
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
                  visible: checkPermision(
                    "MNU_RPT_CPNCAMPAIGN_STATISTIC_CALL_SEARCH"
                  ),
                },
                {
                  location: "before",
                  widget: "dxButton",
                  options: {
                    text: t("EXPORT"),
                    onClick: handleExportExcel,
                  },
                  visible: checkPermision(
                    "MNU_RPT_CPNCAMPAIGN_STATISTIC_CALL_EXCEL"
                  ),
                },
              ]}
              storeKey={"Rpt_CpnCampaignStatisticCall-columns"}
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
