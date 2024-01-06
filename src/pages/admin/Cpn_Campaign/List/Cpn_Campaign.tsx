import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";
import { useConfiguration, useNetworkNavigate } from "@packages/hooks";
import { showErrorAtom } from "@packages/store";
import { FlagActiveEnum, Mst_PaymentTermData } from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { IItemProps } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useMemo, useRef } from "react";
import { toast } from "react-toastify";

import { HeaderPart } from "../components/header-part";
import {
  flagSelectorAtom,
  listAgentAtom,
  selectedItemsAtom,
} from "../components/store";

import { getYearMonthDate } from "@/components/ulti";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { GridCustomerToolBarItem } from "@/packages/ui/base-gridview/components/grid-custom-toolbar";
import { GridViewStandard } from "@/packages/ui/base-gridview/gridview-standard";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { useSetAtom } from "jotai";
import ListAgent from "../components/ListAgent";
import { Cpn_CampaignPage_Column } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";
import { PopupViewComponent } from "../components/use-popup-view";
import ConfirmComponent from "@/components/ConfirmComponent";
import {
  FilterItem,
  HeaderFilterPost,
} from "@/packages/ui/headerFilter/HeaderFilter";
import FilterDropdown from "@/packages/ui/base-gridview/FilterDropdown";

