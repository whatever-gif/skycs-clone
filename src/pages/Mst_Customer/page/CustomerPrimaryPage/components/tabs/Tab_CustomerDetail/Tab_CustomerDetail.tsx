import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { MdMetaColGroupSpec } from "@/packages/types";
import { useQuery } from "@tanstack/react-query";
import { Form, LoadPanel } from "devextreme-react";
import { GroupItem } from "devextreme-react/form";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { GroupField } from "@/components/fields/GroupField";
import { useNetworkNavigate } from "@/packages/hooks";
import { getListField } from "@/utils/customer-common";

import { useAuth } from "@/packages/contexts/auth";
import "./style.scss";

const Tab_CustomerDetail = () => {
  const param = useParams();
  const navigate = useNetworkNavigate();
  const { t } = useI18n("Mst_Customer");
  const api = useClientgateApi();
  const ref = useRef(null);
  const { auth: crAuth } = useAuth();
  const showError = useSetAtom(showErrorAtom);
  const formRef: any = useRef(null);
  const [dynamicFields, setDynamicFields] = useState<any>([]);
  const [formValue, setFormValue] = useState<any>({});

  const { t: fieldTranslate } = useI18n("Mst_Customer_Field");

  const {
    data: listCodeField,
    isLoading: isLoadingCodeField,
    refetch: refetchCodeField,
  } = useQuery({
    queryKey: ["ListCodeField"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupSpec_Search(
        {},
        "SCRTPLCODESYS.2023"
      );
      if (response.isSuccess) {
        if (response?.DataList) {
          const listDynamicFields: any[] = response?.DataList.filter(
            (item: MdMetaColGroupSpec) =>
              (item?.ColDataType === "MASTERDATA" ||
                item?.ColDataType === "MASTERDATASELECTMULTIPLE") &&
              item?.FlagActive
          ).map((item: MdMetaColGroupSpec) => item?.ColCodeSys);
          if (listDynamicFields.length) {
            setDynamicFields(listDynamicFields);
          }
        }

        const list = response.DataList?.filter(
          (item: any) => item.FlagActive
        ).map((item: any) => {
          if (item?.ColCaption == "Ngày sinh") {
            return {
              ...item,
              ColDataType: "BIRTHDAY",
            };
          }
          return item;
        });

        return list;
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
    data: listDynamic,
    isLoading: isLoadingDynamic,
    refetch: refetchDynamic,
  } = useQuery({
    queryKey: ["ListDynamic", dynamicFields],
    queryFn: async () => {
      if (dynamicFields.length) {
        const response = await api.MDMetaColGroupSpec_GetListOption(
          dynamicFields
        );
        if (response.isSuccess) {
          return response.DataList?.reduce((result, item) => {
            result[item.ColCodeSys] = item.Lst_MD_OptionValue;
            return result;
          }, {} as { [key: string]: any[] });
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
      } else {
        return {};
      }
    },
  });

  const {
    data: listGroupCode,
    isLoading: isLoadingGroupCode,
    refetch: refetchGroupCode,
  } = useQuery({
    queryKey: ["listGroupCode"],
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
    data: getValueItem,
    isLoading: isLoadingValueItem,
    refetch: refetchValueItem,
  } = useQuery({
    queryKey: ["getValueItem_Value", param],
    queryFn: async () => {
      if (param.CustomerCodeSys) {
        const response: any = await api.Mst_Customer_GetByCustomerCode([
          param.CustomerCodeSys,
        ]);

        if (response.isSuccess) {
          if (response?.Data?.Lst_Mst_Customer) {
            const firstChild = response?.Data?.Lst_Mst_Customer[0];

            const valueForm = JSON.parse(firstChild.JsonCustomerInfo);

            const obj = Array.isArray(valueForm)
              ? valueForm?.reduce((acc: any, item: any) => {
                  return {
                    ...acc,
                    [`${item.ColCodeSys}`]: item.ColValue,
                  };
                }, {})
              : {};

            const listUserMngJson =
              response?.Data?.Lst_Mst_Customer[0]?.CustomerUserManagerJson;

            const listUserMng = JSON.parse(listUserMngJson ?? "[]");

            const result = {
              ...response?.Data?.Lst_Mst_Customer[0],
              ...obj,
              CreateDTimeUTC:
                response?.Data?.Lst_Mst_Customer[0]?.CreateDTimeUTC,
              CustomerCode: response?.Data?.Lst_Mst_Customer[0]?.CustomerCode,
              CustomerName: response?.Data?.Lst_Mst_Customer[0]?.CustomerName,
              ZaloUserFollowerId:
                response?.Data?.Lst_Mst_CustomerZaloUserFollower?.map(
                  (item: any) => {
                    return {
                      ...item,
                      id: nanoid(),
                    };
                  }
                ) ?? [],
              CtmEmail:
                response?.Data?.Lst_Mst_CustomerEmail.map((item: any) => {
                  return {
                    ...item,
                    id: nanoid(),
                  };
                }) ?? [],
              CtmPhoneNo:
                response?.Data?.Lst_Mst_CustomerPhone.map((item: any) => {
                  return {
                    ...item,
                    id: nanoid(),
                  };
                }) ?? [],
              CustomerGrpCode:
                response?.Data?.Lst_Mst_CustomerInCustomerGroup?.map(
                  (item: any) => item?.CustomerGrpCode
                ) ?? [],
              PartnerType:
                response?.Data?.Lst_Mst_CustomerInPartnerType?.map(
                  (item: any) => item?.PartnerType
                ) ?? [],
              UserCodeMng:
                listUserMng?.map((item: any) => item?.UserCodeMng) ?? [],
              GovID: response?.Data?.Lst_Mst_CustomerGovID?.map((item: any) => {
                return {
                  ...item,
                  id: nanoid(),
                };
              }),
            };

            // setFormValue(result);

            return result;
          } else {
            return [];
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
      } else {
        return [];
      }
    },
  });

  useEffect(() => {
    refetchCodeField().then(() =>
      refetchDynamic().then(() =>
        refetchGroupCode().then(() =>
          refetchValueItem().then((result) => {
            setFormValue(result.data);
          })
        )
      )
    );
  }, [param?.CustomerCodeSys]);

  const isLoadingAll = () => {
    return (
      isLoadingCodeField ||
      isLoadingDynamic ||
      isLoadingGroupCode ||
      isLoadingValueItem
    );
  };

  const getFormField = useCallback(() => {
    if (!isLoadingCodeField && !isLoadingGroupCode && !isLoadingValueItem) {
      const listField = getListField({
        listField: listCodeField,
        listDynamic: listDynamic,
        defaultValue: getValueItem,
        customOptions: {
          editType: "detail",
        },
      });

      const listGrp =
        crAuth.networkId == "7341700000"
          ? listGroupCode?.filter(
              (item: any) =>
                item?.ColGrpCodeSys != "COLGRPCODESYS.2023.03" &&
                item?.ColGrpCodeSys != "COLGRPCODESYS.2023.04"
            )
          : listGroupCode;

      const buildDynamicForm = listGrp?.map((groupItem: any) => {
        return {
          colCount: 1,
          labelLocation: "left",
          caption:
            groupItem?.ColGrpName == "Thông tin cơ bản" &&
            crAuth.networkId == "7341700000"
              ? "Thông tin khách hàng"
              : groupItem?.ColGrpName,
          // labelLocation: "left",
          items: [
            {
              itemType: "group",
              colCount: 2,
              items: listField
                ?.filter(
                  (item: any) => item.groupKeys === groupItem.ColGrpCodeSys
                )
                .sort(function (a: any, b: any) {
                  return a.OrderIdx - b.OrderIdx;
                }),
              caption: groupItem.ColGrpName ?? "",
              cssClass: "collapsible form-group",
            },
          ],
        };
      });
      console.log("buildDynamicForm ", buildDynamicForm);

      return buildDynamicForm;
    } else {
      return [];
    }
  }, [
    isLoadingCodeField,
    isLoadingGroupCode,
    listDynamic,
    getValueItem,
    listGroupCode,
    listCodeField,
    formValue,
  ]);

  const handleInitialization = (e: any) => {
    formRef.current = e.component;
  };

  const handleSubmit = () => {};
  return (
    <AdminContentLayout
      className={"Tab_CustomerDetail province-management mt-[10px]"}
      showSeparator={false}
    >
      <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <LoadPanel
          container={".dx-viewport"}
          shadingColor="rgba(0,0,0,0.4)"
          position={"center"}
          visible={isLoadingCodeField || isLoadingGroupCode || isLoadingDynamic}
          showIndicator={true}
          showPane={true}
        />
        {!(
          isLoadingCodeField ||
          isLoadingGroupCode ||
          isLoadingDynamic ||
          isLoadingAll()
        ) && (
          <form ref={ref} className="overflow-auto" onSubmit={handleSubmit}>
            <Form
              className="form-customer-content"
              formData={formValue}
              validationGroup="customerData"
              onInitialized={handleInitialization}
              showValidationSummary={true}
              readOnly
            >
              {getFormField()?.map((item: any) => {
                return (
                  <GroupItem
                    cssClass="px-4"
                    key={nanoid()}
                    render={({}) => {
                      return (
                        <GroupField
                          item={item}
                          formData={formValue}
                          disableCollapsible={item.disableCollapsible}
                        />
                      );
                    }}
                  />
                );
              })}
            </Form>
          </form>
        )}
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Tab_CustomerDetail;
