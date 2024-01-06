import PermissionContainer from "@/components/PermissionContainer";
import { getYearMonthDate } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useConfiguration } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@/packages/layouts/content-searchpanel-layout";
import { showErrorAtom } from "@/packages/store";
import { FlagActiveEnum } from "@/packages/types";
import { GridCustomerToolBarItem } from "@/packages/ui/base-gridview/components/grid-custom-toolbar";
import { GridViewStandard } from "@/packages/ui/base-gridview/gridview-standard";
import SearchCondition from "@/pages/Mst_Customer/components/searchCondition";
import {
  dateFieldAtom,
  selecteItemsAtom,
  tagFieldAtom,
} from "@/pages/Mst_Customer/components/store";
import { useColumn } from "@/pages/Mst_Customer/components/use-columns";
import { getFullTime, getFullTimeMaxHour } from "@/utils/time";
import { useQuery } from "@tanstack/react-query";
import { Button, DataGrid, LoadPanel, Popup } from "devextreme-react";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { visiblePopup } from "./store";
import "./style.scss";

const usePopupCustomerContract = ({
  refetchList,
  listContact,
  handleOpen,
  handleClose,
  loadingApi,
  data: dataValue,
}: any) => {
  const { t } = useI18n("usePopupCustomerContract");
  const visible = useAtomValue(visiblePopup);
  const showError = useSetAtom(showErrorAtom);
  const api = useClientgateApi();
  const [randomKey, setRandomKey] = useState<string>(nanoid());
  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const handleAdd = () => {
    handleOpen();
  };

  const {
    data: listGroup,
    isLoading: isLoadingListGroup,
    refetch,
  } = useQuery({
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

  useEffect(() => {
    Promise.all([refetchColumn(), refetch()]).then(() => {
      setIsLoadingAll(false);
    });
  }, []);

  const {
    data: listColumn,
    isLoading: isLoadingColumn,
    refetch: refetchColumn,
  } = useQuery({
    queryKey: ["ListColumn"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupSpec_Search({
        param: {},
      });
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
                  responseDynamic?.DataList.map((item) => {
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

  // useEffect(() => {
  //   refetchColumn();
  //   // refetchDynamic();
  // }, [key]);

  return (
    <>
      <PermissionContainer
        permission={"BTN_CUSTOMER_DTLCUSTOM_TABLISTCONTACT_ADDCONTACT"}
      >
        <Button
          type={"default"}
          style={{ padding: 10, position: "absolute", left: 10, top: 5 }}
          className="absolute"
          onClick={handleAdd}
        >
          {t("Add new contact")}
        </Button>
      </PermissionContainer>

      <Popup
        visible={visible}
        onHidden={handleClose}
        title={t("Find Customer")}
        showCloseButton
        height={600}
        className="popup-contact"
      >
        <LoadPanel visible={isLoadingAll} />
        {/* <ScrollView showScrollbar="always"> */}
        <div className="h-full">
          {contentRender({
            listGroup: listGroup,
            listColumn: listColumn ?? {
              dataField: [],
              listMaster: [],
            },
            data: dataValue,
            handleClose: handleClose,
            refetchList: refetchList,
            listContact: listContact ? listContact?.DataList : [],
            key: randomKey,
          })}
        </div>
        {/* </ScrollView> */}
      </Popup>
    </>
  );
};

export default usePopupCustomerContract;

export const contentRender = ({
  listGroup,
  listColumn,
  handleClose,
  refetchList,
  listContact,
  key,
  data,
}: any) => {
  const showError = useSetAtom(showErrorAtom);
  const { t } = useI18n("Button");
  const { CustomerCodeSys }: any = useParams();

  const api = useClientgateApi();
  let gridRef: any = useRef<DataGrid | null>(null);

  const config = useConfiguration();
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const tagField = useAtomValue(tagFieldAtom);
  const dateField = useAtomValue(dateFieldAtom);
  const [formValue, setFormValue] = useState({});
  const searchCondition = useRef<Partial<any>>({
    // state deafult của search
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
    Ft_PageSize: 1000, // config.MAX_PAGE_ITEMS = 999999
    KeyWord: "",
    ScrTplCodeSys: "SCRTPLCODESYS.2023",
    CustomerSource: [],
    SOApprDateFrom: "",
    SOApprDateToInit: "",
    SOApprDateTo: "",
    DealerCode: "",
  });

  const columns = useColumn({
    data: [],
    dataField: listColumn,
    dataGroup: listGroup ?? [],
  });

  const handleSearch = async (data: any) => {
    const getStaticList = listColumn?.dataField.filter(
      (item: any) => item.FlagIsColDynamic !== "1"
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
  };

  const setSelectedItems = useSetAtom(selecteItemsAtom);

  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };

  const onDelete = async (id: Partial<any>) => {};

  const onCreate = async (data: any) => {};

  const onModify = async (key: any, data: any) => {};

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

  const handleEditorPreparing = () => {};

  const handleDeleteRow = () => {};

  const handleEditRowChanges = () => {};

  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  const { t: common } = useI18n("Common");

  const handleAdd = async (ref: any) => {
    const listCheck: any[] = ref?.instance?.getSelectedRowsData() ?? [];
    if (listCheck && listCheck.length > 0) {
      const req = listCheck?.map((item: any) => {
        return {
          OrgID: item?.OrgID,
          NetworkID: item?.NetworkID,
          CustomerCodeSys: CustomerCodeSys,
          CustomerCodeSysContact: item?.CustomerCodeSys,
        };
      });

      const resp: any = await api.Mst_CustomerContact_Create(req);

      if (resp.isSuccess) {
        toast.success(common("Create successfully!"));
        handleClose();
        refetchList();
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
    }
  };

  const refetchData = useCallback(async () => {
    const resp: any = await api.Mst_Customer_Search({
      ...searchCondition.current,
      FlagActive: "1",
      t_PageIndex: gridRef.current?.instance.pageIndex() ?? 0,
      Ft_PageSize: gridRef.current?.instance.pageSize() ?? 100,
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
      ...formValue,
    });

    if (resp?.isSuccess) {
      if (resp?.DataList) {
        const result = resp?.DataList?.filter((item: any) => {
          return !listContact?.find(
            (c: any) => c?.CustomerCodeSysContact == item?.CustomerCodeSys
          );
        });

        return {
          ...resp,
          DataList: result,
        };
      } else {
        return [];
      }
    }
  }, []);

  const toolbar: GridCustomerToolBarItem[] = [
    {
      text: t(`Add`),
      onClick: (e: any, ref: any) => handleAdd(ref),
      shouldShow: (ref: any) => {
        let check = false;
        if (ref) {
          if (ref.instance.getSelectedRowsData().length > 0) {
            check = true;
          }
          return check;
        } else {
          return false;
        }
      },
    },
  ];

  return (
    <AdminContentLayout
      className={"Mst_Customer_ w-full h-[100%] popup-contact"}
    >
      <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout>
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            {/* cái component này dùng chung cho cả bên chi tiết chiến dịch
                nên đừng có sửa linh tinh mà sửa thì sửa cả hai chỗ */}
            <SearchCondition
              listColumn={
                listColumn ?? {
                  dataField: [],
                  listMaster: [],
                }
              }
              data={data}
              formData={searchCondition.current}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewStandard
              customerHeight={500}
              isLoading={false}
              dataSource={[]}
              columns={columns}
              fetchData={refetchData}
              allowInlineEdit={false}
              keyExpr={["CustomerCodeSys"]}
              popupSettings={{}}
              formSettings={{}}
              onReady={(ref) => (gridRef.current = ref)}
              allowSelection={true}
              onSelectionChanged={handleSelectionChanged}
              onSaveRow={handleSavingRow}
              onEditorPreparing={handleEditorPreparing}
              onDeleteRows={handleDeleteRow}
              onEditRowChanges={handleEditRowChanges}
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
              customToolbarItems={toolbar}
              storeKey={"Mst_Customer_Detail_Column"}
              // editable={false}
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
