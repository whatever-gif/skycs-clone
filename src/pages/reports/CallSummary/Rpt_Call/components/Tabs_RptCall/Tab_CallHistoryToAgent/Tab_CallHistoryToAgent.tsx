import { useI18n } from "@/i18n/useI18n";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";
import { authAtom, permissionAtom } from "@packages/store";
import { useQuery } from "@tanstack/react-query";
import { IItemProps } from "devextreme-react/form";
import { useAtomValue } from "jotai";
import { useMemo, useReducer, useRef, useState } from "react";

import { useClientgateApi } from "@/packages/api";

import {
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getYearMonthDate,
} from "@/components/ulti";
import { callApi } from "@/packages/api/call-api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { getDMY } from "@/utils/time";
import { LoadPanel } from "devextreme-react";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { useColumns } from "./components/use-columns";
import UseToolbar from "./components/useToolbar";

export const Tab_CallHistoryToAgent = () => {
  const { t } = useI18n("Rpt_CallHistoryToAgent");
  const { t: Rpt_CallHistoryToAgent } = useI18n("Tab_CallHistoryToAgent");
  const windowSize = useWindowSize();
  const [formartDate, setFormatDate] = useState("day");
  const [searchCondition, setSearchCondition] = useState<any>({
    period: "day",
    callType: "All",
    fromDate: [new Date(new Date(Date.now())), new Date(new Date(Date.now()))],
  });
  const [key, reloading] = useReducer(() => {
    return nanoid();
  }, "0");
  const nav = useNavigate();
  let gridRef: any = useRef();
  const auth = useAtomValue(authAtom);
  const api = useClientgateApi();
  const searchPanelVisibility = useAtomValue(searchPanelVisibleAtom);

  const {
    data: dataOrg,
    isLoading: isLoadingOrgInfo,
    refetch: refetchOrgInfo,
  } = useQuery({
    queryKey: ["GetCurrentOrgInfo"],
    queryFn: async () => {
      const response = await callApi.getOrgInfo(auth.networkId).then((resp) => {
        if (resp.Success) {
          const customize = resp.Data;
          customize.AgentList = [...customize.AgentList];
          customize.Numbers = [...customize.Numbers];
          return customize;
        }
      });

      return response;
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Tab_CallHistoryToAgent", key],
    queryFn: async () => {
      const condition = {
        ...searchCondition,
        fromDate:
          searchCondition.period === "day"
            ? searchCondition.fromDate[0]
              ? getYearMonthDate(searchCondition.fromDate[0])
              : null
            : searchCondition.fromDate[0]
            ? getFirstDateOfMonth(searchCondition.fromDate[0])
            : null,
        toDate:
          searchCondition.period === "day"
            ? searchCondition.fromDate[1]
              ? getYearMonthDate(searchCondition.fromDate[1])
              : null
            : searchCondition.fromDate[1]
            ? getLastDateOfMonth(searchCondition.fromDate[1])
            : null,
      };

      const response = await callApi.rpt_GetCallHistoryFull(auth.networkId, {
        ...condition,
      });
      if (response.Success) {
        const result = response.Data.map((item: any, index: number) => {
          return {
            ...item,
            idx: index + 1,
          };
        });
        const newResult = result.map((item: any) => {
          return {
            ...item,
            detail_ExtId: item.Logs.map((itemMap: any) => itemMap.ExtId),
            detail_Number: item.Logs.map((itemMap: any) => itemMap.Number),
            detail_RingDTime: item.Logs.map(
              (itemMap: any) => itemMap.RingDTime
            ),
            detail_TalkDTime: item.Logs.map(
              (itemMap: any) => itemMap.TalkDTime
            ),
            detail_EndDTime: item.Logs.map((itemMap: any) => itemMap.EndDTime),
            detail_Name: item.Logs.map((itemMap: any) => itemMap.Name),
            detail_HoldTime: item.Logs.map((itemMap: any) => itemMap.HoldTime),
            detail_RingTime: item.Logs.map((itemMap: any) => itemMap.RingTime),
            detail_TalkTime: item.Logs.map((itemMap: any) => itemMap.TalkTime),
            detail_EndReason: item.Logs.map(
              (itemMap: any) => itemMap.EndReason
            ),
            detail_IsConnected: item.Logs.map(
              (itemMap: any) => itemMap.IsConnected
            ),
            CustomerName: "",
          };
        });
        let params: any = [];

        newResult.forEach((item: any) => {
          if (
            item.RemoteNumber &&
            item.RemoteNumber.length > 9 &&
            params.filter((p: any) => p.CtmPhoneNo == item.RemoteNumber)
              .length == 0
          )
            params.push({
              CtmPhoneNo: item.RemoteNumber,
            });
        });
        var respData = await api.Mst_Customer_GetByCtmPhoneNo(params);
        if (
          respData.isSuccess &&
          respData.Data &&
          respData.Data.Lst_Mst_Customer &&
          respData.Data.Lst_Mst_Customer.length > 0 &&
          respData.Data.Lst_Mst_CustomerPhone &&
          respData.Data.Lst_Mst_CustomerPhone.length > 0
        ) {
          var ctmList = respData.Data.Lst_Mst_Customer;
          var phoneNoList = respData.Data.Lst_Mst_CustomerPhone;
          const result = newResult.map((item: any) => {
            if (item.RemoteNumber) {
              var phone = phoneNoList.find(
                (ii: any) => ii.CtmPhoneNo == item.RemoteNumber
              );
              if (phone) {
                var cus = ctmList.find(
                  (ii: any) => ii.CustomerCodeSys == phone.CustomerCodeSys
                );
                if (cus) {
                  return {
                    ...item,
                    CustomerName: cus.CustomerName,
                  };
                } else {
                  return {
                    ...item,
                    CustomerName: "",
                  };
                }
              } else {
                return {
                  ...item,
                  CustomerName: "",
                };
              }
            } else {
              return {
                ...item,
                CustomerName: "",
              };
            }
          });
          return result;
        }

        return newResult;
      } else {
        // showError({
        //   message: (response.ErrorDetail),
        //   debugInfo: response.ErrorDetail,
        //   errorInfo: response.ErrorDetail,
        // });
        return null;
      }
    },
  });

  const PostStatus = [
    { text: Rpt_CallHistoryToAgent("Rejected"), value: "Rejected" },
    { text: Rpt_CallHistoryToAgent("Cancel"), value: "Cancel" },
    { text: Rpt_CallHistoryToAgent("Complete"), value: "Complete" },
  ];

  const columns = useColumns({ data: data || [] });

  const formItems: IItemProps[] = useMemo(() => {
    return [
      // {
      //   dataField: "period",
      //   caption: t("period"),
      //   editorType: "dxSelectBox",
      //   label: {
      //     text: t("period"),
      //   },
      //   visible: true,
      //   validationRules: [requiredType],
      //   editorOptions: {
      //     dataSource: [
      //       {
      //         title: t("Day"),
      //         value: "day",
      //       },
      //       {
      //         title: t("Month"),
      //         value: "month",
      //       },
      //     ],
      //     valueExpr: "value",
      //     displayExpr: "title",
      //     onValueChanged: (param: any) => {
      //       setFormatDate(param.value);
      //     },
      //   },
      // },
      {
        dataField: "fromDate", // dealine
        caption: t("fromDate"),
        visible: true,
        label: {
          text: t("Time"),
        },
        validationRules: [requiredType],
        editorOptions: {
          type: "date",
          calendarOptions: {
            maxZoomLevel: "month",
          },
          displayFormat: "yyyy-MM-dd",
        },
        editorType: "dxDateRangeBox",
      },
      {
        dataField: "agentId",
        caption: t("agentId"),
        label: {
          text: t("agentId"),
        },
        visible: true,
        editorType: "dxSelectBox",
        editorOptions: {
          showClearButton: true,
          dataSource: dataOrg ? dataOrg?.AgentList : [],
          valueExpr: "AgentId",
          displayExpr: "Name",
        },
      },
      {
        dataField: "ccNumber",
        caption: t("ccNumber"),
        label: {
          text: t("ccNumber"),
        },
        visible: true,
        editorType: "dxSelectBox",
        editorOptions: {
          showClearButton: true,

          dataSource: dataOrg ? dataOrg?.Numbers : [],
        },
      },
      {
        dataField: "RemoteNumber",
        caption: t("RemoteNumber"),
        label: {
          text: t("RemoteNumber"),
        },
        visible: true,
        editorType: "dxTextBox",
      },
      {
        dataField: "callId",
        caption: t("callId"),
        label: {
          text: t("callId"),
        },
        visible: true,
        editorType: "dxTextBox",
      },
      {
        caption: t("callType"),
        label: {
          text: t("callType"),
        },
        dataField: "callType",
        editorType: "dxSelectBox",
        editorOptions: {
          showClearButton: true,
          dataSource: [
            {
              title: t("All"),
              value: "All",
            },
            {
              title: t("Incoming"),
              value: "Incoming",
            },
            {
              title: t("Outgoing"),
              value: "Outgoing",
            },
            {
              title: t("Internal"),
              value: "Internal",
            },
          ],
          valueExpr: "value",
          displayExpr: "title",
          placeholder: t("Select"),
        },
      },
      {
        caption: t("callStatus"),
        label: {
          text: t("callStatus"),
        },
        dataField: "callStatus",
        editorType: "dxSelectBox",
        editorOptions: {
          showClearButton: true,
          dataSource: PostStatus,
          valueExpr: "value",
          displayExpr: "text",
          placeholder: t("Select"),
        },
      },
    ];
  }, [formartDate, isLoadingOrgInfo]);

  const handleDeleteRows = async (rows: any) => {};

  // toggle search panel
  const toolbar = UseToolbar();
  const { menu, buttons } = useAtomValue(permissionAtom);

  const handleSearch = async (data: any) => {
    setSearchCondition({
      ...data,
    });
    reloading();
    await refetch();
  };
  const handleEditRowChanges = () => {};

  const handleSelectionChanged = () => {};
  const handleSavingRow = () => {};
  const handleEditorPreparing = () => {};
  const handleExport = () => {};
  return (
    <AdminContentLayout className={"ReportCall_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderNoSearchLayout>
          <PageHeaderNoSearchLayout.Slot name={"Before"}>
            <div className="text-header font-bold dx-font-m">
              {t("Report CallHistoryToAgent")}
            </div>
          </PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot
            name={"Center"}
          ></PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot
            name={"After"}
          ></PageHeaderNoSearchLayout.Slot>
        </PageHeaderNoSearchLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout
          searchPermissionCode={"BTN_RPTCALL_HISTORY_AGENT_SEARCH"}
        >
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              storeKey="tab_callAgent_Search"
              conditionFields={formItems}
              data={searchCondition}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <LoadPanel visible={isLoading || isLoadingOrgInfo} />
            {!isLoading && !isLoadingOrgInfo && (
              <GridViewCustomize
                cssClass={"Tab_CallHistoryAgent"}
                isLoading={isLoading}
                dataSource={data}
                columns={columns}
                permissionExport="BTN_RPTCALL_HISTORY_AGENT_SEARCH"
                keyExpr={["PostCode", "OrgID"]}
                onReady={(ref) => (gridRef = ref)}
                isHiddenCheckBox={true}
                allowSelection={true}
                nameFile={`Báo cáo lịch sử cuộc gọi tới agent ${getDMY(
                  new Date(Date.now())
                )}`}
                onSelectionChanged={handleSelectionChanged}
                onSaveRow={handleSavingRow}
                onEditorPreparing={handleEditorPreparing}
                // allowInlineEdit={true}
                onEditRowChanges={handleEditRowChanges}
                onDeleteRows={handleDeleteRows}
                visibleExport={true}
                toolbarItems={toolbar}
                customToolbarItems={
                  [
                    // {
                    //   permissionCode: "BTN_RPTCALL_HISTORY_AGENT_EXPORTEXCEL",
                    //   text: "Export",
                    //   onClick: () => handleExport,
                    //   shouldShow: () => {
                    //     return true;
                    //   },
                    // },
                  ]
                }
                storeKey={"tab_Call-columns"}
              />
            )}
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
