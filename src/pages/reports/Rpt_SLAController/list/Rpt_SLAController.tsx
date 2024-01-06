import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";
import { useConfiguration } from "@packages/hooks";
import { authAtom, showErrorAtom } from "@packages/store";
import { FlagActiveEnum, Mst_Area } from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useReducer, useRef, useState } from "react";
import { toast } from "react-toastify";
import { selectedItemsAtom } from "../components/store";
import { useBankDealerGridColumns } from "../components/use-columns";
import "./Rpt_SLAController.scss";

import { SearchPanelV2 } from "@/packages/ui/search-panel";

import { DateRangeBox } from "devextreme-react";
import PieChart, {
  Legend,
  Series,
  Size,
  Tooltip,
} from "devextreme-react/pie-chart";
import { nanoid } from "nanoid";

import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { format } from "date-fns";
import { match } from "ts-pattern";
import { useToolbar } from "../components/toolbarItem";

import { checkPermision } from "@/components/PermissionContainer";
import { getFirstDateOfMonth } from "@/components/ulti";
import { RequiredField } from "@/packages/common/Validation_Rules";
import { ReportHeaderLayout } from "@/packages/layouts/report-layout/report-header-layout";
import { calculateSLAStats } from "../components/FormatDataSLA";
import TooltipTemplate from "../components/TooltipTemplate";

