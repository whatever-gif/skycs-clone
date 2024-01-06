import {
  getLastDateOfMonth,
  getYearMonth,
  getYearMonthDate,
} from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import {
  RequiredDateTimeFollowMonth,
  RequiredDateTimeMonth,
  RequiredField,
} from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { ContentSearchPanelLayout } from "@/packages/layouts/content-searchpanel-layout";
import { showErrorAtom } from "@/packages/store";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { useQuery } from "@tanstack/react-query";
import { LoadPanel } from "devextreme-react";
import {
  ArgumentAxis,
  Chart,
  CommonSeriesSettings,
  Grid,
  Label,
  Legend,
  Margin,
  Series,
  Tooltip,
} from "devextreme-react/chart";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useReducer, useRef, useState } from "react";
import ButtonShowSearchPanel from "../CallSummary/Rpt_Call/components/Tabs_RptCall/Tab_Call/buttonShowSearchPanel";
import "./style.scss";

const RptETTicketVolatility = () => {
  const { t } = useI18n("Rpt_ETTicketVolatility");
  const api = useClientgateApi();
  const { auth } = useAuth();
  const [searchCondition] = useState({
    OrgIDConditionList: auth?.orgId ? auth?.orgId.toString() : "",
    CreateDTimeUTC: [null, null],
  });
  const gridRef = useRef<any>();
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
    data,
    isLoading: isLoadingValue,
    refetch,
  } = useQuery({
    queryKey: ["RptETTicketVolatility_Search", key],
    queryFn: async () => {
      if (key !== "0") {
        const customizeParam: any = {
          ...searchCondition,
          OrgIDConditionList: searchCondition.OrgIDConditionList,
          CreateDTimeUTCFrom: searchCondition.CreateDTimeUTC[0]
            ? getYearMonthDate(searchCondition.CreateDTimeUTC[0])
            : null,
          CreateDTimeUTCTo: searchCondition.CreateDTimeUTC[1]
            ? getLastDateOfMonth(searchCondition.CreateDTimeUTC[1])
            : null,
        };

        delete customizeParam.CreateDTimeUTC;

        const response = await api.RptETTicketVolatility_Search(customizeParam);
        if (response.isSuccess) {
          const data = response.Data
            ? response.Data.Lst_Rpt_ET_Ticket_Volatility ?? []
            : [];
          const listField = Object.keys(JSON.parse(data[0].Data_EticketType));
          const customize = data.map((item: any) => {
            const newValue = JSON.parse(item.Data_EticketType);
            const custom = Object.keys(newValue)
              .map((item, index) => {
                let value = 0;
                const v = Object.values(newValue).map((i: any) =>
                  parseFloat(i)
                );
                if (v) {
                  value = v[index];
                }
                return {
                  [item]: value,
                };
              })
              .reduce((acc, i) => {
                return {
                  ...acc,
                  ...i,
                };
              }, {});

            const obj = {
              ...item,
              ...custom,
            };
            delete obj.Data_EticketType;
            return obj;
          });

          const getDateFirst = searchCondition.CreateDTimeUTC[0]
            ? getYearMonth(searchCondition.CreateDTimeUTC[0])
            : "";
          const getDateLast = searchCondition.CreateDTimeUTC[1]
            ? getYearMonth(searchCondition.CreateDTimeUTC[1])
            : "";

          console.log(
            "customize ",
            customize,
            "search ",
            searchCondition.CreateDTimeUTC
          );

          return {
            listField: listField,
            dataReport: customize,
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

  const searchColumn: any[] = [
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
      validationRules: [RequiredField(t("OrgIDConditionList is required"))],
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
        RequiredDateTimeMonth(
          t("The limit search is only 2 month so please choose again"),
          2
        ),
      ],
    },
  ];

  const hanldeSearch = (data: any) => {
    isLoading();
    // refetch();
  };

  // const columns = useMemo(() => {
  //   const defaultColumn: ColumnOptions[] = [
  //     {
  //       dataField: "CreateDate",
  //       caption: "Create Date",
  //     },
  //   ];

  //   if (!isLoadingValue && data) {
  //     const arr = data?.listField ?? [];
  //     return [
  //       ...defaultColumn,
  //       ...arr.map((item: any) => {
  //         return {
  //           dataField: item,
  //           caption: item,
  //         };
  //       }),
  //     ];
  //   }

  //   return defaultColumn;
  // }, [isLoadingValue]);

  return (
    <AdminContentLayout className={"Category_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <p className="header-title p-2">{t("Rpt_ETTicketVolatility")}</p>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              conditionFields={searchColumn}
              storeKey="Rpt_ETTicketVolatility"
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
              visible={isLoadingNNT || isLoadingValue}
              showIndicator={true}
              showPane={true}
            />
            {key !== "0" && !isLoadingValue && data && (
              <div className="h-[full]">
                <div className="h-[90%]">
                  <Chart
                    id="chart"
                    className="h-full"
                    palette="Violet"
                    dataSource={data?.dataReport}
                  >
                    <CommonSeriesSettings
                      argumentField="CreateDate"
                      ignoreEmptyPoints={true}
                      type="line"
                    >
                      <Label
                        position="bottom"
                        visible={false}
                        horizontalAlignment="center"
                        displayMode="standard"
                      />
                    </CommonSeriesSettings>
                    {data.listField.map((item: any) => {
                      return (
                        <Series key={item} valueField={item} name={item} />
                      );
                    })}
                    <Margin bottom={20} />
                    <ArgumentAxis
                      valueMarginsEnabled={false}
                      discreteAxisDivisionMode="crossLabels"
                    >
                      <Grid visible={true} />
                    </ArgumentAxis>
                    <Legend
                      verticalAlignment="bottom"
                      horizontalAlignment="center"
                      itemTextPosition="bottom"
                    />
                    <Tooltip enabled={true} />
                  </Chart>
                </div>
                <GridViewCustomize
                  isHidenHeaderFilter={true}
                  defaultPageSize={9999999}
                  allowSelection={false}
                  columns={[]}
                  customerHeight={"auto"}
                  ref={gridRef}
                  isHiddenCheckBox={true}
                  onSelectionChanged={() => {}}
                  storeKey={""}
                  dataSource={data?.dataReport ?? []}
                  isLoading={false}
                  editable={false}
                />
              </div>
            )}
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default RptETTicketVolatility;
