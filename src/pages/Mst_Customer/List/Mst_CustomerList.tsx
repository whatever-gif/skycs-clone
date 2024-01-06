import { getYearMonthDate } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration, useNetworkNavigate } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@/packages/layouts/content-searchpanel-layout";
import { showErrorAtom } from "@/packages/store";
import {
  FlagActiveEnum,
  MdMetaColGroupSpec,
  Mst_Customer,
} from "@/packages/types";
import { GridCustomerToolBarItem } from "@/packages/ui/base-gridview/components/grid-custom-toolbar";
import { GridViewStandard } from "@/packages/ui/base-gridview/gridview-standard";
import {
  flagCustomer,
  selecteItemsAtom,
  tagFieldAtom,
} from "@/pages/Mst_Customer/components/store";
import { getFullTime, getFullTimeMaxHour } from "@/utils/time";
import { useQuery } from "@tanstack/react-query";
import { DataGrid } from "devextreme-react";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { confirm } from "devextreme/ui/dialog";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useRef } from "react";
import { toast } from "react-toastify";
import LoadingComponent from "../components/LoadingComponent";
import "../components/custom.scss";
import HeaderPart from "../components/header-part";
import { useColumn } from "../components/use-columns";
import SearchCondition from "./../components/searchCondition";
interface DataFilter {
  staticField: MdMetaColGroupSpec[];
  dynamicFields: MdMetaColGroupSpec[];
  listMasterField: string[];
  listSearchRange: MdMetaColGroupSpec[];
  listQuery: MdMetaColGroupSpec[];
}

interface Props {
  bePopUp?: boolean;
  isHideHeader?: Boolean;
}

interface searchForm {
  CreateDTimeUTC: any[];
  CtmEmail: string;
  CtmPhoneNo: string;
  CustomerCode: string;
  CustomerCodeSysERP: string;
  CustomerGrpCode: any;
  CustomerName: string;
  CustomerType: string;
  MST: string;
  PartnerType: any;
  JsonColDynamicSearch: any;
  FlagActive: any;
  Ft_PageIndex: number;
  Ft_PageSize: number;
  KeyWord: string;
  ScrTplCodeSys: string;
  CustomerSource: any;
}