export const Rpt_SLAControllerPage = () => {
  const { t } = useI18n("Rpt_SLAController");
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
    CustomerCodeSys: "",
    CustomerPhoneNo: "",
    CustomerEmail: "",
    CustomerCompany: "",
    TicketStatusConditionList: "",
    MonthReport: [firstDay, endDate],
    TicketCustomTypeConditionList: [],
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Rpt_SLAController", JSON.stringify(searchCondition), key],
    queryFn: async () => {
      if (key !== "0") {
        const resp = await api.Rpt_SLAController_Search({
          AgentCodeConditionList: searchCondition.AgentCodeConditionList
            ? searchCondition.AgentCodeConditionList.join(",")
            : "",
          DepartmentCodeConditionList:
            searchCondition.DepartmentCodeConditionList
              ? searchCondition.DepartmentCodeConditionList.join(",")
              : "",
          CustomerName: "",
          OrgIDConditionList:
            searchCondition.OrgIDConditionList.length > 0
              ? searchCondition.OrgIDConditionList.join(",")
              : "",
          TicketTypeConditionList: searchCondition.TicketTypeConditionList
            ? searchCondition.TicketTypeConditionList.join(",")
            : "",
          TicketCustomTypeConditionList:
            searchCondition.TicketCustomTypeConditionList
              ? searchCondition.TicketCustomTypeConditionList
              : "",
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
          CreateDTimeUTCFrom: searchCondition.MonthReport[0]
            ? format(searchCondition.MonthReport[0], "yyyy-MM-dd")
            : "",
          CreateDTimeUTCTo: searchCondition.MonthReport[1]
            ? format(searchCondition.MonthReport[1], "yyyy-MM-dd")
            : "",
        });
        return resp;
      } else {
        return null;
      }
    },
  });

  const { data: CampaignList } = useQuery(["listMST"], () =>
    api.Cpn_CampaignAgent_GetActive()
  );
  const { data: listOrgID } = useQuery(["listOrgID"], () =>
    api.Mst_NNTController_GetAllActive()
  );

  const columns = useBankDealerGridColumns({
    data: data?.Data?.Rpt_Cpn_CampaignResultCall || [],
  });

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
        "Rpt_SLAController_GetTicketType",
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

  const { data: TicketEstablishInfo, isLoading: isLoadingTicketEstablishInfo } =
    useQuery({
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

  const {
    data: getTicketCustomerType,
    isLoading: isLoadingTicketCustomerType,
  } = useQuery({
    queryKey: ["Mst_TicketCustomType_GetAllActive"],
    queryFn: async () => {
      const response = await api.Mst_TicketCustomType_GetAllActive();

      if (response.isSuccess) {
        return response.Data.Lst_Mst_TicketCustomType?.filter(
          (item: any) => item?.OrgID == auth.orgId.toString()
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

  const { data: getEnterprise, isLoading: isLoadingEnterprise } = useQuery({
    queryKey: ["Mst_Customer_Search_Eticket_Manager"],
    queryFn: async () => {
      const response = await api.Mst_Customer_Search({
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
        FlagActive: FlagActiveEnum.Active,
        CustomerType: "TOCHUC",
        OrgID: auth.orgId,
      });

      if (response.isSuccess) {
        return response.DataList?.filter(
          (item: any) => item?.OrgID == auth.orgId.toString()
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

  const formItems: any[] = [
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
      dataField: "OrgIDConditionList",
      validationRules: [RequiredField(t("OrgIDConditionList"))],
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
      editorType: "dxTagBox",
      visible: true,
      editorOptions: {
        searchEnabled: true,
        dataSource: getListEticketType ?? [],
        displayExpr: "CustomerTicketTypeName",
        valueExpr: "TicketType",
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
        placeholder: t("Input"),
      },
    },
    {
      caption: t("CustomerName"),
      dataField: "CustomerCodeSys",
      label: {
        text: t("Khách hàng"),
      },
      editorType: "dxSelectBox",
      visible: true,
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
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <DateRangeBox
            displayFormat=" yyyy-MM-dd"
            defaultStartDate={searchCondition.MonthReport[0]}
            defaultEndDate={searchCondition.MonthReport[1]}
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
  ];

  const handleDeleteRows = async (rows: any) => {
    console.log(175, rows);
  };

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    console.log("handleToggleSearchPanel", gridRef?.instance);
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
  const handleSetField = useCallback(
    (titleButton: string, ref: any, check: any) => {
      match(titleButton)
        .with("All", () => {
          ref.instance?.clearFilter();
        })
        .with("FlagSLANotResponding", () => {
          // console.log(242, check);
          // if(check.component.storedClasses === "FlagTicketOutOfDate" &&) {

          // }
          ref.instance?.filter(["FlagSLANotResponding", "=", "1"]);
        })
        .with("FlagTicketOutOfDate", () => {
          // console.log(246, check);
          ref.instance?.filter(["FlagTicketOutOfDate", "=", "1"]);
        })
        .otherwise(() => {});
    },
    [isLoading]
  );
  const toolbar = useToolbar({
    data: data?.Data?.Rpt_ET_Ticket_Detail ?? [],
    onSetStatus: handleSetField,
  });
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
    // await refetch();
    isLoadingSearch();
  };

  const handleEditRowChanges = () => {};
  const handleExportExcel = async () => {
    const resp = await api.Rpt_SLAController_ExportExcel({
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
      TicketCustomTypeConditionList:
        searchCondition.TicketCustomTypeConditionList
          ? searchCondition.TicketCustomTypeConditionList.join(",")
          : "",
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
      CreateDTimeUTCFrom: searchCondition.MonthReport[0]
        ? format(searchCondition.MonthReport[0], "yyyy-MM-dd")
        : getFirstDateOfMonth(endDate),
      CreateDTimeUTCTo: searchCondition.MonthReport[1]
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
    <ReportHeaderLayout className={"Rpt_SLAController"}>
      <ReportHeaderLayout.Slot name={"Header"}>
        <div className={"w-full flex flex-col"}>
          <div className={"page-header w-full flex items-center p-2"}>
            <div className={"before px-4 mr-auto"}>
              <strong>{t("Report KPI SLA")}</strong>
            </div>
          </div>
        </div>
      </ReportHeaderLayout.Slot>
      <ReportHeaderLayout.Slot name={"Content"}>
        <div className="flex h-full pt-1 justify-between">
          <div className="w-[calc(100%_-_288px)] h-full">
            <ContentSearchPanelLayout
              searchPermissionCode={"BTN_RPT_SLA_SEARCH"}
            >
              <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
                <SearchPanelV2
                  storeKey="Rpt_SLAController"
                  conditionFields={formItems}
                  data={searchCondition}
                  onSearch={handleSearch}
                />
              </ContentSearchPanelLayout.Slot>
              <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
                <GridViewCustomize
                  cssClass={"Rpt_SLAController"}
                  isHiddenCheckBox={true}
                  isLoading={isLoading}
                  dataSource={
                    data?.isSuccess ? data?.Data?.Lst_Rpt_SLA ?? [] : []
                  }
                  columns={columns}
                  keyExpr={["TicketID"]}
                  popupSettings={popupSettings}
                  formSettings={{}}
                  onReady={(ref) => (gridRef = ref)}
                  allowSelection={true}
                  onSelectionChanged={handleSelectionChanged}
                  onSaveRow={handleSavingRow}
                  onEditorPreparing={handleEditorPreparing}
                  allowInlineEdit={true}
                  onEditRowChanges={handleEditRowChanges}
                  onDeleteRows={handleDeleteRows}
                  isSingleSelection={false}
                  toolbarItems={[
                    {
                      location: "before",
                      widget: "dxButton",
                      visible: checkPermision("BTN_RPT_SLA_SEARCH"),
                      options: {
                        icon: "search",
                        onClick: handleToggleSearchPanel,
                      },
                    },
                    {
                      location: "before",
                      widget: "dxButton",
                      visible: checkPermision("BTN_RPT_SLA_EXPORTEXCEL"),
                      options: {
                        text: t("Export"),
                        onClick: handleExportExcel,
                        stylingMode: "contained",
                        type: "default",
                      },
                    },
                  ]}
                  storeKey={"Rpt_SLAController-columns"}
                  locationCustomToolbar="center"
                />
              </ContentSearchPanelLayout.Slot>
            </ContentSearchPanelLayout>
          </div>
          <div className="h-full mt-[38px] w-1 border-t bg-[#f5f5f5] shadow-md" />
          <div className="w-[280px] mt-[38px] shadow-md border-t">
            <div className="mt-[20px] mb-5">
              <p className="text-center font-bold text-[15px] mb-[5px]">
                {t("Pie tỉ lệ % eTicket đạt KPI về")}
              </p>
              <p className="text-center font-bold text-[15px]">
                {t("SLA / Tổng số eTicket")}
              </p>
            </div>
            <div className="flex justify-center">
              <PieChart
                id="pie"
                type="doughnut"
                dataSource={calculateSLAStats(data?.Data?.Lst_Rpt_SLA)}
                palette="Bright"
                innerRadius={0.5}
                className="h-[330px]"
              >
                <Series argumentField="name" valueField="QtySLA" />
                <Size width={200} />
                <Legend
                  orientation="horizontal"
                  itemTextPosition="right"
                  horizontalAlignment="center"
                  verticalAlignment="bottom"
                  columnCount={1}
                />
                <Tooltip enabled={true} contentRender={TooltipTemplate} />
                {/* <Export enabled={true} /> */}
              </PieChart>
            </div>
          </div>
        </div>
      </ReportHeaderLayout.Slot>
    </ReportHeaderLayout>
  );
};
