import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";
import { authAtom, showErrorAtom } from "@packages/store";
import { FlagActiveEnum, Mst_Area } from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { toast } from "react-toastify";
import { selectedItemsAtom } from "../components/store";
import { useBankDealerGridColumns } from "../components/use-columns";
import "./Rpt_MissedCalls.scss";

import { SearchPanelV2 } from "@/packages/ui/search-panel";

import { DateRangeBox, TextBox } from "devextreme-react";
import { nanoid } from "nanoid";

import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { format } from "date-fns";
import { match } from "ts-pattern";

import { checkPermision } from "@/components/PermissionContainer";
import { getFirstDateOfMonth } from "@/components/ulti";
import { RequiredField } from "@/packages/common/Validation_Rules";
import { ReportHeaderLayout } from "@/packages/layouts/report-layout/report-header-layout";

export const Rpt_MissedCallsPage = () => {
  const { t } = useI18n("Rpt_MissedCalls");
  let gridRef: any = useRef(null);
  const showError = useSetAtom(showErrorAtom);
  const auth = useAtomValue(authAtom);
  const [key, isLoadingSearch] = useReducer(() => {
    return nanoid();
  }, "0");
  const now = new Date();
  const endDate = new Date(now.getTime());
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

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
    TicketStatusConditionList: [],
    MonthReport: [firstDay, endDate],
    TicketCustomTypeConditionList: [],
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Rpt_MissedCalls", JSON.stringify(searchCondition), key],
    queryFn: async () => {
      if (key !== "0") {
        const resp = await api.Rpt_MissedCalls_Search({
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
          TicketTypeConditionList: "MISSEDCALL",
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
  const { data: listOrgID } = useQuery(["listOrgID"], () =>
    api.Mst_NNTController_GetAllActive()
  );

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

  const { data: TicketEstablishInfo, refetch: getTicketStatus } = useQuery({
    queryKey: ["Mst_TicketEstablishInfoApi_GetAllInfo__MissCall"],
    queryFn: async () => {
      const response = await api.Mst_TicketEstablishInfoApi_GetAllInfo();
      if (response.isSuccess) {
        const result = response?.Data?.Lst_Mst_TicketStatus?.filter(
          (item: any) => item?.FlagActive !== "0"
        );

        const data = response?.Data?.Lst_Mst_TicketStatus;

        if (response.Data) {
          const defaultValue =
            data
              ?.filter(
                (i: any) =>
                  i.FlagActive !== "0" &&
                  i.TicketStatus !== "CLOSED" &&
                  i.TicketStatus !== "CANCEL"
              )
              .map((item: any) => item.TicketStatus) ?? [];
          console.log("defaultValue", defaultValue);
          setSearchCondition((prev: any) => {
            return {
              ...prev,
              TicketStatusConditionList: defaultValue,
            };
          });
          return { list: result, defaultValue: defaultValue };
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
        return {
          list: [],
          defaultValue: [],
        };
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

  useEffect(() => {
    getTicketStatus();
  }, []);

  const formItems: any[] = [
    {
      dataField: "AgentCodeConditionList",
      caption: t("AgentCodeConditionList"),
      visible: true,
      label: {
        text: t("Agent list"),
      },
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
      visible: true,
      label: {
        text: t("Team"),
      },
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
      visible: true,
      label: {
        text: t("Chi nhánh"),
      },
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
      visible: true,
      label: {
        text: t("Loại eTicket"),
      },
      editorType: "dxTextBox",
      editorOptions: {},
      render: ({ editorOptions, component: formRef }: any) => {
        return <TextBox value={t("Cuộc gọi nhỡ")} readOnly={true} />;
      },
    },
    {
      caption: t("TicketStatusConditionList"),
      dataField: "TicketStatusConditionList",
      visible: true,
      label: {
        text: t("Trạng thái eTicket"),
      },
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: TicketEstablishInfo?.list ?? [],
        defaultValue: ["NEW"],
        valueExpr: "TicketStatus",
        displayExpr: "AgentTicketStatusName",
      },
    },
    {
      caption: t("CustomerName"),
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
        displayExpr: "CustomerName",
        valueExpr: "CustomerCodeSys",
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
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <DateRangeBox
            displayFormat="yyyy-MM-dd"
            defaultStartDate={searchCondition.MonthReport[0]}
            defaultEndDate={searchCondition.MonthReport[1]}
            showClearButton={true}
            // useMaskBehavior={true}
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

  const handleDeleteRows = async (rows: any) => {
    console.log(175, rows);
  };

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
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
    isLoadingSearch();
    // await refetch();
  };
  const handleOnEditRow = (e: any) => {
    const { row, column } = e;
    handleEdit(row.rowIndex);
  };
  const handleEditRowChanges = () => {};
  const handleExportExcel = async () => {
    const resp = await api.Rpt_MissedCalls_ExportExcel({
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
      TicketTypeConditionList: "MISSEDCALL",
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
        : ["SOLVED", "CLOSED"].join(","),
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

  console.log(data);

  return (
    <ReportHeaderLayout className={"Rpt_MissedCalls"}>
      <ReportHeaderLayout.Slot name={"Header"}>
        <div className={"w-full flex flex-col"}>
          <div className={"page-header w-full flex items-center p-2"}>
            <div className={"before px-4 mr-auto"}>
              <strong>{t("Rpt Missed Calls")}</strong>
            </div>
          </div>
        </div>
      </ReportHeaderLayout.Slot>
      <ReportHeaderLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout
          searchPermissionCode={"BTN_RPT_CUOC_GOI_NHO_SEARCH"}
        >
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              storeKey="Rpt_MissedCalls_Search"
              conditionFields={formItems}
              data={searchCondition}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewCustomize
              cssClass={"Rpt_MissedCalls"}
              isHiddenCheckBox={true}
              isLoading={isLoading}
              dataSource={data?.Data?.Rpt_Rpt_MissedCalls ?? []}
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
                  visible: checkPermision("BTN_RPT_CUOC_GOI_NHO_SEARCH"),
                  options: {
                    icon: "search",
                    onClick: handleToggleSearchPanel,
                  },
                },
                {
                  location: "before",
                  widget: "dxButton",
                  visible: checkPermision("BTN_RPT_CUOC_GOI_NHO_EXPORTEXCEL"),
                  options: {
                    text: t("Export"),
                    onClick: handleExportExcel,
                    stylingMode: "contained",
                    type: "default",
                  },
                },
              ]}
              storeKey={"Rpt_MissedCalls-columns"}
              locationCustomToolbar="center"
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </ReportHeaderLayout.Slot>
    </ReportHeaderLayout>
  );
};
