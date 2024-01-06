import { getFirstDateOfMonth, getLastDateOfMonth } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import {
  RequiredDateTimeFollowMonth,
  RequiredField,
} from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { ContentSearchPanelLayout } from "@/packages/layouts/content-searchpanel-layout";
import { showErrorAtom } from "@/packages/store";
import { Rpt_Cpn_CampaignSummaryResult } from "@/packages/types";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { ColumnOptions } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { LoadPanel } from "devextreme-react";
import PieChart, {
  Annotation,
  Label,
  Legend,
  Series as PieSeries,
  Tooltip,
} from "devextreme-react/pie-chart";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useReducer, useRef, useState } from "react";
import ButtonShowSearchPanel from "../CallSummary/Rpt_Call/components/Tabs_RptCall/Tab_Call/buttonShowSearchPanel";
import TooltipTemplate from "../Rpt_SLAController/components/TooltipTemplate";
import "./style.scss";

const RptTicketTypeSynthesis = () => {
  const { t } = useI18n("RptTicketTypeSynthesis");
  const api = useClientgateApi();
  const pivotRef: any = useRef();
  const { auth } = useAuth();
  const [searchCondition, setSearchCondition] = useState({
    OrgIDConditionList: auth?.orgId ? auth?.orgId.toString() : "",
    CreateDTimeUTC: [null, null],
  });

  const showError = useSetAtom(showErrorAtom);
  const [key, isLoading] = useReducer(() => {
    return nanoid();
  }, "0");

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

  const { data, isLoading: isLoadingValue } = useQuery({
    queryKey: ["RptTicketTypeSynthesis_Search", key],
    queryFn: async () => {
      if (key !== "0") {
        const customizeParam = {
          ...searchCondition,
          OrgIDConditionList: searchCondition.OrgIDConditionList,
          CreateDTimeUTCFrom: searchCondition.CreateDTimeUTC[0]
            ? getFirstDateOfMonth(searchCondition.CreateDTimeUTC[0])
            : null,
          CreateDTimeUTCTo: searchCondition.CreateDTimeUTC[1]
            ? getLastDateOfMonth(searchCondition.CreateDTimeUTC[1])
            : null,
        };
        const response = await api.RptTicketTypeSynthesis_Search(
          customizeParam
        );
        if (response.isSuccess) {
          // console.log("response ", response);
          const data = response.Data
            ? response.Data.Lst_Rpt_TicketType_Synthesis ?? []
            : [];

          const customize = data.map((item: any) => {
            return {
              ...item,
              ValCusFeedback: parseFloat(item.ValCusFeedback),
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

  const searchColumn: ColumnOptions[] = [
    {
      visible: true,
      dataField: "OrgIDConditionList",
      caption: t("OrgIDConditionList"),
      editorType: "dxSelectBox",
      label: {
        text: t("OrgIDConditionList"),
      },
      validationRules: [RequiredField(t("OrgIDConditionList"))],
      editorOptions: {
        dataSource: dataNNT ?? [],
        searchExpr: ["NNTFullName", "MST"],
        valueExpr: "OrgID",
        displayExpr: "NNTFullName",
        searchEnabled: true,
        calendarOptions: {
          maxZoomLevel: "year",
        },
      },
    },
    {
      visible: true,
      dataField: "CreateDTimeUTC",
      caption: t("CreateDTimeUTC"),
      label: {
        text: t("CreateDTimeUTC"),
      },
      editorType: "dxDateRangeBox",
      editorOptions: {
        type: "date",
        calendarOptions: {
          maxZoomLevel: "year",
        },
        displayFormat: "yyyy-MM",
      },
      validationRules: [
        RequiredDateTimeFollowMonth(t("CreateDTimeUTC is Required"), 1),
      ],
    },
  ];

  const handleSearch = (data: any) => {
    isLoading();
    // refetch();
  };

  return (
    <AdminContentLayout className={"Category_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <p className="header-title p-2">{t("Rpt_TicketTypeSynthesis")}</p>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              conditionFields={searchColumn}
              storeKey="Rpt_TicketTypeSynthesis"
              data={searchCondition}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <LoadPanel
              container={".dx-viewport"}
              shadingColor="rgba(0,0,0,0.4)"
              position={"center"}
              visible={isLoadingNNT || isLoadingValue}
              showIndicator={true}
              showPane={true}
            />
            <ButtonShowSearchPanel />
            <div className="flex align-items-center flex-column h-full py-4 ">
              {key !== "0" && !isLoadingValue && (
                <div className="flex align-items-start h-full justify-space-between ">
                  <PieChart
                    height={350}
                    type="doughnut"
                    id="pieChart"
                    width={500}
                    // palette="Bright"
                    animation={{
                      duration: 1000,
                    }}
                    ref={pivotRef}
                    dataSource={data ?? []}
                  >
                    <PieSeries
                      argumentField="CustomerTicketTypeName"
                      valueField="Percent"
                    >
                      <Label
                        visible={true}
                        customizeText={(data: any) => {
                          return `${data.percentText}`;
                        }}
                        position="inside"
                      />
                    </PieSeries>
                    <Legend
                      orientation="horizontal"
                      itemTextPosition="right"
                      margin={30}
                      horizontalAlignment="center"
                      verticalAlignment="bottom"
                      itemsAlignment="center"
                    />
                    <Tooltip enabled={true} contentRender={TooltipTemplate} />
                    {data.map((item: Rpt_Cpn_CampaignSummaryResult) => (
                      <Annotation
                        key={item.CusFBName}
                        data={item.ValCusFeedback}
                      ></Annotation>
                    ))}
                  </PieChart>
                  <div
                    className="transform-state"
                    style={
                      {
                        // transform: "translate(-25% , 0)",
                      }
                    }
                  >
                    <div className="table-pivot-content">
                      <table className="pivot-table">
                        <tr className="header">
                          <th className="th-header">{t("Type of Eticket")}</th>
                          <th className="th-header">{t("Quantity")}</th>
                          <th className="th-header">{t("Percent (%)")}</th>
                        </tr>
                        {data.map((item: any) => {
                          return (
                            <tr>
                              <td className="td-content">
                                {item.CustomerTicketTypeName}
                              </td>
                              <td className="td-content text-right">
                                {item.QtyTicket}
                              </td>
                              <td className="td-content text-right">
                                {item.Percent}
                              </td>
                            </tr>
                          );
                        })}
                        <tr>
                          <td className="td-content">{t("Total")}</td>
                          <td className="td-content text-right">
                            {data.reduce((acc, item) => {
                              return acc + item.QtyTicket;
                            }, 0)}
                          </td>
                          <td className="td-content text-right"></td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default RptTicketTypeSynthesis;
