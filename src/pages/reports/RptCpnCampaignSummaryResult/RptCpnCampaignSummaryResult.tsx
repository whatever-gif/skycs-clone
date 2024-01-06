import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import {
  RequiredField,
  requiredType,
} from "@/packages/common/Validation_Rules";
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

const RptCpnCampaignSummaryResult = () => {
  const { t } = useI18n("Rpt_CpnCampaignSummaryResult");
  const api = useClientgateApi();
  const pivotRef: any = useRef();
  const [searchCondition, setSearchCondition] = useState({
    MST: "",
    CampaignCode: "",
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

  const {
    data: dataCampaign,
    isLoading: isLoadingCampaign,
    refetch: refetcCapmaign,
  } = useQuery({
    queryKey: ["Cpn_Campaign_Search_Report"],
    queryFn: async () => {
      const response = await api.Cpn_Campaign_Search({
        Ft_PageSize: 1000,
        Ft_PageIndex: 0,
      });
      if (response.isSuccess) {
        return response.DataList;
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
        const response = await api.RptCpnCampaignSummaryResult_Search(
          searchCondition
        );
        if (response.isSuccess) {
          // console.log("response ", response);
          const data = response.Data
            ? response.Data.Rpt_Cpn_CampaignSummaryResult ?? []
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
      dataField: "MST",
      caption: t("MST"),
      editorType: "dxSelectBox",
      label: {
        text: t("MST"),
      },
      editorOptions: {
        dataSource: dataNNT ?? [],
        searchExpr: ["NNTFullName", "MST"],
        valueExpr: "MST",
        displayExpr: "NNTFullName",
        searchEnabled: true,
      },
      validationRules: [RequiredField("MST")],
    },
    {
      visible: true,
      dataField: "CampaignCode",
      caption: t("CampaignCode"),
      label: {
        text: t("CampaignCode"),
      },
      editorType: "dxSelectBox",
      editorOptions: {
        dataSource: dataCampaign ?? [],
        searchExpr: ["CampaignCode", "CampaignName"],
        valueExpr: "CampaignCode",
        displayExpr: "CampaignName",
        searchEnabled: true,
      },
      validationRules: [requiredType],
    },
  ];

  const handleSearch = (data: any) => {
    isLoading();
    // refetch();
  };

  return (
    <AdminContentLayout className={"Category_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <p className="header-title p-2">{t("Rpt_CpnCampaignSummaryResult")}</p>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              conditionFields={searchColumn}
              storeKey="report/RptCpnCampaignSummaryResult"
              data={searchCondition}
              onSearch={handleSearch}
              permission="MNU_RPT_CPNCAMPAIGN_SUMMARY_RESULT_SEARCH"
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <ButtonShowSearchPanel />

            <LoadPanel
              container={".dx-viewport"}
              shadingColor="rgba(0,0,0,0.4)"
              position={"center"}
              visible={isLoadingCampaign || isLoadingNNT || isLoadingValue}
              showIndicator={true}
              showPane={true}
            />
            <div className="flex align-items-start justify-content-center h-full py-4">
              {key !== "0" && !isLoadingValue && (
                <div className="flex align-items-center">
                  <PieChart
                    type="doughnut"
                    id="pieChart"
                    // palette="Bright"
                    width={400}
                    height={350}
                    animation={{
                      duration: 1000,
                    }}
                    ref={pivotRef}
                    dataSource={data ?? []}
                  >
                    <PieSeries
                      argumentField="CusFBName"
                      valueField="ValCusFeedback"
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
                      horizontalAlignment="center"
                      verticalAlignment="bottom"
                      margin={20}
                    />
                    <Tooltip enabled={true} contentRender={TooltipTemplate} />
                    {data.map((item: Rpt_Cpn_CampaignSummaryResult) => (
                      <Annotation
                        key={item.CusFBName}
                        data={item.ValCusFeedback}
                      ></Annotation>
                    ))}
                  </PieChart>

                  <div className="flex justify-center mt-[20px] transform-state">
                    <div className="table-pivot-content">
                      <table className="pivot-table">
                        <tr className="header">
                          <th className="th-header">
                            {t("Feedback of customer")}
                          </th>
                          <th className="th-header">{t("Quantity")}</th>
                          <th className="th-header">{t("Percent (%)")}</th>
                        </tr>
                        {data.map((item: Rpt_Cpn_CampaignSummaryResult) => {
                          return (
                            <tr>
                              <td className="td-content">{item.CusFBName}</td>
                              <td className="td-content text-right">
                                {item.QtyFeedback}
                              </td>
                              <td className="td-content text-right">
                                {item.ValCusFeedback}
                              </td>
                            </tr>
                          );
                        })}
                        <tr>
                          <th className="td-content text-right">
                            {t("Total")}
                          </th>
                          <th className="td-content text-right">
                            {data.reduce(
                              (
                                total: number,
                                item: Rpt_Cpn_CampaignSummaryResult
                              ) => {
                                return total + item.QtyFeedback;
                              },
                              0
                            )}
                          </th>
                          <th className="td-content text-right">
                            {data.reduce(
                              (
                                total: number,
                                item: Rpt_Cpn_CampaignSummaryResult
                              ) => {
                                return total + item.ValCusFeedback;
                              },
                              0
                            )}
                          </th>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="RptCpnCampaignSummaryResult-manager"></div>
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default RptCpnCampaignSummaryResult;