export const Mst_CustomerList = ({ bePopUp, isHideHeader = false }: Props) => {
  const navigate = useNetworkNavigate();
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom); // state lưu trữ trạng thái đóng mở của nav search
  const setSelectedItems = useSetAtom(selecteItemsAtom); // state lưu trữ thông tin của items khi mà click radio
  let gridRef: any = useRef<DataGrid | null>(null);
  const { auth } = useAuth();
  const { t } = useI18n("Mst_Customer"); // file biên dịch

  const { t: toastTranslate } = useI18n("Mst_Customer_Notify");

  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom); // state lưu trữ lỗi khi call api
  const tagField = useAtomValue(tagFieldAtom);
  const searchCondition = useRef<Partial<searchForm>>({
    CreateDTimeUTC: [null, null],
    CtmEmail: "",
    CtmPhoneNo: "",
    CustomerCode: "",
    CustomerCodeSysERP: "",
    CustomerGrpCode: [],
    CustomerName: "",
    CustomerType: "",
    MST: "",
    PartnerType: [],
    JsonColDynamicSearch: "[]",
    FlagActive: FlagActiveEnum.All, // FlagActiveEnum.All = ""
    Ft_PageIndex: 0,
    Ft_PageSize: config.PAGE_SIZE, // config.MAX_PAGE_ITEMS = 999999
    KeyWord: "",
    ScrTplCodeSys: "SCRTPLCODESYS.2023",
    CustomerSource: [],
  });

  const setFlagCustomer = useSetAtom(flagCustomer);
  const { data: listGroup, isLoading: isLoadingListGroup } = useQuery({
    queryKey: ["List_Group_Key"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupApi_Search({
        ScrTplCodeSys: "ScrTplCodeSys.2023",
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
    data: listColumn,
    isLoading: isLoadingColumn,
    refetch: refetchColumn,
  } = useQuery({
    queryKey: ["ListColumn"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupSpec_Search(
        {
          FlagActive: "1",
        },
        "ScrTplCodeSys.2023"
      );
      if (response.isSuccess) {
        if (response?.DataList) {
          const customizeResponse = response?.DataList.filter((item: any) => {
            return (
              item?.ColDataType === "MASTERDATA" ||
              item?.ColDataType === "MASTERDATASELECTMULTIPLE"
            );
          }).map((item: any) => {
            return item.ColCodeSys;
          });
          if (customizeResponse.length) {
            const responseDynamic = await api.MDMetaColGroupSpec_GetListOption(
              customizeResponse
            );
            if (responseDynamic.isSuccess) {
              return {
                dataField: response?.DataList ?? [],
                listMaster:
                  responseDynamic?.DataList.map((item: any) => {
                    return {
                      ColCodeSys: item.ColCodeSys,
                      dataSource: item.Lst_MD_OptionValue,
                    };
                  }) ?? [],
              };
            } else {
              showError({
                message: responseDynamic._strErrCode,
                _strErrCode: responseDynamic._strErrCode,
                _strTId: responseDynamic._strTId,
                _strAppTId: responseDynamic._strAppTId,
                _objTTime: responseDynamic._objTTime,
                _strType: responseDynamic._strType,
                _dicDebug: responseDynamic._dicDebug,
                _dicExcs: responseDynamic._dicExcs,
              });
            }
          } else {
            return {
              dataField: response?.DataList ?? [],
              listMaster: [],
            };
          }
        }

        return {
          dataField: response?.DataList ?? [],
          listMaster: [],
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
      }
    },
  });

  const api = useClientgateApi(); // api

  const handleSearch = async (data: any) => {
    if (!isLoadingColumn) {
      // get static field
      const getStaticList = listColumn?.dataField.filter(
        (item) => item.FlagIsColDynamic !== "1"
      );

      // check exist static field in data
      const fieldOfData = Object.entries(data);
      const staticFieldOfData = fieldOfData
        .filter((item) => {
          return getStaticList?.find((c: any) => c?.ColCodeSys === item[0]);
        })
        .map((item) => {
          return {
            [`${item[0]}`]: item[1],
          };
        });
      // get value of static and convert value to search
      const convertStaticField = staticFieldOfData
        .map((item: any) => {
          return item;
        })
        .reduce((acc, item) => {
          return {
            ...acc,
            ...item,
          };
        }, {});
      // get dynamic fields
      const getDynamicField = listColumn?.dataField.filter((item) => {
        return item.FlagIsColDynamic == "1";
      });

      const dynamicFieldOfData = fieldOfData
        .filter((item) => {
          return getDynamicField?.find((c: any) => c?.ColCodeSys === item[0]);
        })
        .map((item) => {
          return {
            [`${item[0]}`]: item[1],
          };
        });

      const dateFieldName = listColumn?.dataField.filter((item) => {
        return item.ColDataType === "DATE";
      });

      const tagFieldName = listColumn?.dataField.filter((item) => {
        return tagField.includes(item.ColDataType);
      });

      const convertDynamicField = dynamicFieldOfData.map((item) => {
        const checkDate = dateFieldName?.find((itemDate) => {
          return itemDate.ColCodeSys === Object.keys(item)[0];
        });

        if (Object.keys(item)[0] === "C0AT") {
          return {
            ColCodeSys: Object.keys(item)[0],
            ColValue1: null,
            ColValue2: null,
          };
        }

        if (Object.keys(item)[0] === "C007") {
          return {
            ColCodeSys: Object.keys(item)[0],
            ColValue1: null,
            ColValue2: null,
          };
        }

        if (Object.keys(item)[0] === "C0B3") {
          return {
            ColCodeSys: Object.keys(item)[0],
            ColValue1: null,
            ColValue2: null,
          };
        }

        const checkMultiple = tagFieldName?.find((itemDate) => {
          return itemDate.ColCodeSys === Object.keys(item)[0];
        });

        if (checkMultiple) {
          return {
            ColCodeSys: Object.keys(item)[0],
            ColValue1: Object.values(item)[0]
              ? Object.values(item)[0].join(",")
              : null,
            ColValue2: data[`${Object.keys(item)[0]}_To`]
              ? data[`${Object.keys(item)[0]}_To`].join(",")
              : null,
          };
        }
        if (checkDate) {
          return {
            ColCodeSys: Object.keys(item)[0],
            ColValue1: Object.values(item)[0]
              ? getYearMonthDate(Object.values(item)[0])
              : null,
            ColValue2: data[`${Object.keys(item)[0]}_To`]
              ? getYearMonthDate(data[`${Object.keys(item)[0]}_To`])
              : null,
          };
        } else {
          return {
            ColCodeSys: Object.keys(item)[0],
            ColValue1: Object.values(item)[0],
            ColValue2: data[`${Object.keys(item)[0]}_To`],
          };
        }
      });

      const buildSearch = {
        ...searchCondition.current,
        ...convertStaticField,
        ...convertDynamicField,
        JsonColDynamicSearch: JSON.stringify(convertDynamicField),
      };
      searchCondition.current = buildSearch;
      gridRef?.current?.refetchData();
    }
  };

  // các cột của gridview
  const columns = useColumn({
    data: [],
    dataField: listColumn ?? {
      dataField: [],
      listMaster: [],
    },
    dataGroup: listGroup ?? [],
  });

  // hàm thêm cột ở trong trường hợp popup thì là mở popup
  const handleAddNew = () => {
    setFlagCustomer("add");
    navigate("/customer/add");
  };

  const handleSubmit = () => {
    gridRef.current?._instance?.saveEditData();
  };

  const handleCancel = () => {
    gridRef.current?.instance?.cancelEditData();
  };

  // hàm delete
  const onDelete = async (id: Partial<any>) => {};

  // call api tạo
  const onCreate = async (data: Partial<Mst_Customer>) => {};

  // call api delete multiple
  const handleDeleteRow = async (a: any) => {
    const result = confirm(
      `<string>${t("Are You Want To Delete ?")}</string>`,
      t("Delete")
    );
    result.then(async (dialogResult: any) => {
      if (dialogResult) {
        if (a.length > 1) {
          const list =
            a?.map((item: any) => {
              return {
                OrgID: auth?.orgData?.Id,
                CustomerCodeSys: item?.CustomerCodeSys,
                NetworkID: auth?.networkId,
              };
            }) ?? [];

          const resp = await api.Mst_Customer_DeleteMultiple(list);

          if (resp.isSuccess) {
            toast.success(toastTranslate("Delete successfully!"));
            // await refetch();
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
        } else {
          const response = await api.Mst_Customer_Delete({
            OrgID: auth?.orgData?.Id,
            CustomerCodeSys: a[0]?.CustomerCodeSys,
            NetworkID: auth?.networkId,
          });

          if (response.isSuccess) {
            toast.success(toastTranslate("Delete successfully!"));
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
        }
      }
    });
  };

  const handleDeleteSingle = (a: any) => {
    const result = confirm(
      `<string>${t("Are You Want To Delete ?")}</string>`,
      `${t("Delete!")}`
    );

    result.then(async (dialogResult: any) => {
      if (dialogResult) {
        const response = await api.Mst_Customer_Delete({
          OrgID: auth?.orgData?.Id,
          NetworkID: auth?.networkId,
          CustomerCodeSys: a.row.data.CustomerCodeSys,
        });
        if (response.isSuccess) {
          toast.success(toastTranslate("Delete successfully!"));
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
      }
    });
  };

  // call api update
  const onModify = async (
    key: Partial<Mst_Customer>,
    data: Partial<Mst_Customer>
  ) => {};

  // Thực thi action thêm sửa xóa
  const handleSavingRow = (e: any) => {
    if (e.changes && e.changes.length > 0) {
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

  // setting popup ( title , button )
  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: "Mst_Customer",
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

  // setup form

  // popup detail
  const handleEditorPreparing = (e: EditorPreparingEvent) => {};
  // set các row khi check vào state lưu trữ
  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };

  // action đóng mở nav search (show or not show)
  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  // hàm sửa row ( mở popup )
  const handleEditRowChanges = () => {};

  const onReload = useCallback(() => {
    gridRef?.current?.refetchData();
  }, []);

  const handleCustomerEdit = (e: any) => {
    const { row } = e;
    const { data } = row;
    const { CustomerCodeSys } = data;
    setFlagCustomer("update");
    navigate(`/customer/edit/${CustomerCodeSys}`);
  };

  const toolbar: GridCustomerToolBarItem[] = [
    {
      permissionCode: "",
      text: t("Delete"),
      shouldShow: (ref: any) => {
        if (ref) {
          if (ref.instance.getSelectedRowKeys().length > 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },
      onClick: (e: any, ref: any) =>
        handleDeleteRow(ref.instance.getSelectedRowsData()),
    },
  ];

  // data content
  const { data: listCustomerType, isLoading: isLoadinglistCustomerType }: any =
    useQuery(["listCustomerType"], api.Mst_CustomerType_GetAllCustomerType);

  const { data: listCountry, isLoading: isLoadinglistCountry }: any = useQuery(
    ["ListCountry"],
    api.Mst_Country_GetAllActive
  );

  const { data: listCustomerGrp, isLoading: isLoadinglistCustomerGrp }: any =
    useQuery(["listCustomerGrp"], api.Mst_CustomerGroup_GetAllActive);

  const { data: listPartnerType, isLoading: isLoadinglistPartnerType }: any =
    useQuery(["listPartnerType"], api.Mst_PartnerType_GetAllActive);

  const {
    data: listCustomerCodeSysERP,
    isLoading: isLoadinglistCustomerCodeSysERP,
  }: any = useQuery(["listCustomerCodeSysERP"], async () => {
    const resp: any = await api.Mst_Customer_Search({
      FlagActive: 1,
      Ft_PageIndex: 0,
      Ft_PageSize: 1000,
      CustomerType: "TOCHUC",
    });

    return resp?.DataList ?? [];
  });

  const {
    data: listCustomerSource,
    isLoading: isLoadinglistCustomerSource,
  }: any = useQuery(["listCustomerSource"], async () => {
    const resp: any = await api.MdMetaColGroupSpec_Search(
      {},
      "ScrTplCodeSys.2023"
    );

    if (resp?.DataList && resp?.DataList?.length > 0) {
      const find = resp?.DataList?.find(
        (item: any) => item?.ColCodeSys == "C0K5"
      );

      if (find) {
        const data = JSON.parse(find?.JsonListOption ?? "[]");

        return data;
      }

      return [];
    }

    return [];
  });

  const IsLoadingAll = () => {
    return (
      isLoadingListGroup &&
      isLoadingColumn &&
      isLoadinglistCustomerType &&
      isLoadinglistCountry &&
      isLoadinglistCustomerGrp &&
      isLoadinglistPartnerType &&
      isLoadinglistCustomerCodeSysERP &&
      isLoadinglistCustomerSource
    );
  };

  const refetchData = async () => {
    if (IsLoadingAll()) {
      return;
    } else {
      const param = {
        ...searchCondition.current,
        Ft_PageIndex: gridRef.current?.instance.pageIndex() ?? 0,
        Ft_PageSize: gridRef.current?.instance.pageSize() ?? config.PAGE_SIZE,
        CustomerGrpCode:
          searchCondition.current?.CustomerGrpCode?.join(",") ?? "",
        PartnerType: searchCondition.current?.PartnerType?.join(",") ?? "",
        KeyWord:
          searchCondition.current?.CustomerName ??
          searchCondition.current?.CustomerCode ??
          "",
        CreateDTimeUTCFrom: searchCondition?.current?.CreateDTimeUTC[0]
          ? getFullTime(searchCondition?.current?.CreateDTimeUTC[0])
          : "",
        CreateDTimeUTCTo: searchCondition?.current?.CreateDTimeUTC[1]
          ? getFullTimeMaxHour(searchCondition.current?.CreateDTimeUTC[1])
          : "",
      };
      const response = await api.Mst_Customer_Search(param);

      if (response.isSuccess) {
        const customizeResponse = {
          ...response,
          DataList: response?.DataList?.sort((a: any, b: any) => {
            const c: any = new Date(a?.LUDTimeUTC);

            const d: any = new Date(b?.LUDTimeUTC);

            return d - c;
          })?.map((item: any) => {
            const listJson: any[] = item.JsonCustomerInfo
              ? JSON.parse(item.JsonCustomerInfo) ?? []
              : [];
            const customize = listJson.reduce((acc, item) => {
              return {
                ...acc,
                [`${item.ColCodeSys}`]: item.ColValue ?? "",
              };
            }, {});
            const listEmailJson = JSON.parse(item?.CustomerEmailJson) ?? [];
            const emailResult =
              listEmailJson?.find((item: any) => item?.FlagDefault == "1")
                ?.CtmEmail ?? "";
            const customerGroup = JSON.parse(
              item?.CustomerInCustomerGroupJson ?? "[]"
            );
            const listPhoneNoJson = JSON.parse(item?.CustomerPhoneJson) ?? [];
            const phoneNoResult =
              listPhoneNoJson?.find((item: any) => item?.FlagDefault == "1")
                ?.CtmPhoneNo ?? "";

            const listZalo =
              JSON.parse(item?.CustomerZaloUserFollowerJson) ?? [];
            const zaloResult =
              listZalo?.find((item: any) => item?.FlagDefault == "1")
                ?.ZaloUserFollowerId ?? "";

            if (customerGroup.length) {
              return {
                ...item,
                ...customize,
                ...customerGroup[0],
                CtmEmail: emailResult,
                CtmPhoneNo: phoneNoResult,
                ZaloUserFollowerId: zaloResult,
              };
            }

            return {
              ...searchCondition.current,
              ...item,
              ...customize,
              CtmEmail: emailResult,
              CtmPhoneNo: phoneNoResult,
              ZaloUserFollowerId: zaloResult,
            };
          }),
        };
        return customizeResponse ?? [];
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
    }
  };

  return (
    <div className="w-full h-full ">
      <AdminContentLayout className={"Mst_Customer"}>
        {/* Header */}
        <AdminContentLayout.Slot name={"Header"}>
          {/* có tác dụng là tạo dữ liệu vào trong data và thực thi các action nhự import excel , export excel*/}
          <HeaderPart
            onReload={onReload}
            onAddNew={handleAddNew}
            searchCondition={searchCondition.current}
          ></HeaderPart>
        </AdminContentLayout.Slot>
        {/* Content */}
        <AdminContentLayout.Slot name={"Content"}>
          <ContentSearchPanelLayout searchPermissionCode="BTN_CUSTOMER_LIST_SEARCH">
            {/* Search */}

            <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
              {!IsLoadingAll() && (
                // cái component này dùng chung cho cả bên chi tiết chiến dịch nên đừng có sửa linh tinh mà sửa thì sửa cả hai chỗ
                <SearchCondition
                  listColumn={
                    listColumn ?? {
                      dataField: [],
                      listMaster: [],
                    }
                  }
                  data={{
                    listCustomerType: listCustomerType,
                    listCountry: listCountry,
                    listCustomerGrp: listCustomerGrp,
                    listPartnerType: listPartnerType,
                    listCustomerCodeSysERP: listCustomerCodeSysERP,
                    listCustomerSource: listCustomerSource,
                  }}
                  formData={searchCondition.current}
                  onSearch={handleSearch}
                />
              )}
            </ContentSearchPanelLayout.Slot>
            <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
              <GridViewStandard
                fetchData={refetchData}
                isLoading={IsLoadingAll()} // props dùng để render
                isShowIconEdit={true}
                dataSource={[]} // dữ liệu của gridview lấy từ api
                columns={columns} // các cột ở trong grid view
                keyExpr={["CustomerCodeSys"]} // khóa chính
                popupSettings={popupSettings} // popup editor
                allowInlineEdit={true}
                onReady={(ref) => (gridRef.current = ref)} // gắn ref
                allowSelection={true}
                // allowSelection={false} //cho phép chọn row hay không
                onSelectionChanged={handleSelectionChanged} // dùng để lấy hàng khi tích chọn checkbox
                onSaveRow={handleSavingRow} // thực hiện các action thêm sửa xóa
                onEditorPreparing={handleEditorPreparing} // thực hiện hành động trước khi show màn hình thêm sửa xóa
                // onEditRow={handleOnEditRow}
                onEditRow={handleCustomerEdit}
                // inlineEditMode="row"
                isShowEditting={true}
                onDeleteRows={handleDeleteSingle} // hàm này để xóa multiple (  )
                onEditRowChanges={handleEditRowChanges}
                toolbarItems={[
                  //  button search và action của nó
                  {
                    location: "before",
                    widget: "dxButton",
                    options: {
                      icon: "search",
                      onClick: handleToggleSearchPanel,
                    },
                  },
                ]}
                permissionEdit={"BTN_CUSTOMER_LIST_EDIT"}
                permissionDelete={"BTN_CUSTOMER_LIST_DELETE"}
                permissionDeleteMulti={"BTN_CUSTOMER_LIST_DELETEMULTI"}
                customToolbarItems={toolbar}
                storeKey={"Mst_Customer_Column"} // key lưu trữ giá trị grid view trong localstorage
              />
              <LoadingComponent onReload={onReload} />
              {/* popup detail*/}
            </ContentSearchPanelLayout.Slot>
          </ContentSearchPanelLayout>
        </AdminContentLayout.Slot>
      </AdminContentLayout>
    </div>
  );
};
