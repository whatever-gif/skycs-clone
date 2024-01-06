import { AdminContentLayout } from "@layouts/admin-content-layout";

import { useI18n } from "@/i18n/useI18n";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";

import { useClientgateApi } from "@/packages/api";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";
import { useConfiguration } from "@packages/hooks";
import { authAtom, showErrorAtom } from "@packages/store";
import { toast } from "react-toastify";
import { selectedItemsAtom } from "../components/store";
import "./Rpt_ETTicketSynthesisController.scss";

import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { Button, DateRangeBox } from "devextreme-react";
import {
  ArgumentAxis,
  Chart,
  CommonAxisSettings,
  CommonSeriesSettings,
  Export,
  Format,
  Grid,
  Label,
  Legend,
  Margin,
  Series,
  Tooltip,
} from "devextreme-react/chart";
import { nanoid } from "nanoid";

import { format } from "date-fns";

import { checkPermision } from "@/components/PermissionContainer";
import { getFirstDateOfMonth } from "@/components/ulti";
import {
  RequiredDateTimeMonth,
  RequiredField,
} from "@/packages/common/Validation_Rules";
import { FlagActiveEnum } from "@/packages/types";
import { ColumnOptions } from "@/types";
import { match } from "ts-pattern";
import { groupTicketsByDate } from "../components/FormatDataTicket";

