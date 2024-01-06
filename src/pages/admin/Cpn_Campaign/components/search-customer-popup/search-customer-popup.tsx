import { getYearMonthDate } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import {
  dateFieldAtom,
  tagFieldAtom,
} from "@/pages/Mst_Customer/components/store";
import { SearchCustomerResult } from "@/pages/admin/Cpn_Campaign/components/search-customer-popup/search-customer-result";
import { getFullTime, getFullTimeMaxHour } from "@/utils/time";
import { useClientgateApi } from "@packages/api";
import { useConfiguration } from "@packages/hooks";
import { showErrorAtom } from "@packages/store";
import { FlagActiveEnum, MdMetaColGroupSpec } from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { DataGrid } from "devextreme-react";
import Button from "devextreme-react/button";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { visiblePopUpAtom } from "../Components/Cpn_Campaign_List_Customer/store";

interface DataFilter {
  staticField: MdMetaColGroupSpec[];
  dynamicFields: MdMetaColGroupSpec[];
  listMasterField: string[];
  listSearchRange: MdMetaColGroupSpec[];
  listQuery: MdMetaColGroupSpec[];
}

interface SearchCustomerPopupProps {
  onCancel: any;
  onSave: (data: any) => void;
}

export const SearchCustomerPopup = ({
  onCancel,
  onSave,
}: SearchCustomerPopupProps) => {
  const visiblePropsUpVallue = useAtomValue(visiblePopUpAtom);
  const config = useConfiguration();
  const tagField = useAtomValue(tagFieldAtom);
  const dateField = useAtomValue(dateFieldAtom);
  const { t } = useI18n("EditForm_Campaign");
  const api = useClientgateApi(); // api
  const showError = useSetAtom(showErrorAtom);
  // const [formValue, setFormValue] = useState({});
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
    Ft_PageSize: config.MAX_PAGE_ITEMS, // config.MAX_PAGE_ITEMS = 999999
    KeyWord: "",
    ScrTplCodeSys: "SCRTPLCODESYS.2023",
    CustomerSource: [],
  });

  const refetchData = async () => {
    const param = {
      ...searchCondition.current,
      Ft_PageIndex: gridRef.current?.instance.pageIndex() ?? 0,
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
    };

    const response = await api.Mst_Customer_Search(param);

    if (response.isSuccess) {
      const customizeResponse = {
        ...response,
        DataList: response?.DataList?.map((item: any) => {
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

          const listZalo = JSON.parse(item?.CustomerZaloUserFollowerJson) ?? [];
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
            ...item,
            ...customize,
            CtmEmail: emailResult,
            CtmPhoneNo: phoneNoResult,
            ZaloUserFollowerId: zaloResult,
          };
        }),
      };
      return customizeResponse ?? {};
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

  const handleCancel = () => {
    onCancel();
  };

  const handleSave = () => {
    onSave(gridRef.current?.instance.getSelectedRowsData());
  };

  const gridRef = useRef<DataGrid>(null);

  const handleSearch = async (data: any) => {
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

  useEffect(() => {}, [visiblePropsUpVallue]);

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

  return (
    <Popup
      className="popup-customer"
      position={"center"}
      showCloseButton={true}
      onHiding={handleCancel}
      title={t(`Select Customers`)}
      visible={visiblePropsUpVallue}
    >
      {!isLoadingColumn &&
        !isLoadingListGroup &&
        !isLoadinglistCustomerType &&
        !isLoadinglistCountry &&
        !isLoadinglistCustomerGrp &&
        !isLoadinglistPartnerType &&
        !isLoadinglistCustomerCodeSysERP &&
        !isLoadinglistCustomerSource && (
          // <ScrollView
          //   className="popup-customer-content"
          //   width={"100%"}
          //   height={windowSize.height - 310}
          // >
          <SearchCustomerResult
            searchCondition={searchCondition.current}
            customizeClass={``}
            ref={gridRef}
            dataApi={{
              listCustomerType: listCustomerType,
              listCountry: listCountry,
              listCustomerGrp: listCustomerGrp,
              listPartnerType: listPartnerType,
              listCustomerCodeSysERP: listCustomerCodeSysERP,
              listCustomerSource: listCustomerSource,
            }}
            data={refetchData}
            listColumn={listColumn!}
            listGroup={listGroup!}
            onSearch={handleSearch}
          />
          // </ScrollView>
        )}
      <ToolbarItem toolbar={"bottom"} location={"after"}>
        <Button
          text={t("Select")}
          type={"default"}
          stylingMode={"contained"}
          className="mr-1"
          onClick={handleSave}
        />
        <Button
          text={t("Cancel")}
          stylingMode={"contained"}
          onClick={handleCancel}
        />
      </ToolbarItem>
    </Popup>
  );
};
