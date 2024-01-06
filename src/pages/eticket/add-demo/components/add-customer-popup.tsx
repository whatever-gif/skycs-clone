import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { authAtom, showErrorAtom } from "@/packages/store";
import { MdMetaColGroupSpec } from "@/packages/types";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, LoadPanel } from "devextreme-react";
import { GroupItem } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import PermissionContainer from "@/components/PermissionContainer";
import { checkEmail } from "@/components/fields/EmailField";
import { GroupField } from "@/components/fields/GroupField";
import { checkPhone } from "@/components/fields/PhoneField";
import { useNetworkNavigate } from "@/packages/hooks";
import { getListField } from "@/utils/customer-common";

import { checkGovID } from "@/components/fields/GovIDField";
import { useAuth } from "@/packages/contexts/auth";
import { match } from "ts-pattern";
import "./custom.scss";

const AddCustomerPopup = ({ setValue, close }: any) => {
  const navigate = useNetworkNavigate();

  const { t } = useI18n("Mst_Customer");

  const { t: breadcrumb } = useI18n("Mst_Customer_Breadcrumb");

  const { t: toastTranslate } = useI18n("Mst_Customer_Notify");

  const { t: buttonTranslate } = useI18n("Mst_Customer_Button");

  const { t: common } = useI18n("Common");

  const api = useClientgateApi();
  const ref = useRef(null);
  const auth = useAtomValue(authAtom);
  const showError = useSetAtom(showErrorAtom);
  const formRef: any = useRef(null);
  const [dynamicFields, setDynamicFields] = useState<any>([]);
  const [formValue, setFormValue] = useState<any>({});
  const { auth: crAuth } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);

  const {
    data: listCodeField,
    isLoading: isLoadingCodeField,
    refetch: refetchCodeField,
  } = useQuery({
    queryKey: ["CustomerEditPage_ListCodeField"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupSpec_Search({});
      if (response.isSuccess) {
        if (response?.DataList) {
          const listDynamicFields: any[] = response?.DataList.filter(
            (item: MdMetaColGroupSpec) =>
              (item?.ColDataType === "MASTERDATA" ||
                item?.ColDataType === "MASTERDATASELECTMULTIPLE") &&
              item?.FlagActive == "1"
          ).map((item: MdMetaColGroupSpec) => item?.ColCodeSys);

          if (listDynamicFields.length) {
            setDynamicFields(listDynamicFields);
          }
        }

        const list = response.DataList?.filter(
          (item: any) => item.FlagActive
        ).map((item: any) => {
          return match(item?.ColCaption)
            .with("Ngày sinh", () => {
              return {
                ...item,
                ColDataType: "BIRTHDAY",
              };
            })
            .with("Điều khoản mua hàng", () => {
              return {
                ...item,
                ColDataType: "PURCHASE",
              };
            })
            .with("Điều khoản bán hàng", () => {
              return {
                ...item,
                ColDataType: "SALE",
              };
            })
            .otherwise(() => item);
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
    queryKey: ["CustomerEditPage_ListDynamic", dynamicFields],
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
    queryKey: ["CustomerEditPage_ListGroupCode"],
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

  const { data: getCustomerCodeSysSeq, refetch: refetchSeq } = useQuery(
    ["GetCustomerCodeSysSeq"],
    async () => {
      const resp: any = await api.Seq_GetCustomerCodeSys();

      // setFormValue({ ...formValue, CustomerCode: resp?.Data ?? undefined });

      return resp?.Data;
    }
  );

  useEffect(() => {
    Promise.all([
      refetchCodeField(),
      refetchDynamic(),
      refetchGroupCode(),
      refetchSeq(),
    ]).then((res) => {
      setLoading(false);
      setFormValue({
        CustomerCodeInvoice: res[3].data,
        CustomerCode: res[3].data,
      });
    });
  }, []);

  const { t: f } = useI18n("FieldValue");

  const getFormField = useMemo(() => {
    if (!isLoadingCodeField && !isLoadingGroupCode) {
      const listField = getListField({
        listField: listCodeField,
        listDynamic: listDynamic ?? [],
        defaultValue: {},
        customOptions: {
          editType: "add",
        },
        translate: f,
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
      return buildDynamicForm;
    } else {
      return [];
    }
  }, [
    isLoadingCodeField,
    isLoadingGroupCode,
    listDynamic,
    listGroupCode,
    listCodeField,
  ]);

  const isValidFormValue = () => {
    if (!formValue["PartnerType"] || formValue["PartnerType"]?.length == 0) {
      toast.error(toastTranslate("Please enter all fields!"));
      return false;
    }

    const phone = listCodeField?.find(
      (item: any) => item?.ColCodeSys == "CtmPhoneNo"
    );

    if (!checkPhone(formValue["CtmPhoneNo"]) && phone?.FlagIsNotNull == "1") {
      toast.error(toastTranslate("Please check your phone number again!"));
      return false;
    }

    if (!checkEmail(formValue["CtmEmail"])) {
      toast.error(toastTranslate("Please check your email again!"));
      return false;
    }

    const govid = listCodeField?.find(
      (item: any) => item?.ColCodeSys == "GovID"
    );

    if (!checkGovID(formValue["GovID"]) && govid?.FlagIsNotNull == "1") {
      toast.error(toastTranslate("Please check your GovID again!"));
      return false;
    }

    const birthdayField = listCodeField?.find(
      (item: any) => item?.ColCaption == "Ngày sinh"
    );

    if (birthdayField?.FlagIsNotNull == "1") {
      if (!formValue[birthdayField?.ColCodeSys]) {
        toast.error(toastTranslate("Please enter all fields!"));
        return false;
      }
    }

    return true;
  };

  const handleAdd = async () => {
    if (!isValidFormValue()) {
      return;
    }

    if (formRef.current.validate().isValid) {
      const dynamicField = listCodeField
        ?.filter((item: any) => item.FlagIsColDynamic === "1")
        .map((item: any) => item.ColCodeSys);
      const staticField = listCodeField
        ?.filter((item: any) => item.FlagIsColDynamic !== "1")
        .map((item: any) => item.ColCodeSys);

      const getStaticValue = staticField
        ?.filter(
          (item: any) =>
            item != "CustomerGrpCode" && item != "mpt_PartnerTypeName"
        )
        ?.reduce((acc: any, item: any) => {
          return {
            ...acc,
            [item]: formValue[item],
          };
        }, {});

      const getDynamicValue: any = dynamicField
        ?.map((item: any) => {
          if (
            formValue[item] &&
            (item != "ZaloUserFollowerId" ||
              item != "CtmEmail" ||
              item != "CtmPhoneNo")
          ) {
            return {
              ColCodeSys: item,
              ColValue: formValue[item] ?? null,
            };
          } else {
            return null;
          }
        })
        .filter((item: any) => item);

      const param = {
        ...getStaticValue,
        OrgID: auth.orgId,
        NetworkID: auth.networkId,
        JsonCustomerInfo: getDynamicValue?.length
          ? JSON.stringify(getDynamicValue)
          : null,
      };

      const customerGroup =
        formValue["CustomerGrpCode"]?.map((item: any) => {
          return {
            OrgID: auth.orgId,
            CustomerGrpCode: item,
          };
        }) ?? [];

      const partnerType =
        formValue["PartnerType"]?.map((item: any) => {
          return {
            OrgID: auth.orgId,
            PartnerType: item,
          };
        }) ?? [];

      const listUserManager =
        formValue["UserCodeMng"]?.map((item: any) => {
          return {
            OrgID: auth.orgId,
            UserCodeMng: item,
          };
        }) ?? [];

      const listGovID = formValue["GovID"]?.map((item: any) => {
        return {
          OrgID: auth.orgId,
          GovIDType: item?.GovIDType,
          GovID: item?.GovID,
        };
      });

      const postParam = {
        strJson: JSON.stringify(param),
        strJsonZaloUserFollower: JSON.stringify(
          formValue["ZaloUserFollowerId"] ?? []
        ),
        strJsonEmail: JSON.stringify(formValue["CtmEmail"] ?? []),
        strJsonPhone: JSON.stringify(formValue["CtmPhoneNo"] ?? []),
        strJsonCtmGroup: JSON.stringify(customerGroup ?? []),
        strJsonCtmPartnerType: JSON.stringify(partnerType),
        strJsonUserManager: JSON.stringify(listUserManager),
        strJsonGovID: JSON.stringify(listGovID),
        ScrTplCodeSys: "SCRTPLCODESYS.2023",
      };

      const response = await api.Mst_Customer_Create(postParam);
      if (response.isSuccess) {
        toast.success(common("Create successfully!"));

        const getThisCustomer: any = await api.Mst_Customer_Search({
          Keyword: formValue["CustomerCode"],
          FlagActive: 1,
          Ft_PageIndex: 0,
          Ft_PageSize: 100,
        });

        const result: any = getThisCustomer?.DataList?.[0] ?? undefined;

        if (result) {
          setValue("Customer", result);
        }

        close();
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
      toast.error(toastTranslate("Please enter all fields!"));
    }
  };

  const handleInitialization = (e: any) => {
    formRef.current = e.component;
  };

  const handleSubmit = () => {};

  const handleCancel = () => {
    navigate(`/customer/list`);
  };

  return (
    <AdminContentLayout className={""}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header flex justify-between items-center w-full px-2 py-2">
          <div className="breakcrumb flex gap-1"></div>
          <div className="flex gap-2">
            <PermissionContainer permission={"BTN_CUSTOMER_CREATECUSTOM_SAVE"}>
              <Button
                onClick={handleAdd}
                style={{
                  background: "#00703C",
                  color: "white",
                  padding: "10px 20px",
                }}
              >
                {buttonTranslate("Save")}
              </Button>
            </PermissionContainer>
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <LoadPanel
          container={".dx-viewport"}
          shadingColor="rgba(0,0,0,0.4)"
          position={"center"}
          visible={
            isLoadingCodeField ||
            isLoadingGroupCode ||
            isLoadingDynamic ||
            loading
          }
          showIndicator={true}
          showPane={true}
        />
        {!(isLoadingCodeField || isLoadingGroupCode || isLoadingDynamic) && (
          <form
            ref={ref}
            className="overflow-auto mt-[10px]"
            onSubmit={handleSubmit}
          >
            <Form
              className="form-test"
              formData={formValue}
              validationGroup="customerData"
              onInitialized={handleInitialization}
              showValidationSummary={true}
            >
              {getFormField?.map((item: any) => {
                return (
                  <GroupItem
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

export default AddCustomerPopup;