export const Rpt_ETTicketSynthesisControllerPage = () => {
  const { t } = useI18n("Rpt_ETTicketSynthesisController");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const [key, isLoadingSearch] = useReducer(() => {
    return nanoid();
  }, "0");
  const now = new Date();
  const endDate = new Date(now.getTime());
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const auth = useAtomValue(authAtom);

  const [searchCondition, setSearchCondition] = useState<any>({
    AgentCodeConditionList: "",
    DepartmentCodeConditionList: "",
    OrgIDConditionList: [auth.orgId.toString()],
    TicketTypeConditionList: "",
    CustomerName: "",
    CustomerCodeSys: "",
    CustomerPhoneNo: "",
    CustomerEmail: "",
    CustomerCompany: "",
    TicketStatusConditionList: "",
    MonthReport: [firstDay, endDate],
    MonthUpdate: [null, null],
    TicketCustomTypeConditionList: [],
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const {
    data: getTicketCustomerType,
    isLoading: isLoadingTicketCustomerType,
  } = useQuery({
    queryKey: [
      "Mst_TicketCustomType_GetAllActive",
      "Rpt_ETTicketSynthesisController_TicketCustomType",
    ],
    queryFn: async () => {
      const response = await api.Mst_TicketCustomType_GetAllActive();

      if (response.isSuccess) {
        return response.Data.Lst_Mst_TicketCustomType?.filter(
          (item: any) => item?.OrgID == auth.orgId.toString()
        )?.filter((item: any) => item?.FlagActive == "1");
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

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "Rpt_ETTicketSynthesisController",
      JSON.stringify(searchCondition),
      key,
    ],
    queryFn: async () => {
      if (key !== "0") {
        const resp = await api.Rpt_ETTicketSynthesisController_Search({
          AgentCodeConditionList: searchCondition.AgentCodeConditionList
            ? searchCondition.AgentCodeConditionList.join(",")
            : "",
          DepartmentCodeConditionList:
            searchCondition.DepartmentCodeConditionList
              ? searchCondition.DepartmentCodeConditionList.join(",")
              : "",
          OrgIDConditionList:
            searchCondition.OrgIDConditionList.length > 0
              ? searchCondition.OrgIDConditionList.join(",")
              : "",
          TicketTypeConditionList: searchCondition.TicketTypeConditionList
            ? searchCondition.TicketTypeConditionList.join(",")
            : "",
          CustomerName: "",
          CustomerCodeSys: searchCondition.CustomerCodeSys
            ? searchCondition.CustomerCodeSys
            : "",
          CustomerPhoneNo: searchCondition.CustomerPhoneNo
            ? searchCondition.CustomerPhoneNo
            : "",
          CustomerEmail: searchCondition.CustomerEmail
            ? searchCondition.CustomerEmail
            : "",
          CustomerCompany: searchCondition.CustomerCompany
            ? searchCondition.CustomerCompany
            : "",
          TicketStatusConditionList: searchCondition.TicketStatusConditionList
            ? searchCondition.TicketStatusConditionList.join(",")
            : "",
          CreateDTimeUTCFrom: searchCondition.MonthReport[0]
            ? format(searchCondition.MonthReport[0], "yyyy-MM-dd")
            : "",
          CreateDTimeUTCTo: searchCondition.MonthReport[1]
            ? format(searchCondition.MonthReport[1], "yyyy-MM-dd")
            : "",
          LUDTimeUTCFrom: searchCondition.MonthUpdate[0]
            ? format(searchCondition.MonthUpdate[0], "yyyy-MM-dd")
            : "",
          LUDTimeUTCTo: searchCondition.MonthUpdate[1]
            ? format(searchCondition.MonthUpdate[1], "yyyy-MM-dd")
            : "",
          TicketCustomTypeConditionList:
            searchCondition.TicketCustomTypeConditionList
              ? searchCondition.TicketCustomTypeConditionList.join(",")
              : "",
        });
        return resp;
      } else {
        return null;
      }
    },
  });
  // const { data: CampaignList } = useQuery(["listMST"], () =>
  //   api.Cpn_CampaignAgent_GetActive()
  // );
  const { data: listOrgID } = useQuery(["listOrgID"], () =>
    api.Mst_NNTController_GetAllActive()
  );

  const { data: listUser } = useQuery(["listAgent"], async () => {
    const resp: any = await api.Sys_User_GetAllActive();

    return resp?.DataList?.filter(
      (item: any) => item?.OrgID == auth.orgId.toString()
    );
  });

  const { data: getListDepart, isLoading: isLoadingListDepart } = useQuery({
    queryKey: ["Mst_DepartmentControl_GetAllActive"],
    queryFn: async () => {
      const response = await api.Mst_DepartmentControl_GetAllActive();
      if (response.isSuccess) {
        return response.DataList ?? [];
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
    },
  });
  const { data: getListEticketType, isLoading: isLoadingListEticketType } =
    useQuery({
      queryKey: [
        "Mst_TicketEstablishInfoApi_GetTicketType",
        "Rpt_ETTicketSynthesisController_GetTicketType",
      ],
      queryFn: async () => {
        const response = await api.Mst_TicketEstablishInfoApi_GetTicketType();
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
          return [];
        }
      },
    });

  const { data: getEnterprise, isLoading: isLoadingEnterprise } = useQuery({
    queryKey: ["Mst_Customer_Search_Eticket_Manager"],
    queryFn: async () => {
      const response = await api.Mst_Customer_Search({
        Ft_PageIndex: 0,
        Ft_PageSize: 1000000000000,
        FlagActive: FlagActiveEnum.Active,
        CustomerType: "TOCHUC",
        OrgID: auth.orgId,
      });

      if (response.isSuccess) {
        return (
          response.DataList?.filter(
            (item: any) => item?.OrgID == auth.orgId.toString()
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
  const { data: listCustomer, isLoading: isLoadinglistCustomer } = useQuery({
    queryKey: ["Mst_Customer_Search_EticketGetAllActive"],
    queryFn: async () => {
      const response = await api.Mst_Customer_GetAllActive();

      if (response.isSuccess) {
        return (
          response.DataList?.filter(
            (item: any) => item?.OrgID == auth.orgId.toString()
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

  const { data: TicketEstablishInfo, refetch: getTickStatus } = useQuery({
    queryKey: ["Mst_TicketEstablishInfoApi_GetAllInfo__MissCall"],
    queryFn: async () => {
      const response = await api.Mst_TicketEstablishInfoApi_GetAllInfo();
      if (response.isSuccess) {
        if (response.Data) {
          return (
            response.Data.Lst_Mst_TicketStatus.filter(
              (i: any) => i.FlagActive !== "0"
            ) ?? []
          );
        }
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
    },
  });

  useEffect(() => {
    getTickStatus();
  }, []);

  const formItems: ColumnOptions[] = [
    {
      dataField: "AgentCodeConditionList",
      caption: t("AgentCodeConditionList"),
      label: {
        text: t("Agent list"),
      },
      visible: true,
      editorType: "dxTagBox",
      editorOptions: {
        readOnly: false,
        searchEnabled: true,
        dataSource: listUser ?? [],
        displayExpr: "UserName",
        valueExpr: "UserCode",
      },
    },
    {
      caption: t("DepartmentCodeConditionList"),
      dataField: "DepartmentCodeConditionList",
      label: {
        text: t("Team"),
      },
      visible: true,
      editorType: "dxTagBox",
      editorOptions: {
        dataSource:
          getListDepart?.filter(
            (item: any) => item.OrgID === auth.orgId.toString()
          ) ?? [],
        valueExpr: "DepartmentCode",
        displayExpr: "DepartmentName",
        searchEnabled: true,
      },
    },
    {
      caption: t("OrgIDConditionList"),
      validationRules: [RequiredField(t("OrgIDConditionList"))],
      dataField: "OrgIDConditionList",
      label: {
        text: t("Chi nhánh"),
      },
      visible: true,
      editorType: "dxTagBox",
      editorOptions: {
        searchEnabled: true,
        dataSource:
          auth.orgId === auth.networkId
            ? listOrgID?.Data?.Lst_Mst_NNT
            : listOrgID?.Data?.Lst_Mst_NNT.filter(
                (item: any) => item.OrgID === auth.orgId.toString()
              ) ?? [],
        displayExpr: "NNTFullName",
        valueExpr: "OrgID",
      },
    },
    {
      caption: t("TicketTypeConditionList"),
      dataField: "TicketTypeConditionList",
      label: {
        text: t("Loại eTicket"),
      },
      visible: true,
      editorType: "dxTagBox",
      editorOptions: {
        searchEnabled: true,
        dataSource: getListEticketType ?? [],
        displayExpr: "CustomerTicketTypeName",
        valueExpr: "TicketType",
      },
    },
    {
      caption: t("TicketStatusConditionList"),
      dataField: "TicketStatusConditionList",
      label: {
        text: t("Trạng thái eTicket"),
      },
      visible: true,
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: TicketEstablishInfo ?? [],
        valueExpr: "TicketStatus",
        displayExpr: "AgentTicketStatusName",
        readOnly: false,
        placeholder: t("Select"),
      },
    },
    {
      caption: t("CustomerCodeSys"),
      dataField: "CustomerCodeSys",
      label: {
        text: t("Khách hàng"),
      },
      visible: true,
      editorType: "dxSelectBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Select"),
        dataSource: listCustomer,
        valueExpr: "CustomerCodeSys",
        displayExpr: "CustomerName",
        searchEnabled: true,
      },
    },
    {
      caption: t("CustomerCompany"),
      dataField: "CustomerCompany",
      label: {
        text: t("Doanh nghiệp"),
      },
      visible: true,
      editorType: "dxSelectBox",
      editorOptions: {
        dataSource: getEnterprise,
        displayExpr: "CustomerName",
        valueExpr: "CustomerCodeSys",
        searchEnabled: true,
      },
    },

    {
      dataField: "MonthReport",
      visible: true,
      caption: t("MonthReport"),
      label: {
        text: t("Thời gian tạo"),
      },
      editorType: "dxDateRangeBox",
      editorOptions: {
        type: "date",
        displayFormat: "yyyy-MM-dd",
      },
      validationRules: [
        RequiredDateTimeMonth(
          t("The limit search is only 2 month so please choose again"),
          2
        ),
      ],
      // render: ({ editorOptions, component: formRef }: any) => {
      //   return (
      //     <DateRangeBox
      //       displayFormat="yyyy-MM-dd"
      //       defaultStartDate={searchCondition.MonthReport[0]}
      //       defaultEndDate={searchCondition.MonthReport[1]}
      //       showClearButton={true}
      //       useMaskBehavior={true}
      //       openOnFieldClick={true}
      //       labelMode="hidden"
      //       onValueChanged={(e: any) => {
      //         formRef.instance().updateData("MonthReport", e.value);
      //       }}
      //     />
      //   );
      // },
    },
    {
      dataField: "MonthUpdate",
      visible: true,
      caption: t("MonthUpdate"),
      label: {
        text: t("Thời gian cập nhật"),
      },
      editorType: "dxDateRangeBox",
      editorOptions: {},
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <DateRangeBox
            displayFormat="yyyy-MM-dd"
            defaultStartDate={searchCondition?.MonthUpdate[0]}
            defaultEndDate={searchCondition.MonthUpdate[1]}
            showClearButton={true}
            useMaskBehavior={true}
            openOnFieldClick={true}
            labelMode="hidden"
            onValueChanged={(e: any) => {
              formRef.instance().updateData("MonthUpdate", e.value);
            }}
            validationError={RequiredDateTimeMonth(
              t("The limit search is only 2 month so please choose again"),
              2
            )}
          />
        );
      },
    },
    {
      dataField: "TicketCustomTypeConditionList",
      visible: true,
      caption: t("TicketCustomTypeConditionList"),
      label: {
        text: t("TicketCustomTypeConditionList"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: getTicketCustomerType ?? [],
        displayExpr: "CustomerTicketCustomTypeName",
        valueExpr: "TicketCustomType",
      },
    },
  ];
  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleSearch = async (data: any) => {
    // await refetch();
    isLoadingSearch();
  };

  const handleExportExcel = async () => {
    const resp = await api.Rpt_ETTicketSynthesisController_ExportExcel({
      AgentCodeConditionList: searchCondition.AgentCodeConditionList
        ? searchCondition.AgentCodeConditionList.join(",")
        : "",
      DepartmentCodeConditionList: searchCondition.DepartmentCodeConditionList
        ? searchCondition.DepartmentCodeConditionList.join(",")
        : "",
      OrgIDConditionList:
        searchCondition.OrgIDConditionList.length > 0
          ? searchCondition.OrgIDConditionList.join(",")
          : "",
      TicketTypeConditionList: searchCondition.TicketTypeConditionList
        ? searchCondition.TicketTypeConditionList.join(",")
        : "",
      CustomerName: "",
      CustomerCodeSys: searchCondition.CustomerCodeSys
        ? searchCondition.CustomerCodeSys
        : "",
      CustomerPhoneNo: searchCondition.CustomerPhoneNo
        ? searchCondition.CustomerPhoneNo
        : "",
      CustomerEmail: searchCondition.CustomerEmail
        ? searchCondition.CustomerEmail
        : "",
      CustomerCompany: searchCondition.CustomerCompany
        ? searchCondition.CustomerCompany
        : "",
      TicketStatusConditionList: searchCondition.TicketStatusConditionList
        ? searchCondition.TicketStatusConditionList.join(",")
        : "",
      CreateDTimeUTCFrom: searchCondition.MonthReport[0]
        ? format(searchCondition.MonthReport[0], "yyyy-MM-dd")
        : getFirstDateOfMonth(endDate),
      CreateDTimeUTCTo: searchCondition.MonthReport[1]
        ? format(searchCondition.MonthReport[1], "yyyy-MM-dd")
        : format(endDate, "yyyy-MM-dd"),
      LogLUDTimeUTCFrom: searchCondition.MonthUpdate[0]
        ? format(searchCondition.MonthUpdate[0], "yyyy-MM-dd")
        : "",
      LUDTimeUTCTo: searchCondition.MonthUpdate[1]
        ? format(searchCondition.MonthUpdate[1], "yyyy-MM-dd")
        : "",
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

  const chartDataSource = groupTicketsByDate(
    data?.Data?.RT_Rpt_ET_Ticket_Synthesis?.Lst_Rpt_ET_Ticket_SynthesisDtl,
    TicketEstablishInfo
  );

  const renderChart = useMemo(() => {
    if (
      !searchCondition?.TicketStatusConditionList ||
      searchCondition?.TicketStatusConditionList?.length == 0
    ) {
      return Array.isArray(TicketEstablishInfo) ? (
        TicketEstablishInfo?.map((i: any) => {
          const color = match(i?.TicketStatus)
            .with("NEW", () => "#0FBC2B")
            .with("OPEN", () => "#CFB929")
            .with("PROCESSING", () => "#E48203")
            .with("CLOSED", () => "#A7A7A7")
            .with("RESOLVED", () => "#eb3573")
            .with("WAITINGONCUSTOMER", () => "#20ada5")
            .with("WAITINGON3RD", () => "#a63db8")
            .otherwise(() => "#298ef2");

          return (
            <Series
              color={color}
              key={i?.TicketStatus}
              valueField={i?.TicketStatus}
              name={i?.AgentTicketStatusName}
            />
          );
        })
      ) : (
        <></>
      );
    }
    const result = searchCondition?.TicketStatusConditionList.map((i: any) => {
      const find = TicketEstablishInfo?.find((c: any) => {
        return c?.TicketStatus == i;
      });

      const color = match(find?.TicketStatus)
        .with("NEW", () => "#0FBC2B")
        .with("OPEN", () => "#CFB929")
        .with("PROCESSING", () => "#E48203")
        .with("CLOSED", () => "#A7A7A7")
        .with("RESOLVED", () => "#eb3573")
        .with("WAITINGONCUSTOMER", () => "#20ada5")
        .with("WAITINGON3RD", () => "#a63db8")
        .otherwise(() => "#298ef2");

      return (
        <Series
          color={color}
          key={find.TicketStatus}
          valueField={find?.TicketStatus}
          name={find?.AgentTicketStatusName}
        />
      );
    });

    return result;
  }, [chartDataSource, searchCondition, TicketEstablishInfo]);

  return (
    <AdminContentLayout className={"Rpt_ETTicketSynthesisController"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className={"w-full flex flex-col"}>
          <div className={"page-header w-full flex items-center p-2"}>
            <div className={"before px-4 mr-auto"}>
              <strong>{t("Report ETTicketSynthesis")}</strong>
            </div>
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout
          searchPermissionCode={"BTN_RPT_SYNTHETICETICKET_SEARCH"}
        >
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              storeKey="Rpt_ETTicketSynthesisController_search"
              conditionFields={formItems}
              data={searchCondition}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <div>
              <div className="px-3 flex items-center py-3 gap-2">
                <Button
                  visible={checkPermision("BTN_RPT_SYNTHETICETICKET_SEARCH")}
                  className="button_Search"
                  icon={"/images/icons/search.svg"}
                  onClick={handleToggleSearchPanel}
                />
                <div>
                  <Button
                    visible={checkPermision(
                      "BTN_RPT_SYNTHETICETICKET_EXPORTEXCEL"
                    )}
                    className="button_export"
                    text={t("EXPORT")}
                    onClick={handleExportExcel}
                  />
                </div>
              </div>
              <div className="flex justify-center gap-4 my-4">
                <div className="border bg-[#f7f4f47b] min-w-[240px] px-3 py-1 leading-6 rounded-md">
                  <p className="text-center text-[15px] font-bold">
                    {t("Tỉ lệ eTicket đáp ứng")}
                  </p>
                  <p className="text-center text-[15px] font-bold">
                    {t("SLA")}
                  </p>
                  <p className="text-center text-[20px] py-[15px] font-bold text-[#d7ca39]">
                    {data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                      ?.Rpt_ET_Ticket_Synthesis?.SLAResponseRate
                      ? `${
                          data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                            ?.Rpt_ET_Ticket_Synthesis?.SLAResponseRate + "%"
                        }`
                      : "0%"}
                  </p>
                </div>
                <div className="border bg-[#f7f4f47b] min-w-[240px] px-2 py-1 leading-6 rounded-md">
                  <p className="text-[15px] font-bold">
                    {t("Thời gian phản hồi")}
                  </p>
                  <div className="flex flex-wrap items-center mt-[6px] gap-[3px]">
                    <div>
                      <li className="list-disc mb-[4px]">
                        {t("Lần đầu trung bình")}
                      </li>
                      <li className="list-disc mb-[4px]">{t("Trung bình")}</li>
                    </div>
                    <div>
                      <div className="text-[17px] mb-[4px] pl-1 font-bold text-[#d7ca39]">
                        {data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                          ?.Rpt_ET_Ticket_Synthesis?.AvgFirstResponse ??
                          "00:00:00"}
                      </div>
                      <div className="text-[17px] mb-[4px] pl-1 font-bold text-[#d7ca39]">
                        {data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                          ?.Rpt_ET_Ticket_Synthesis?.AvgProcessTime ??
                          "00:00:00"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border bg-[#f7f4f47b] min-w-[240px] px-2 py-1 leading-6 rounded-md">
                  <p className="text-[15px] font-bold">
                    {t("Thời gian xử lý")}
                  </p>
                  <div className="flex flex-wrap items-center mt-[6px] gap-4">
                    <div>
                      <li className="list-disc mb-[4px]">{t("Ngắn nhất")}</li>
                      <li className="list-disc">{t("Trung bình")}</li>
                    </div>
                    <div>
                      <div className="text-[17px] mb-[4px] pl-1 font-bold text-[#d7ca39]">
                        {data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                          ?.Rpt_ET_Ticket_Synthesis?.MinProcessTime ??
                          "00:00:00"}
                      </div>
                      <div className="text-[17px] pl-1 font-bold text-[#d7ca39]">
                        {data?.Data?.RT_Rpt_ET_Ticket_Synthesis
                          ?.Rpt_ET_Ticket_Synthesis?.AvgProcessTime ??
                          "00:00:00"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full px-4">
                <Chart palette="Green Mist" dataSource={chartDataSource}>
                  {renderChart}
                  <CommonSeriesSettings
                    argumentField="CreateDate"
                    type={"line"}
                  />
                  <CommonAxisSettings>
                    <Grid visible={true} />
                  </CommonAxisSettings>
                  <Margin bottom={20} />
                  <ArgumentAxis
                    allowDecimals={false}
                    axisDivisionFactor={60}
                    discreteAxisDivisionMode="crossLabels"
                    argumentType="string"
                  >
                    <Label>
                      <Format type="decimal" />
                    </Label>
                  </ArgumentAxis>
                  <Legend
                    verticalAlignment="top"
                    horizontalAlignment="center"
                    itemTextPosition="right"
                    columnItemSpacing={50}
                  />
                  <Export enabled={true} />
                  <Tooltip enabled={true} />
                </Chart>
              </div>
            </div>
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
