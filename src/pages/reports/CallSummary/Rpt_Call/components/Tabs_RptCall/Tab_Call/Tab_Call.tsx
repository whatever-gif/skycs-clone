import PermissionContainer from "@/components/PermissionContainer";
import {
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getYearMonthDate,
} from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { callApi } from "@/packages/api/call-api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { ContentSearchPanelLayout } from "@/packages/layouts/content-searchpanel-layout";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { showErrorAtom } from "@/packages/store";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { useQuery } from "@tanstack/react-query";
import { Button, LoadPanel } from "devextreme-react";
import {
  ArgumentAxis,
  Chart,
  Label,
  Legend,
  Series,
  Tooltip,
} from "devextreme-react/chart";
import { IItemProps } from "devextreme-react/form";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import {
  memo,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import ButtonShowSearchPanel from "./buttonShowSearchPanel";
import "./style.scss";

const Tab_Call = () => {
  const { t } = useI18n("Rpt_Call");
  const showError = useSetAtom(showErrorAtom);
  const [formartDate, setFormatDate] = useState("day");
  const [active, setActive] = useState("Total");

  const [key, reloading] = useReducer(() => {
    return nanoid();
  }, "0");

  let arr = [
    "Incoming_Missed",
    // "Outgoing_Rejected",
    // "Outgoing_Cancel",
    // "Outgoing_Missed",
  ];

  const sortArr = [
    "Total",
    "Incoming",
    "Incoming_Succeed",
    "Incoming_Cancel",
    "Incoming_Rejected",
    "Outgoing",
    "Outgoing_Succeed",
    "Outgoing_Missed",
    "TalkTime",
    "TalkTime_Incomming",
    "TalkTime_Outgoing",
    "TalkTime_Average",
    "HoldTime_Average",
    "WaitTime_Average",
  ];

  const chartRef: any = useRef(null);
  const [formSearchData, setFormSearchData] = useState<any>({
    period: "day",
    fromDate: [new Date(new Date(Date.now())), new Date(new Date(Date.now()))],
    agentId: 0,
    ccNumber: "",
    callType: "All",
    rptType: "Total",
  });

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

  // console.log("dataOrg ____ ", dataOrg);

  const { auth } = useAuth();
  const handleSearch = async (data: any) => {
    const obj = {
      ...data,
    };
    refetch();
    setFormSearchData(obj);
    reloading();
  };

  const windowSize = useWindowSize();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["rpt_GetCallSummary", key],
    queryFn: async () => {
      const condition = {
        ...formSearchData,
        fromDate:
          formSearchData.period === "day"
            ? formSearchData.fromDate[0]
              ? getYearMonthDate(formSearchData.fromDate[0])
              : null
            : formSearchData.fromDate[0]
            ? getFirstDateOfMonth(formSearchData.fromDate[0])
            : null,
        toDate:
          formSearchData.period === "day"
            ? formSearchData.fromDate[1]
              ? getYearMonthDate(formSearchData.fromDate[1])
              : null
            : formSearchData.fromDate[1]
            ? getLastDateOfMonth(formSearchData.fromDate[1])
            : null,
      };
      const response: any = await callApi.rpt_GetCallSummary(auth.networkId, {
        ...condition,
      });

      if (response.Success) {
        console.log("response.Data ", response.Data);

        const customize: any[] = Object.keys(response.Data)
          .filter((item) => {
            return item !== "DataList";
          })
          .map((item) => {
            return {
              text: item,
              number: response.Data[item],
            };
          })
          .filter((item) => {
            return !arr.includes(item.text);
          });

        const r = sortArr.map((item) => {
          const check = customize.find((i) => i.text === item);
          if (check) {
            return check;
          } else {
            return {
              text: item,
              number: "Không có dữ liệu",
            };
          }
        });

        const result = {
          reportData: r ?? [],
          DataList: response.Data.DataList.map((itemValue: any) => {
            const obj = {
              ...itemValue,
              val: itemValue.Count,
            };

            delete obj.Count;

            return obj;
          }),
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

  console.log("data ", data);

  const formSearch = useMemo(() => {
    return [
      {
        dataField: "period",
        caption: t("period"),
        editorType: "dxSelectBox",
        visible: true,
        label: {
          text: t("period"),
        },
        validationRules: [requiredType],
        editorOptions: {
          dataSource: [
            {
              title: t("Day"),
              value: "day",
            },
            {
              title: t("Month"),
              value: "month",
            },
          ],
          valueExpr: "value",
          displayExpr: "title",
          onValueChanged: (param: any) => {
            setFormatDate(param.value);
          },
        },
      },
      {
        dataField: "fromDate", // dealine
        caption: t("fromDate"),
        label: {
          text: t("fromDate"),
        },
        visible: true,
        validationRules: [requiredType],
        editorOptions: {
          type: "date",
          calendarOptions: {
            maxZoomLevel: formartDate === "day" ? "month" : "year",
          },
          displayFormat: formartDate === "day" ? "yyyy-MM-dd" : "yyyy-MM",
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
    ] as IItemProps[];
  }, [formartDate, isLoadingOrgInfo]);

  const handleSetActive = useCallback((text: string) => {
    setActive(text);
    setFormSearchData((prev: any) => {
      return {
        ...prev,
        rptType: text,
      };
    });
    reloading();
  }, []);

  const exportChart = () => {
    chartRef.current._instance.exportTo(
      `Báo Cáo Thống Kê Cuộc Gọi ${getYearMonthDate(new Date(Date.now()))}`,
      "png"
    );
  };

  return (
    <AdminContentLayout className={"ReportCall_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderNoSearchLayout>
          <PageHeaderNoSearchLayout.Slot name={"Before"}>
            <div className="text-header font-bold dx-font-m">
              {t("Report_Call")}
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
        <div className="flex h-full">
          <div className="w-full h-full">
            <ContentSearchPanelLayout>
              <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
                <div className="search-call h-full">
                  <SearchPanelV2
                    storeKey="ReportCall_Search"
                    conditionFields={formSearch}
                    data={formSearchData}
                    onSearch={handleSearch}
                  />
                </div>
              </ContentSearchPanelLayout.Slot>
              <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
                <div className="w-full h-full" style={{ overflow: "auto" }}>
                  <LoadPanel visible={isLoading || isLoadingOrgInfo} />
                  {!isLoading && !isLoadingOrgInfo && (
                    <div className="flex pr-5">
                      <div
                        className="border-r-2 "
                        style={{ minWidth: "300px" }}
                      >
                        {data?.reportData?.map((item: any) => {
                          return (
                            <div
                              key={nanoid()}
                              className={`flex items-center gap-1 button-item justify-content-between ${
                                active === item.text ? "active" : ""
                              }`}
                              onClick={() => handleSetActive(item.text)}
                            >
                              <div className="font-semibold">
                                {t(item.text)}
                              </div>
                              <div className="font-semibold text-right">
                                {t(item.number ?? "0")}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="pr-5 py-1" style={{ width: "100%" }}>
                        <ButtonShowSearchPanel />
                        <PermissionContainer
                          permission={"BTN_RPTCALL_EXPORTEXCEL"}
                        >
                          <Button
                            icon="export"
                            text="Export"
                            onClick={exportChart}
                          />
                        </PermissionContainer>

                        <Chart
                          id="chart"
                          ref={chartRef}
                          dataSource={data?.DataList ?? []}
                          className="flex-1"
                          // width={windowSize.width - 500}
                        >
                          <Tooltip enabled={true} />
                          <Series argumentField="Time" />
                          <ArgumentAxis>
                            <Label
                              wordWrap="none"
                              overlappingBehavior="rotate"
                            />
                          </ArgumentAxis>
                          <Legend visible={false} />
                        </Chart>
                      </div>
                    </div>
                  )}
                </div>
              </ContentSearchPanelLayout.Slot>
            </ContentSearchPanelLayout>
          </div>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default memo(Tab_Call);
