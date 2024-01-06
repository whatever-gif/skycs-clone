import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@layouts/admin-content-layout";
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
import { HeaderPart } from "../components/header-part";
import { selectedItemsAtom } from "../components/store";
import { useBankDealerGridColumns } from "../components/use-columns";
import "./Rpt_ETTicketDetailController.scss";

import { SearchPanelV2 } from "@/packages/ui/search-panel";

import { DateRangeBox } from "devextreme-react";
import { nanoid } from "nanoid";

import { checkPermision } from "@/components/PermissionContainer";
import { getFirstDateOfMonth } from "@/components/ulti";
import {
  RequiredDateTimeMonth,
  RequiredField,
} from "@/packages/common/Validation_Rules";
import { GridViewStandard } from "@/packages/ui/base-gridview/gridview-standard";
import { format } from "date-fns";
import { match } from "ts-pattern";
import { useToolbar } from "../components/toolbarItem";

export const Rpt_ETTicketDetailControllerPage = () => {
  const { t } = useI18n("Rpt_ETTicketDetailController");
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

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "Rpt_ETTicketDetailController",
      JSON.stringify(searchCondition),
      key,
    ],
    queryFn: async () => {
      if (key !== "0") {
        const resp = await api.Rpt_ETTicketDetailController_Search({
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

  const { data: CampaignList } = useQuery(["listMST"], () =>
    api.Cpn_CampaignAgent_GetActive()
  );
  const { data: listOrgID } = useQuery(["listOrgID"], () =>
    api.Mst_NNTController_GetAllActive()
  );

  const { data: listUser } = useQuery(["listAgent"], async () => {
    const resp: any = await api.Sys_User_GetAllActive();

    return resp?.DataList?.filter(
      (item: any) => item?.OrgID == auth.orgId.toString()
    );
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

  const columns = useBankDealerGridColumns({
    data: data?.Data?.Rpt_Cpn_CampaignResultCall || [],
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
        "Rpt_ETTicketDetailController_GetTicketType",
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
  // console.log(260, listOrgID?.Data?.Lst_Mst_NNT);
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
        placeholder: t("Input"),
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
      editorOptions: {
        type: "date",
        displayFormat: "yyyy-MM-dd",
      },
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <DateRangeBox
            displayFormat="yyyy-MM-dd"
            defaultStartDate={searchCondition?.MonthUpdate[0]}
            defaultEndDate={searchCondition?.MonthUpdate[1]}
            showClearButton={true}
            useMaskBehavior={true}
            openOnFieldClick={true}
            labelMode="hidden"
            onValueChanged={(e: any) => {
              formRef.instance().updateData("MonthUpdate", e.value);
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
    // console.log(175, rows);
  };
  const [checkTab, setCheckTab] = useState(false);

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  const handleAddNew = () => {
    // gridRef.current._instance.addRow();
  };

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    // console.log("handleToggleSearchPanel", gridRef?.instance);
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
      match(titleButton).otherwise(() => {});
    },
    [isLoading]
  );
  const toolbar = useToolbar({
    gridRef: gridRef,
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

  const onDelete = async (id: any) => {};
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

  const handleSearch = async (data: any) => {
    isLoadingSearch();
    await refetch();
  };
  const handleOnEditRow = (e: any) => {
    const { row, column } = e;
    handleEdit(row.rowIndex);
  };
  const handleEditRowChanges = () => {};

  const handleExportExcel = async () => {
    const resp = await api.Rpt_ETTicketDetailController_ExportExcel({
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

  const dataSource = match(data?.isSuccess)
    .with(true, () => {
      return match(auth.orgId == auth.networkId)
        .with(true, () => {
          return (
            data?.Data?.Rpt_ET_Ticket_Detail?.map((item: any, index: any) => {
              return {
                ...item,
                STT: index + 1,
              };
            }) ?? []
          );
        })
        .otherwise(() => {
          return data?.Data?.Rpt_ET_Ticket_Detail.filter(
            (item: any) => item.OrgID === auth.orgId.toString()
          )?.map((item: any, index: any) => {
            return {
              ...item,
              STT: index + 1,
            };
          });
        });
    })
    .otherwise(() => []);

  return (
    <AdminContentLayout className={"Rpt_ETTicketDetailController"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart
          onAddNew={handleAddNew}
          searchCondition={searchCondition}
        ></HeaderPart>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout
          searchPermissionCode={"BTN_RPT_DTLETICKET_SEARCH"}
        >
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              storeKey="Rpt_ETTicketDetailController_Search"
              conditionFields={formItems}
              data={searchCondition}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewStandard
              isHidenHeaderFilter={true}
              isLoading={false}
              fetchData={async () => {}}
              dataSource={dataSource}
              columns={columns}
              keyExpr={["TicketID"]}
              onReady={(ref) => {
                gridRef.current = ref;
              }}
              isHiddenCheckBox={true}
              allowInlineEdit={false}
              allowSelection={true}
              onSelectionChanged={handleSelectionChanged}
              onSaveRow={handleSavingRow}
              onEditorPreparing={handleEditorPreparing}
              onEditRowChanges={handleEditRowChanges}
              hidenTick={true}
              onDeleteRows={() => {}}
              storeKey={"Rpt_ETTicketDetailController-columns"}
              toolbarItems={[
                {
                  location: "before",
                  widget: "dxButton",
                  visible: checkPermision("BTN_RPT_DTLETICKET_SEARCH"),
                  options: {
                    icon: "search",
                    onClick: handleToggleSearchPanel,
                  },
                },
                {
                  location: "before",
                  widget: "dxButton",
                  visible: checkPermision("BTN_RPT_DTLETICKET_EXPORTEXCEL"),
                  options: {
                    text: t("Export"),
                    onClick: handleExportExcel,
                    stylingMode: "contained",
                    type: "default",
                  },
                },
              ]}
              popupSettings={popupSettings}
              formSettings={{}}
              customToolbarItems={toolbar}
            />
            {/* <GridViewCustomize
              cssClass={"Rpt_ETTicketDetailController_Grid"}
              isHiddenCheckBox={true}
              isLoading={isLoading}
              dataSource={
                data?.isSuccess
                  ? data?.Data?.Rpt_ET_Ticket_Detail.filter(
                      (item: any) => item.OrgID === auth.orgId.toString()
                    ) ?? []
                  : []
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
              // inlineEditMode="row"
              // showCheck="always"
              toolbarItems={[
                {
                  location: "before",
                  widget: "dxButton",
                  visible: checkPermision("BTN_RPT_DTLETICKET_SEARCH"),
                  options: {
                    icon: "search",
                    onClick: handleToggleSearchPanel,
                  },
                },
                {
                  location: "before",
                  widget: "dxButton",
                  visible: checkPermision("BTN_RPT_DTLETICKET_EXPORTEXCEL"),
                  options: {
                    text: t("Export"),
                    onClick: handleExportExcel,
                    stylingMode: "contained",
                    type: "default",
                  },
                },
              ]}
              storeKey={"Rpt_ETTicketDetailController-columns"}
              locationCustomToolbar="center"
              customToolbarItems={toolbar}
            /> */}
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
