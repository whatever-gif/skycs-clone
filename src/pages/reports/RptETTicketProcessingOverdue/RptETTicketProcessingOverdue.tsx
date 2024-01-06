import { getYearMonthDate } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { RequiredDateTimeMonth, RequiredField } from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@/packages/layouts/content-searchpanel-layout";
import { showErrorAtom } from "@/packages/store";
import { RptETTicketProcessingOverdueByAgent } from "@/packages/types";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { ColumnOptions } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Button, LoadPanel, NumberBox } from "devextreme-react";
import {
  Chart,
  CommonSeriesSettings,
  Label,
  SeriesTemplate,
  Tooltip,
} from "devextreme-react/chart";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useReducer, useRef, useState } from "react";
import "./style.scss";

const RptETTicketProcessingOverdue = () => {
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const searchPanelVisibility = useAtomValue(searchPanelVisibleAtom);
  const { t } = useI18n("Rpt_ETTicketProcessingOverdue");
  const { auth } = useAuth();
  const api = useClientgateApi();
  const pivotRef: any = useRef();
  const [searchCondition, setSearchCondition] = useState({
    FlagProcessingOverdue: 1,
    OrgIDConditionList: auth?.orgId ? auth?.orgId.toString() : "",
    CreateDTimeUTC: [null, null],
    TicketTypeConditionList: [],
    AgentCodeConditionList: [],
    ProcessTimeFrom: 1,
    ProcessTimeTo: null,
  });
  const showError = useSetAtom(showErrorAtom);
  const [key, isLoading] = useReducer(() => {
    return nanoid();
  }, "0");

  const { data: dataListTicket, isLoading: isLoadingTicket } = useQuery({
    queryKey: [
      "Mst_TicketEstablishInfoApi_GetAllInfo",
      "Rpt_ETTicketProcessingOverdue_GetTicketType",
    ],
    queryFn: async () => {
      const response = await api.Mst_TicketEstablishInfoApi_GetAllInfo();
      if (response.isSuccess) {
        return (
          response.Data.Lst_Mst_TicketType?.filter(
            (item: any) => item?.FlagActive == "1"
          ) ?? []
        );
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

  const { data: dataListAgent, isLoading: isLoadingAgent } = useQuery({
    queryKey: ["Sys_User_GetAllActive"],
    queryFn: async () => {
      const response = await api.Sys_User_GetAllActive();
      if (response.isSuccess) {
        return response.DataList?.filter(
          (item: any) => item?.OrgID == auth?.orgData?.Id
        );
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

  // console.log("dataListAgent", dataListAgent);

  const {
    data: dataNNT,
    isLoading: isLoadingNNT,
    refetch: refetchMNT,
  } = useQuery({
    queryKey: ["Mst_NNTController_GetAllActive"],
    queryFn: async () => {
      const response = await api.Mst_NNTController_GetAllActive();
      if (response.isSuccess) {
        return response.Data.Lst_Mst_NNT;
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

  const {
    data,
    isLoading: isLoadingValue,
    refetch,
  } = useQuery({
    queryKey: ["RptCpnCampaignSummaryResult_Search", key],
    queryFn: async () => {
      if (key !== "0") {
        const customize: Partial<RptETTicketProcessingOverdueByAgent> = {
          ...searchCondition.OrgIDConditionList,
          FlagProcessingOverdue: searchCondition.FlagProcessingOverdue,
          OrgIDConditionList: searchCondition.OrgIDConditionList,
          AgentCodeConditionList: searchCondition.AgentCodeConditionList
            ? searchCondition.AgentCodeConditionList.join(",")
            : "",
          TicketTypeConditionList: searchCondition.TicketTypeConditionList
            ? searchCondition.TicketTypeConditionList.join(",")
            : "",
          CreateDTimeUTCFrom: searchCondition.CreateDTimeUTC[0]
            ? getYearMonthDate(searchCondition.CreateDTimeUTC[0])
            : "",
          CreateDTimeUTCTo: searchCondition.CreateDTimeUTC[1]
            ? getYearMonthDate(searchCondition.CreateDTimeUTC[1])
            : "",
          ProcessTimeFrom: searchCondition.ProcessTimeFrom
            ? searchCondition.ProcessTimeFrom
            : null,
          ProcessTimeTo: searchCondition.ProcessTimeTo
            ? searchCondition.ProcessTimeTo
            : null,
        };

        const response = await api.Rpt_ETTicketProcessingOverdue_Search(
          customize
        );
        if (response.isSuccess) {
          // console.log("response ", response);
          const data = response.Data
            ? response.Data.Lst_Rpt_ET_Ticket_ProcessingOverdue ?? []
            : [];

          const customize = data.map((item: any) => {
            return {
              ...item,
            };
          });
          return customize;
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
          return [];
        }
      } else {
        return [];
      }
    },
  });

  // console.log("data ", data);

  const searchColumn: ColumnOptions[] = [
    {
      visible: true,
      colSpan: 2,
      dataField: "FlagProcessingOverdue",
      caption: t("FlagProcessingOverdue"),
      editorType: "dxRadioGroup",
      label: {
        text: t("FlagProcessingOverdue"),
      },
      editorOptions: {
        dataSource: [
          {
            value: 1,
            lable: t("Active"),
          },
          {
            value: 0,
            lable: t("Inactive"),
          },
        ],
        valueExpr: "value",
        displayExpr: "lable",
        searchEnabled: true,
      },
    },
    {
      visible: true,
      colSpan: 2,
      dataField: "OrgIDConditionList", // chi nhánh
      caption: t("OrgIDConditionList"),
      editorType: "dxSelectBox",
      label: {
        text: t("OrgIDConditionList"),
      },
      validationRules: [RequiredField(t("OrgIDConditionList"))],

      editorOptions: {
        dataSource: dataNNT ?? [],
        valueExpr: "OrgID",
        searchExpr: ["NNTFullName", "MST"],
        displayExpr: "NNTFullName",
        searchEnabled: true,
      },
    },
    {
      visible: true,
      colSpan: 2,
      dataField: "CreateDTimeUTC", // ngày tạo ticket
      caption: t("CreateDTimeUTC"),
      editorType: "dxDateRangeBox",
      label: {
        text: t("CreateDTimeUTC"),
      },
      editorOptions: {
        type: "date",
        format: "yyyy-MM-dd",
        displayFormat: "yyyy-MM-dd",
      },
      validationRules: [
        RequiredField(t("CreateDTimeUTC is required")),
        RequiredDateTimeMonth(
          t("The limit search is only 2 month so please choose again"),
          2
        ),
      ],
    },
    {
      visible: true,
      colSpan: 2,
      dataField: "TicketTypeConditionList", // loại ticket
      caption: t("TicketTypeConditionList"),
      label: {
        text: t("TicketTypeConditionList"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        searchExpr: ["CampaignCode", "CampaignName"],
        dataSource: dataListTicket ?? [],
        valueExpr: "TicketType",
        displayExpr: "CustomerTicketTypeName",
        searchEnabled: true,
        isValid: true,
      },
    },
    {
      visible: true,
      colSpan: 2,
      dataField: "AgentCodeConditionList", // Agent phụ trach
      caption: t("AgentCodeConditionList"),
      label: {
        text: t("AgentCodeConditionList"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        searchExpr: ["UserCode", "UserName"],
        dataSource: dataListAgent ?? [],
        valueExpr: "UserCode",
        displayExpr: "UserName",
        searchEnabled: true,
        isValid: true,
      },
    },
    {
      visible: true,
      colSpan: 2,
      dataField: "ProcessTimeFrom", // Agent phụ trach
      caption: t("ProcessTimeFrom"),
      label: {
        text: t("ProcessTimeFrom"),
      },
      editorType: "dxNumberBox",
      editorOptions: {
        min: 1,
      },
      render(param) {
        const { component: formComponent } = param;
        return (
          <div className="flex align-items-center gap-1">
            <div className="flex align-items-center gap-2">
              <NumberBox
                min={0}
                defaultValue={searchCondition.ProcessTimeFrom}
                onValueChanged={(e) => {
                  formComponent.updateData("ProcessTimeFrom", e.value);
                }}
              />
              <NumberBox
                defaultValue={searchCondition.ProcessTimeTo}
                onValueChanged={(e) => {
                  formComponent.updateData("ProcessTimeTo", e.value);
                }}
              />
            </div>
            <span>{t("Hour")}</span>
          </div>
        );
      },
    },
  ];
  // console.log("data ", data);
  const hanldeSearch = (data: any) => {
    isLoading();
    // refetch();
  };

  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  console.log("data ", data);
  return (
    <AdminContentLayout className={"Category_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <p className="header-title p-2">{t("RptETTicketProcessingOverdue")}</p>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              colCount={2}
              conditionFields={searchColumn}
              storeKey="RptETTicketProcessingOverdue"
              data={searchCondition}
              onSearch={hanldeSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <Button
              visible={!searchPanelVisibility}
              className="button_Search"
              icon={"/images/icons/search.svg"}
              onClick={handleToggleSearchPanel}
            />
            <LoadPanel
              container={".dx-viewport"}
              shadingColor="rgba(0,0,0,0.4)"
              position={"center"}
              visible={
                isLoadingNNT ||
                isLoadingValue ||
                isLoadingTicket ||
                isLoadingAgent
              }
              showIndicator={true}
              showPane={true}
            />
            {key !== "0" && !isLoadingValue && (
              <div className="h-[70%]">
                <Chart
                  id="chart"
                  className="chart-report h-full"
                  dataSource={data}
                >
                  <CommonSeriesSettings
                    width={50}
                    barWidth={100}
                    argumentField="AgentTicketTypeName"
                    valueField="QtyTicket"
                    type="bar"
                    ignoreEmptyPoints={true}
                  >
                    <Label
                      position="inside"
                      visible={true}
                      customizeText={(data: any) => {
                        return `${data.point.data.QtyTicket}`;
                      }}
                      displayMode="standard"
                    />
                  </CommonSeriesSettings>
                  <SeriesTemplate nameField="AgentTicketTypeName" />
                  <Tooltip enabled={false} />
                </Chart>
              </div>
            )}
            <div className="RptETTicketProcessingOverdue-manager"></div>
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default RptETTicketProcessingOverdue;