export const Cpn_CampaignPage = () => {
  const { t } = useI18n("Cpn_CampaignPage");
  // const { t } = useI18n("Cpn_CampaignPage_2023_12_14");
  const setFlagSelector = useSetAtom(flagSelectorAtom);
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);
  const { auth } = useAuth();
  const navigate = useNetworkNavigate();
  const windowSize = useWindowSize();
  const setListAgent = useSetAtom(listAgentAtom);
  const widthSearch = windowSize.width / 5;
  const searchCondition = useRef<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    CampaignTypeName: "",
    CampaignTypeDesc: "",
    DTimeStart: [null, null],
    DTimeEnd: [null, null],
    StartDTimeUTC: [null, null],
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);

  const api = useClientgateApi();

  const refetchData = async () => {
    const param = {
      ...searchCondition?.current,
      DTimeStartFrom: searchCondition?.current.DTimeStart[0]
        ? getYearMonthDate(searchCondition?.current.DTimeStart[0])
        : "",
      DTimeStartTo: searchCondition?.current.DTimeStart[1]
        ? getYearMonthDate(searchCondition?.current.DTimeStart[1])
        : "",
      DTimeEndFrom: searchCondition?.current.DTimeEnd[0]
        ? getYearMonthDate(searchCondition?.current.DTimeEnd[0])
        : "",
      DTimeEndTo: searchCondition?.current.DTimeEnd[1]
        ? getYearMonthDate(searchCondition?.current.DTimeEnd[1])
        : "",
      StartDTimeUTCFrom: searchCondition?.current.StartDTimeUTC[0]
        ? getYearMonthDate(searchCondition?.current.StartDTimeUTC[0])
        : "",
      StartDTimeUTCTo: searchCondition?.current.StartDTimeUTC[1]
        ? getYearMonthDate(searchCondition?.current.StartDTimeUTC[1])
        : "",
      Ft_PageIndex: gridRef.current?.instance.pageIndex() ?? 0,
      Ft_PageSize: gridRef.current?.instance.pageSize() ?? 100,
    };
    delete param.CreateDTimeUTC;
    delete param.StartDTimeUTC;
    delete param.FinishDTimeUTC;
    const response = await api.Cpn_Campaign_Search(param);
    if (response.isSuccess) {
      return response;
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
  };

  const cellClick = (data: any) => {
    setListAgent(data);
  };

  // const { data, isLoading, refetch } = useQuery(
  //   ["Cpn_CampaignPage", JSON.stringify(searchCondition?.current)],
  //   async () => {
  //     const param = {
  //       ...searchCondition?.current,
  //       DTimeStartFrom: searchCondition?.current.DTimeStart[0]
  //         ? getYearMonthDate(searchCondition?.current.DTimeStart[0])
  //         : "",
  //       DTimeStartTo: searchCondition?.current.DTimeStart[1]
  //         ? getYearMonthDate(searchCondition?.current.DTimeStart[1])
  //         : "",
  //       DTimeEndFrom: searchCondition?.current.DTimeEnd[0]
  //         ? getYearMonthDate(searchCondition?.current.DTimeEnd[0])
  //         : "",
  //       DTimeEndTo: searchCondition?.current.DTimeEnd[1]
  //         ? getYearMonthDate(searchCondition?.current.DTimeEnd[1])
  //         : "",
  //       StartDTimeUTCFrom: searchCondition?.current.StartDTimeUTC[0]
  //         ? getYearMonthDate(searchCondition?.current.StartDTimeUTC[0])
  //         : "",
  //       StartDTimeUTCTo: searchCondition?.current.StartDTimeUTC[1]
  //         ? getYearMonthDate(searchCondition?.current.StartDTimeUTC[1])
  //         : "",
  //     };
  //     delete param.CreateDTimeUTC;
  //     delete param.StartDTimeUTC;
  //     delete param.FinishDTimeUTC;
  //     const response = await api.Cpn_Campaign_Search(param);
  //     if (response.isSuccess) {
  //       return response;
  //     } else {
  //       showError({
  //         message: (response.errorCode),
  //         debugInfo: response.debugInfo,
  //         errorInfo: response.errorInfo,
  //       });
  //     }
  //   }
  // );

  // useEffect(() => {
  //   if (!isLoading) {
  //     refetch();
  //   }
  // }, []);

  const onCancel = () => {
    console.log("cancel");
    setListAgent([]);
  };

  const { data: listCampaignType, isLoading: isLoadingCampaignType } = useQuery(
    {
      queryKey: ["listCampaignType"],
      queryFn: async () => {
        const response = await api.Mst_CampaignType_Search({
          FlagActive: FlagActiveEnum.Active,
          Ft_PageIndex: 0,
          Ft_PageSize: 10000,
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
    }
  );

  const arrayStatus = [
    {
      label: t("PENDING"),
      value: "PENDING",
    },
    {
      label: t("APPROVE"),
      value: "APPROVE",
    },
    {
      label: t("STARTED"),
      value: "STARTED",
    },
    {
      label: t("PAUSED"),
      value: "PAUSED",
    },
    {
      label: t("CONTINUED"),
      value: "CONTINUED",
    },
    {
      label: t("FINISH"),
      value: "FINISH",
    },
  ];

  const columns = Cpn_CampaignPage_Column({ cellClick: cellClick });
  const formItems: IItemProps[] = useMemo(() => {
    return [
      // {
      //   dataField: "CreateDTimeUTCFrom",
      //   caption: t("CreateDTimeUTCFrom"),
      //   label: {
      //     text: t("CreateDTimeUTC"),
      //   },
      //   editorType: "dxDateBox",
      //   editorOptions: {
      //     type: "date",
      //     format: "yyyy-MM-dd",
      //   },
      //   validationRules: [
      //     {
      //       type: "custom",
      //       ignoreEmptyValue: true,
      //       validationCallback: (e: any) => {
      //         if (searchCondition?.current.CreateDTimeUTCTo) {
      //           return !isAfter(e.value, searchCondition?.current.CreateDTimeUTCTo);
      //         }
      //         return true;
      //       },
      //       message: ("DateFromMustBeBeforeDateTo"),
      //     },
      //   ],
      // },
      {
        dataField: "CreateDTimeUTC",
        caption: t("CreateDTimeUTC"),
        visible: true,
        label: {
          text: t("CreateDTimeUTC"),
        },
        editorType: "dxDateRangeBox",
        editorOptions: {
          type: "date",
          format: "yyyy-MM-dd",
          displayFormat: "yyyy-MM-dd",
        },
      },
      {
        dataField: "DTimeStart",
        caption: t("DTimeStart"),
        visible: true,
        label: {
          text: t("DTimeStart"),
        },
        editorType: "dxDateRangeBox",
        editorOptions: {
          type: "date",
          format: "yyyy-MM-dd",
          displayFormat: "yyyy-MM-dd",
        },
      },
      {
        dataField: "DTimeEnd",
        caption: t("DTimeEnd"),
        visible: true,
        label: {
          text: t("DTimeEnd"),
        },
        editorType: "dxDateRangeBox",
        editorOptions: {
          type: "date",
          format: "yyyy-MM-dd",
          displayFormat: "yyyy-MM-dd",
        },
      },
      {
        dataField: "CampaignStatus",
        caption: t("CampaignStatus"),
        visible: true,
        label: {
          text: t("CampaignStatus"),
        },
        editorType: "dxTagBox",
        colSpan: 2,
        editorOptions: {
          dataSource: arrayStatus,
          valueExpr: "value",
          displayExpr: "label",
        },
      },
      {
        dataField: "CampaignTypeCode",
        caption: t("CampaignTypeCode"),
        visible: true,
        label: {
          text: t("CampaignTypeCode"),
        },
        colSpan: 2,
        editorType: "dxSelectBox",
        editorOptions: {
          dataSource: listCampaignType ?? [],
          displayExpr: "CampaignTypeName",
          valueExpr: "CampaignTypeCode",
        },
      },
    ];
  }, [listCampaignType]);

  const handleDeleteRows = async (rows: any) => {
    return ConfirmComponent({
      asyncFunction: async () => {
        const param = rows.map((item: any) => {
          return {
            CampaignCode: item.CampaignCode,
            OrgID: item.OrgID,
          };
        });
        const resp = await api.Cpn_Campaign_DeleteMultiple(param);
        if (resp.isSuccess) {
          toast.success(t("Delete Successfully"));
          //await refetch();
          gridRef?.current?.refetchData();
        } else {
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
        }
      },
      title: t("Confirm"),
      contentConfirm: t("Do you want to delete?"),
    });
    // console.log("row ", rows);
  };

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    // console.log("handleToggleSearchPanel", gridRef?.instance);
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleCancel = () => {
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
    // if (e.dataField) {
    //   if (["OrgID", "PaymentTermCode"].includes(e.dataField!)) {
    //     e.editorOptions.readOnly = !e.row?.isNewRow;
    //   }
    // }
  };

  const arrayFilter: FilterItem[] = [
    {
      nameField: "DTimeStart", // thời gian bắt đầu
      active: true,
    },
    {
      nameField: "DTimeEnd", // thời gian kết thúc
      active: false,
    },
    {
      nameField: "CampaignName", // Tên chiến dịch
      active: false,
    },
  ];

  const toolBar: GridCustomerToolBarItem[] = [
    {
      text: "",
      onClick: () => {},
      shouldShow: (ref: any) => {
        return true;
      },
      widget: "customize",
      customize: (ref: any) => (
        <div className="px-1">
          <FilterDropdown
            buttonTemplate={<img src="/images/icons/filterHeader.png" />}
            genFilterFunction={
              <HeaderFilterPost ref={ref} t={t} listFilter={arrayFilter} />
            }
          />
        </div>
      ),
    },
    {
      permissionCode: "BTN_CAMPAIGN_CAMPAIGNMANAGER_START",
      text: t("Start"),

      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (
            ref.instance.getSelectedRowsData()[0] &&
            ref.instance.getSelectedRowKeys().length === 1
          ) {
            const status = ref.instance.getSelectedRowsData()[0].CampaignStatus;
            status === "APPROVE" ? (check = true) : false;
          } else {
            check = false;
          }
          return check;
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) =>
        excuteChanges("Start", ref.instance.getSelectedRowsData()),
    },
    {
      permissionCode: "BTN_CAMPAIGN_CAMPAIGNMANAGER_PAUSE",
      text: t("Pause"),
      shouldShow: (ref: any) => {
        if (ref) {
          let check = false;
          if (ref) {
            if (
              ref.instance.getSelectedRowsData()[0] &&
              ref.instance.getSelectedRowKeys().length === 1
            ) {
              const status =
                ref.instance.getSelectedRowsData()[0].CampaignStatus;
              status === "Pause" || status === "STARTED"
                ? (check = true)
                : false;
            } else {
              check = false;
            }
          } else {
            check = false;
          }
          return check;
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) =>
        excuteChanges("Pause", ref.instance.getSelectedRowsData()),
    },
    {
      permissionCode: "BTN_CAMPAIGN_CAMPAIGNMANAGER_APPROVE",
      text: t("Approve"),
      shouldShow: (ref: any) => {
        if (ref) {
          let check = false;
          if (ref) {
            if (
              ref.instance.getSelectedRowsData()[0] &&
              ref.instance.getSelectedRowKeys().length === 1
            ) {
              const status =
                ref.instance.getSelectedRowsData()[0].CampaignStatus;
              status === "PENDING" ? (check = true) : false;
            } else {
              check = false;
            }
          } else {
            check = false;
          }
          return check;
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) =>
        excuteChanges("Approve", ref.instance.getSelectedRowsData()),
    },
    {
      permissionCode: "BTN_CAMPAIGN_CAMPAIGNMANAGER_CONTINUE",
      text: t("Continue"),
      shouldShow: (ref: any) => {
        if (ref) {
          let check = false;
          if (ref) {
            if (
              ref.instance.getSelectedRowsData()[0] &&
              ref.instance.getSelectedRowKeys().length === 1
            ) {
              const status =
                ref.instance.getSelectedRowsData()[0].CampaignStatus;

              // console.log("status ", status);

              status === "PAUSED" ? (check = true) : false;
            } else {
              check = false;
            }
          } else {
            check = false;
          }
          return check;
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) =>
        excuteChanges("Continue", ref.instance.getSelectedRowsData()),
    },
    {
      permissionCode: "BTN_CAMPAIGN_CAMPAIGNMANAGER_FINISH",
      text: t("Finish"),
      shouldShow: (ref: any) => {
        if (ref) {
          let check = false;
          if (ref) {
            if (
              ref.instance.getSelectedRowsData()[0] &&
              ref.instance.getSelectedRowKeys().length === 1
            ) {
              const status =
                ref.instance.getSelectedRowsData()[0].CampaignStatus;
              status === "APPROVE" ||
              status === "STARTED" ||
              status === "PAUSED"
                ? (check = true)
                : false;
            } else {
              check = false;
            }
          } else {
            check = false;
          }
          return check;
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) =>
        excuteChanges("Finish", ref.instance.getSelectedRowsData()),
    },
    {
      permissionCode: "BTN_CAMPAIGN_CAMPAIGNMANAGER_UPDATE",
      text: t("Update"),
      shouldShow: (ref: any) => {
        if (ref) {
          let check = false;
          if (ref) {
            if (
              ref.instance.getSelectedRowsData()[0] &&
              ref.instance.getSelectedRowKeys().length === 1
            ) {
              const status =
                ref.instance.getSelectedRowsData()[0].CampaignStatus;
              status === "PENDING" ? (check = true) : false;
            } else {
              check = false;
            }
          } else {
            check = false;
          }
          return check;
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) => {
        const code = ref.instance.getSelectedRowsData()[0].CampaignCode;
        setFlagSelector("update");
        navigate(`/campaign/Cpn_CampaignPage/Cpn_Campaign_Info/update/${code}`);
      },
    },
    {
      permissionCode: "BTN_CAMPAIGN_CAMPAIGNMANAGER_DELETE",
      text: t("Delete"),
      shouldShow: (ref: any) => {
        if (ref) {
          let check = false;
          if (ref) {
            if (
              ref.instance.getSelectedRowsData()[0] &&
              ref.instance.getSelectedRowKeys().length >= 1
            ) {
              const status =
                ref.instance.getSelectedRowsData()[0].CampaignStatus;
              status === "PENDING" ? (check = true) : false;
            } else {
              check = false;
            }
          } else {
            check = false;
          }
          return check;
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) => {
        const code = ref.instance.getSelectedRowsData();
        handleDeleteRows(code);
      },
    },
  ];

  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: t("Cpn_CampaignPage Information"),
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

  const formSettings = useFormSettings({
    columns,
  });

  const onModify = async (id: any, data: Partial<any>) => {
    const resp = await api.Mst_PaymentTermController_Update({
      ...id,
      ...data,
    });
    if (resp.isSuccess) {
      toast.success(t("Update Successfully"));
      await gridRef?.current?.refetchData();
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
  // Section: CRUD operations
  const onCreate = async (data: Mst_PaymentTermData & { __KEY__: string }) => {
    const { __KEY__, ...rest } = data;
    // console.log(230, data);
    const resp = await api.Mst_PaymentTermController_Create({
      ...rest,
      FlagActive: rest.FlagActive ? "1" : "0",
    });
    if (resp.isSuccess) {
      toast.success(t("Create Successfully"));
      await gridRef?.current?.refetchData();
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

  const excuteChanges = async (Url: string, data: any[]) => {
    const obj = {
      OrgID: auth.orgData?.Id ?? "",
      CampaignCode: data[0].CampaignCode,
    };
    const response = await api.Cpn_Campaign_ExecuteState(obj, Url);
    if (response.isSuccess) {
      toast.success(t(`${Url} successfully`));
      gridRef?.current?._instance.clearSelection();
      gridRef?.current?.refetchData();
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
  };

  const handleSearch = async () => {
    gridRef?.current?.refetchData();
  };
  const handleOnEditRow = (e: any) => {
    const { row, column } = e;
    handleEdit(row.rowIndex);
  };

  const handleEditRowChanges = (e: any) => {};
  return (
    <AdminContentLayout className={"Cpn_CampaignPage"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart />
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout searchPermissionCode="BTN_CAMPAIGN_CAMPAIGNMANAGER_SEARCH">
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              colCount={1}
              storeKey="Cpn_CampaignPage_Condition"
              conditionFields={formItems}
              data={searchCondition?.current}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewStandard
              dataSource={[]}
              fetchData={refetchData}
              columns={columns}
              keyExpr={"CampaignCode"}
              popupSettings={popupSettings}
              formSettings={formSettings}
              onReady={(ref) => (gridRef.current = ref)}
              allowSelection={true}
              onSelectionChanged={handleSelectionChanged}
              onSaveRow={handleSavingRow}
              onEditorPreparing={handleEditorPreparing}
              onEditRowChanges={handleEditRowChanges}
              onDeleteRows={handleDeleteRows}
              // inlineEditMode="row"
              translateFilter={["CampaignStatus"]}
              customToolbarItems={[...toolBar]}
              toolbarItems={[
                {
                  location: "before",
                  widget: "dxButton",
                  options: {
                    icon: "search",
                    onClick: handleToggleSearchPanel,
                  },
                },
              ]}
              storeKey={"Cpn_CampaignPage-columns"}
            />
            <ListAgent onCancel={onCancel} />

            <PopupViewComponent
              onEdit={handleEdit}
              formSettings={formSettings}
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
