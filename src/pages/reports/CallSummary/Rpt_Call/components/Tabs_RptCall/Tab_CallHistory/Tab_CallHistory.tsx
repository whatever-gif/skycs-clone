import { useI18n } from "@/i18n/useI18n";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";
import { authAtom, showErrorAtom } from "@packages/store";
import { Mst_Area } from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { IItemProps } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import { useClientgateApi } from "@/packages/api";

import { SearchPanelV2 } from "@/packages/ui/search-panel";

import {
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getYearMonthDate,
} from "@/components/ulti";
import { callApi } from "@/packages/api/call-api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { getDMY } from "@/utils/time";
import { useColumns } from "./components/use-columns";
export const Tab_CallHistory = () => {
  const { t } = useI18n("Rpt_CallHistory");
  const { t: Tab_CallHistory } = useI18n("Tab_CallHistory");
  let gridRef: any = useRef(null);
  const showError = useSetAtom(showErrorAtom);
  const [searchCondition, setSearchCondition] = useState<any>({
    period: "day",
    callType: "All",
    fromDate: [new Date(new Date(Date.now())), new Date(new Date(Date.now()))],
  });
  const auth = useAtomValue(authAtom);
  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["rpt_GetCallHistoryFull"],
    queryFn: async () => {
      const condition = {
        ...searchCondition,
        fromDate:
          searchCondition.period === "day"
            ? searchCondition.fromDate[0]
              ? getYearMonthDate(searchCondition.fromDate[0])
              : null
            : searchCondition.fromDate[0]
            ? getFirstDateOfMonth(searchCondition.fromDate[0])
            : null,
        toDate:
          searchCondition.period === "day"
            ? searchCondition.fromDate[1]
              ? getYearMonthDate(searchCondition.fromDate[1])
              : null
            : searchCondition.fromDate[1]
            ? getLastDateOfMonth(searchCondition.fromDate[1])
            : null,
      };

      const response = await callApi.rpt_GetCallHistoryFull(auth.networkId, {
        ...condition,
      });
      if (response.Success) {
        if (response.Data) {
          let params: any = [];

          response.Data.forEach((item: any) => {
            if (
              item.RemoteNumber &&
              item.RemoteNumber.length > 9 &&
              params.filter((p: any) => p.CtmPhoneNo == item.RemoteNumber)
                .length == 0
            )
              params.push({
                CtmPhoneNo: item.RemoteNumber,
              });
          });

          var respData = await api.Mst_Customer_GetByCtmPhoneNo(params);
          if (
            respData.isSuccess &&
            respData.Data &&
            respData.Data.Lst_Mst_Customer &&
            respData.Data.Lst_Mst_Customer.length > 0 &&
            respData.Data.Lst_Mst_CustomerPhone &&
            respData.Data.Lst_Mst_CustomerPhone.length > 0
          ) {
            var ctmList = respData.Data.Lst_Mst_Customer;
            var phoneNoList = respData.Data.Lst_Mst_CustomerPhone;
            const result = response.Data.map(
              (itemValue: any, index: number) => {
                const item = {
                  ...itemValue,
                  idx: index + 1,
                };
                if (item.RemoteNumber) {
                  var phone = phoneNoList.find(
                    (ii: any) => ii.CtmPhoneNo == item.RemoteNumber
                  );
                  if (phone) {
                    var cus = ctmList.find(
                      (ii: any) => ii.CustomerCodeSys == phone.CustomerCodeSys
                    );
                    if (cus) {
                      return {
                        ...item,
                        CustomerName: cus.CustomerName,
                      };
                    } else {
                      return {
                        ...item,
                        CustomerName: "",
                      };
                    }
                  } else {
                    return {
                      ...item,
                      CustomerName: "",
                    };
                  }
                } else {
                  return {
                    ...item,
                    CustomerName: "",
                  };
                }
              }
            );
            return result;
          }
        }

        return response.Data.map((item: any, index: number) => {
          return {
            ...item,
            idx: index + 1,
            CustomerName: "",
          };
        });
      } else {
        // showError({
        //   message: (response.ErrorDetail),
        //   debugInfo: response.ErrorDetail,
        //   errorInfo: response.ErrorDetail,
        // });
        return null;
      }
    },
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

  const PostStatus = [
    { text: Tab_CallHistory("Rejected"), value: "Rejected" },
    { text: Tab_CallHistory("Cancel"), value: "Cancel" },
    { text: Tab_CallHistory("Complete"), value: "Complete" },
  ];

  const columns = useColumns({ data: data?.DataList || [] });

  const formItems: IItemProps[] = useMemo(() => {
    return [
      // {
      //   dataField: "period",
      //   caption: t("period"),
      //   editorType: "dxSelectBox",
      //   label: {
      //     text: t("period"),
      //   },
      //   visible: true,
      //   validationRules: [requiredType],
      //   editorOptions: {
      //     dataSource: [
      //       {
      //         title: t("Day"),
      //         value: "day",
      //       },
      //       {
      //         title: t("Month"),
      //         value: "month",
      //       },
      //     ],
      //     valueExpr: "value",
      //     displayExpr: "title",
      //     onValueChanged: (param: any) => {
      //       setFormatDate(param.value);
      //     },
      //   },
      // },
      {
        dataField: "fromDate", // dealine
        caption: t("fromDate"),
        visible: true,
        label: {
          text: t("Time"),
        },
        validationRules: [requiredType],
        editorOptions: {
          type: "date",
          calendarOptions: {
            maxZoomLevel: "month",
            // minZoomLevel: "decade",
          },
          displayFormat: "yyyy-MM-dd",
          // pickerType: "calendar",
          // useMaskBehavior: true,
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
          searchEnabled: true,
          searchExpr: ["Name"],
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
      {
        dataField: "RemoteNumber",
        caption: t("RemoteNumber"),
        label: {
          text: t("RemoteNumber"),
        },
        visible: true,
        editorType: "dxTextBox",
      },
      {
        dataField: "callId",
        caption: t("callId"),
        label: {
          text: t("callId"),
        },
        visible: true,
        editorType: "dxTextBox",
      },
      {
        caption: t("callType"),
        label: {
          text: t("callType"),
        },
        dataField: "callType",
        editorType: "dxSelectBox",
        editorOptions: {
          showClearButton: true,
          dataSource: [
            {
              title: t("All"),
              value: "All",
            },
            {
              title: t("Incoming"),
              value: "Incoming",
            },
            {
              title: t("Outgoing"),
              value: "Outgoing",
            },
            {
              title: t("Internal"),
              value: "Internal",
            },
          ],
          valueExpr: "value",
          displayExpr: "title",
          placeholder: t("Select"),
        },
      },
      {
        caption: t("callStatus"),
        label: {
          text: t("callStatus"),
        },
        dataField: "callStatus",
        editorType: "dxSelectBox",
        editorOptions: {
          showClearButton: true,
          dataSource: PostStatus,
          valueExpr: "value",
          displayExpr: "text",
          placeholder: t("Select"),
          searchEnabled: true,
          searchExpr: ["text"],
        },
      },
      {
        caption: t("tag"),
        label: {
          text: t("tag"),
        },
        dataField: "tag",
        editorType: "dxSelectBox",
        editorOptions: {
          dataSource: [
            {
              title: t("ALL"),
              value: "ALL",
            },
            {
              title: t("MST_CUSTOMER"),
              value: "MST_CUSTOMER",
            },
            {
              title: t("CPN_CAMPAIGN"),
              value: "CPN_CAMPAIGN",
            },
            {
              title: t("ET_TICKET"),
              value: "ET_TICKET",
            },
            {
              title: t("OTHER"),
              value: "OTHER",
            },
          ],
          showClearButton: true,
          valueExpr: "value",
          displayExpr: "title",
          placeholder: t("Select"),
        },
      },
    ];
  }, [isLoadingOrgInfo]);

  const handleDeleteRows = async (rows: any) => {
    const dataDelete = {
      KB_Post: {
        ...rows[0],
      },
    };
    const resp = await api.KB_PostData_Delete(dataDelete);
    if (resp.isSuccess) {
      toast.success(t("Delete Successfully"));
      await refetch();
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
  };
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

  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: t("CallHistory Information"),
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
    // setSearchCondition({
    //   ...data,
    // });
    // reloading();
    await refetch();
  };
  const handleEditRowChanges = () => {};
  const handleSelectionChanged = () => {};

  return (
    <AdminContentLayout className={""}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderNoSearchLayout>
          <PageHeaderNoSearchLayout.Slot name={"Before"}>
            <div className="text-header font-bold dx-font-m">
              {t("Call_History")}
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
        <ContentSearchPanelLayout searchPermissionCode="BTN_RPTCALL_HISTORY_SEARCH">
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelV2
              storeKey="Tab_CallHistory"
              conditionFields={formItems}
              data={searchCondition}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            {/* <div className="flex align-items-flex-start"> */}
            <GridViewCustomize
              isLoading={isLoading}
              dataSource={data}
              columns={columns}
              keyExpr={["Id"]}
              popupSettings={popupSettings}
              formSettings={{}}
              onReady={(ref) => {
                gridRef = ref;
              }}
              nameFile={`Báo cáo lịch sử cuộc gọi ${getDMY(
                new Date(Date.now())
              )}`}
              visibleExport={true}
              allowSelection={true}
              onSelectionChanged={handleSelectionChanged}
              onSaveRow={handleSavingRow}
              onEditorPreparing={handleEditorPreparing}
              allowInlineEdit={true}
              isHiddenCheckBox={true}
              permissionExport="BTN_RPTCALL_HISTORY_SEARCH"
              onEditRowChanges={handleEditRowChanges}
              onDeleteRows={handleDeleteRows}
              isSingleSelection={false}
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
              storeKey={"Tab_CallHistory"}
              customToolbarItems={
                [
                  // {
                  //   permissionCode: "BTN_RPTCALL_HISTORY_EXPORTEXCEL",
                  //   text: "Export",
                  //   onClick: () => handleExport,
                  //   shouldShow: () => {
                  //     return true;
                  //   },
                  // },
                ]
              }
            />
            {/* </div> */}
            {/* {!searchPanelVisibility && (
                <Button
                  className="button_Search "
                  icon={"/images/icons/search.svg"}
                  onClick={handleToggleSearchPanel}
                />
              )} */}
            {/* </div> */}
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
