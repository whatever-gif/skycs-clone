import { getYearMonthDate } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import {
  RequiredDateTimeMonth,
  RequiredField,
} from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { ContentSearchPanelLayout } from "@/packages/layouts/content-searchpanel-layout";
import { showErrorAtom } from "@/packages/store";
import { RptETTicketProcessingOverdueByAgent } from "@/packages/types";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { ColumnOptions } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { LoadPanel, NumberBox } from "devextreme-react";
import {
  Chart,
  CommonSeriesSettings,
  Legend,
  Series,
  Tooltip,
} from "devextreme-react/chart";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useReducer, useState } from "react";
import ButtonShowSearchPanel from "../CallSummary/Rpt_Call/components/Tabs_RptCall/Tab_Call/buttonShowSearchPanel";
import "./style.scss";

const Rpt_ETTicketProcessingOverdueByAgent = () => {
  const { t } = useI18n("Rpt_ETTicketProcessingOverdueByAgent");
  const api = useClientgateApi();
  const { auth } = useAuth();
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
      "Rpt_ETTicketProcessingOverdueByAgent_GetTicketType",
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
          ...searchCondition,
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
          ProcessTimeFrom: searchCondition.ProcessTimeFrom,
          ProcessTimeTo: searchCondition.ProcessTimeTo
            ? searchCondition.ProcessTimeTo
            : null,
        };

        const response = await api.RptETTicketProcessingOverdueByAgent_Search(
          customize
        );
        if (response.isSuccess) {
          const data = response.Data
            ? response.Data.Lst_Rpt_ET_Ticket_ProcessingOverdue_ByAgent ?? []
            : [];
          console.log("data ", data);
          const customize = data.map((item: any) => {
            return {
              ...item,
              Data_EticketType: Object.entries(
                JSON.parse(item.Data_EticketType)
              ).reduce((result: any[], item: any) => {
                console.log("item ", item);
                return [
                  ...result,
                  {
                    [`${item[0]}`]: item[1] === "" ? 0 : parseFloat(item[1]),
                  },
                ];
              }, []),
            };
          });
          const fieldType = customize[0].Data_EticketType.map((item: any) => {
            return Object.keys(item)[0];
          });
          const result = customize
            .map((item: any) => {
              return item.Data_EticketType;
            }, [])
            .map((item: any, index: number) => {
              return {
                field: data[index].AgentName,
                ...item.reduce((acc: any, itemValue: any) => {
                  return {
                    ...acc,
                    ...itemValue,
                  };
                }, {}),
              };
            });
          return {
            fieldType: fieldType,
            customize: result,
          };
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

  const searchColumn: ColumnOptions[] = [
    {
      colSpan: 2,
      visible: true,
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
      colSpan: 2,
      visible: true,
      dataField: "OrgIDConditionList", // chi nhánh
      caption: t("OrgIDConditionList"),
      editorType: "dxSelectBox",
      label: {
        text: t("OrgIDConditionList"),
      },
      validationRules: [RequiredField(t("OrgIDConditionList is required"))],

      editorOptions: {
        dataSource: dataNNT ?? [],
        valueExpr: "OrgID",
        searchExpr: ["NNTFullName", "MST"],
        displayExpr: "NNTFullName",
        searchEnabled: true,
      },
    },
    {
      colSpan: 2,
      visible: true,
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
        )
      ],
    },
    {
      colSpan: 2,
      visible: true,
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
      colSpan: 2,
      visible: true,
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
      colSpan: 2,
      visible: true,
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

  const hanldeSearch = (data: any) => {
    isLoading();
    // refetch();
  };

  return (
    <AdminContentLayout className={"Category_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <p className="header-title p-2">
          {t("Rpt_ETTicketProcessingOverdueByAgent")}
        </p>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              colCount={2}
              conditionFields={searchColumn}
              storeKey="Rpt_ETTicketProcessingOverdueByAgent"
              data={searchCondition}
              onSearch={hanldeSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <ButtonShowSearchPanel />

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
            {key !== "0" &&
              !isLoadingValue &&
              data?.fieldType &&
              data?.customize &&
              data && (
                <div className="h-[70%] mt-2 mx-2">
                  <Chart
                    id="chart"
                    className="chart-report h-full"
                    dataSource={data ? data?.customize ?? [] : []}
                  >
                    <CommonSeriesSettings
                      barWidth={100}
                      argumentField="field"
                      type="stackedBar"
                    ></CommonSeriesSettings>
                    {data.fieldType.map((item: any) => {
                      // console.log("item ", item);
                      return <Series valueField={item} name={item} />;
                    })}
                    {/* <Series valueField="Tư vấn" name="Tư vấn" />
                  <Series valueField="Khiếu nại" name="Khiếu nại" />
                  <Series valueField="Missed Call" name="Missed Call" /> */}
                    <Legend
                      itemsAlignment="center"
                      verticalAlignment="top"
                      horizontalAlignment="right"
                      itemTextPosition="right"
                    />
                    {/* <Export enabled={true} /> */}
                    <Tooltip enabled={true} />
                  </Chart>
                </div>
              )}
            <div className="Rpt_ETTicketProcessingOverdueByAgent-manager"></div>
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Rpt_ETTicketProcessingOverdueByAgent;
