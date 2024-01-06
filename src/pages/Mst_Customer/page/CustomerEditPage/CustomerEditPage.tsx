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
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import NavNetworkLink from "@/components/Navigate";
import PermissionContainer from "@/components/PermissionContainer";
import { checkEmail } from "@/components/fields/EmailField";
import { checkGovID } from "@/components/fields/GovIDField";
import { GroupField } from "@/components/fields/GroupField";
import { checkPhone } from "@/components/fields/PhoneField";
import { useAuth } from "@/packages/contexts/auth";
import { useNetworkNavigate } from "@/packages/hooks";
import { getListField } from "@/utils/customer-common";
import { match } from "ts-pattern";
import "./components/style.scss";

interface CheckErrorCustomer {
  Email: boolean;
  PhoneNo: boolean;
  Zalo: boolean;
}

const CustomerEditPage = () => {
  const param = useParams();

  const navigate = useNetworkNavigate();

  const { t } = useI18n("Mst_Customer");

  const { t: breadcrumb } = useI18n("Mst_Customer_Breadcrumb");

  const { t: toastTranslate } = useI18n("Mst_Customer_Notify");

  const { t: buttonTranslate } = useI18n("Mst_Customer_Button");

  const { t: fieldTranslate } = useI18n("Mst_Customer_Field");

  const { t: p } = useI18n("Placeholder");

  const api = useClientgateApi();
  const ref = useRef(null);
  const auth = useAtomValue(authAtom);

  const { auth: crAuth } = useAuth();
  const showError = useSetAtom(showErrorAtom);
  const formRef: any = useRef(null);
  const [dynamicFields, setDynamicFields] = useState<any>([]);
  const [formValue, setFormValue] = useState<any>({});

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
      if (dynamicFields && dynamicFields.length > 0) {
        const response = await api.MDMetaColGroupSpec_GetListOption(
          dynamicFields
        );

        if (response.isSuccess) {
          const result = response.DataList?.reduce((result, item) => {
            result[item.ColCodeSys] = item.Lst_MD_OptionValue;
            return result;
          }, {} as { [key: string]: any[] });

          return result;
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

          return {};
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

  const {
    data: getValueItem,
    isLoading: isLoadingValueItem,
    refetch: refetchValueItem,
  } = useQuery({
    queryKey: ["CustomerEditPage_GetValueItem", param],
    queryFn: async () => {
      if (param.CustomerCodeSys) {
        const response: any = await api.Mst_Customer_GetByCustomerCode([
          param.CustomerCodeSys,
        ]);

        if (response.isSuccess) {
          if (response?.Data?.Lst_Mst_Customer) {
            const firstChild = response?.Data?.Lst_Mst_Customer[0];
            const valueForm = JSON.parse(firstChild.JsonCustomerInfo ?? "[]");

            const obj =
              valueForm?.reduce((acc: any, item: any) => {
                return {
                  ...acc,
                  [`${item.ColCodeSys}`]: item.ColValue,
                };
              }, {}) ?? {};

            const listUserMngJson =
              response?.Data?.Lst_Mst_Customer[0]?.CustomerUserManagerJson;

            const listUserMng = JSON.parse(listUserMngJson ?? "[]");

            const result = {
              ...response?.Data?.Lst_Mst_Customer[0],
              ...obj,
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

            return result;
          } else {
            return {};
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
          return {};
        }
      } else {
        return {};
      }
    },
  });

  const { data: getCustomerCodeSysSeq, refetch: refetchSeq } = useQuery(
    ["GetCustomerCodeSysSeq"],
    async () => {
      const resp: any = await api.Seq_GetCustomerCodeSys();

      if (!param?.CustomerCodeSys) {
        setFormValue({ ...formValue, CustomerCode: resp?.Data ?? undefined });
      }

      return resp?.Data;
    }
  );

  useEffect(() => {
    Promise.all([
      refetchCodeField(),
      refetchDynamic(),
      refetchGroupCode(),
      refetchSeq(),
      refetchValueItem(),
    ]).then((res) => {
      setLoading(false);
      if (param?.CustomerCodeSys) {
        setFormValue({ ...res[4].data });
      } else {
        setFormValue({
          ...res[4].data,
          ...param,
          CustomerCodeInvoice: res[3].data,
          CustomerCode: res[3].data,
        });
      }
    });
  }, [param?.CustomerCodeSys]);

  const { t: caption } = useI18n("ColCaption");
  const { t: f } = useI18n("FieldValue");

  const getFormField = useMemo(() => {
    if (!isLoadingCodeField && !isLoadingGroupCode && !isLoadingValueItem) {
      const listField = getListField({
        listField: listCodeField,
        listDynamic: listDynamic ?? [],
        defaultValue: getValueItem ?? {},
        customOptions: {
          editType: !param?.CustomerCodeSys ? "add" : "update",
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
                })
                ?.map((item: any) => {
                  return {
                    ...item,
                    editorOptions: {
                      ...item.editorOptions,
                      placeholder: p(item?.editorOptions?.placeholder),
                    },
                    label: {
                      text: caption(item?.label?.text),
                    },
                  };
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
    getValueItem,
    listGroupCode,
    listCodeField,
    param,
  ]);

  function removeDuplicates(array: any) {
    // Use a Set to store unique values
    const uniqueValues: any = new Set(array);

    // Convert the Set back to an array
    const uniqueArray = [...uniqueValues];

    return uniqueArray;
  }

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

  const handleUpdate = async () => {
    if (!isValidFormValue()) {
      return;
    }

    if (formRef.current.validate().isValid) {
      const dynamicField = listCodeField
        ?.filter((item: any) => item.FlagIsColDynamic === "1")
        .map((item: any) => item.ColCodeSys);
      const staticField: any = listCodeField
        ?.filter((item: any) => item.FlagIsColDynamic !== "1")
        .map((item: any) => item.ColCodeSys);

      const getStaticValue = staticField
        ?.filter(
          (item: any) =>
            item != "CustomerGrpCode" &&
            item != "mpt_PartnerTypeName" &&
            item != "PartnerType"
        )
        ?.reduce((acc: any, item: any) => {
          return {
            ...acc,
            [item]: formValue[item],
          };
        }, {});

      const getDynamicValue: any = dynamicField
        ?.map((item) => {
          if (formValue[item]) {
            return {
              ColCodeSys: item,
              ColValue: formValue[item] ?? null,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item);

      const value: any = [
        ...staticField?.filter(
          (item: any) =>
            item != "mpt_PartnerTypeName" && item != "CreateDTimeUTC"
        ),
        ...getDynamicValue?.map((item: any) => {
          return item.ColCodeSys;
        }),
      ];

      const curParam = {
        ...getStaticValue,
        OrgID: auth.orgId,
        NetworkID: auth.networkId,
        JsonCustomerInfo: getDynamicValue?.length
          ? JSON.stringify(getDynamicValue)
          : null,
      };

      const objParam = {
        OrgID: auth.orgId,
        NetworkID: auth.networkId,
        CustomerCodeSys: param.CustomerCodeSys,
        CustomerCode: formValue["CustomerCode"],
        CustomerName: formValue["CustomerName"],
        CustomerAvatarName: formValue["CustomerAvatarName"] ?? null,
        CustomerAvatarPath: formValue["CustomerAvatarPath"] ?? null,
        CustomerNameEN: formValue["CustomerNameEN"] ?? null,
        ...curParam,
      };

      const zaloList =
        formValue["ZaloUserFollowerId"].map((item: any) => {
          return {
            ...item,
            OrgID: auth.orgId,
            CustomerCodeSys: param.CustomerCodeSys,
          };
        }) ?? [];
      const emailList =
        formValue["CtmEmail"].map((item: any) => {
          return {
            ...item,
            OrgID: auth.orgId,
            CustomerCodeSys: param.CustomerCodeSys,
          };
        }) ?? [];
      const phoneList =
        formValue["CtmPhoneNo"].map((item: any) => {
          return {
            ...item,
            OrgID: auth.orgId,
            CustomerCodeSys: param.CustomerCodeSys,
          };
        }) ?? [];

      const customerGroup =
        formValue["CustomerGrpCode"]?.map((item: any) => {
          return {
            OrgID: auth.orgId,
            CustomerCodeSys: param.CustomerCodeSys,
            CustomerGrpCode: item,
          };
        }) ?? [];

      const partnerType =
        formValue["PartnerType"]?.map((item: any) => {
          return {
            OrgID: auth.orgId,
            PartnerType: item,
            CustomerCodeSys: param?.CustomerCodeSys,
          };
        }) ?? [];

      const listUserManager =
        formValue["UserCodeMng"]?.map((item: any) => {
          return {
            OrgID: auth.orgId,
            UserCodeMng: item,
            CustomerCodeSys: param?.CustomerCodeSys,
          };
        }) ?? [];

      const listGovID =
        formValue["GovID"]?.map((item: any) => {
          return {
            GovID: item?.GovID,
            GovIDType: item?.GovIDType,
            OrgID: auth.orgId,
            CustomerCodeSys: param?.CustomerCodeSys,
          };
        }) ?? [];

      const putParam = {
        strJson: JSON.stringify(objParam),
        ColsUpd: removeDuplicates(value)?.join(",") ?? [],
        strJsonZaloUserFollower: JSON.stringify(zaloList),
        strJsonEmail: JSON.stringify(emailList),
        strJsonPhone: JSON.stringify(phoneList),
        strJsonCtmGroup: JSON.stringify(customerGroup),
        strJsonCtmPartnerType: JSON.stringify(partnerType),
        strJsonUserManager: JSON.stringify(listUserManager),
        strJsonGovID: JSON.stringify(listGovID),
        ScrTplCodeSys: "SCRTPLCODESYS.2023",
      };

      const response = await api.Mst_Customer_Update(putParam);

      if (response.isSuccess) {
        toast.success(toastTranslate("Update successfully!"), {
          onClose: handleCancel,
          delay: 500,
        });
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

  const handleAdd = async ({ handleSuccess }: any) => {
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
            item != "CustomerGrpCode" &&
            item != "mpt_PartnerTypeName" &&
            item != "PartnerType"
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
              item != "CtmPhoneNo" ||
              item != "PartnerType")
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
      console.log("response ", response);
      if (response.isSuccess) {
        handleSuccess();
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

  const onSuccessCreate = () => {
    toast.success(toastTranslate("Create successfully!"), {
      onClose: handleCancel,
      delay: 500,
    });
  };

  const onSuccessCreateAndSave = async () => {
    toast.success(toastTranslate("Create successfully!"), {
      onClose: () => {
        setFormValue({});
        navigate(`/customer/add`);
      },
      delay: 100,
    });
  };

  const handleInitialization = (e: any) => {
    formRef.current = e.component;
  };

  const handleSubmit = () => {};

  const handleCancel = () => {
    navigate(`/customer/list`);
  };

  const handleDelete = async () => {
    const deleteConfirm = confirm(
      `Bạn có muốn xóa khách hàng ${param?.CustomerCodeSys} không?`
    );

    if (deleteConfirm) {
      const response = await api.Mst_Customer_Delete({
        OrgID: auth?.orgData?.Id,
        CustomerCodeSys: param?.CustomerCodeSys,
        NetworkID: auth?.networkId,
      });
      if (response.isSuccess) {
        toast.success(toastTranslate("Delete successfully!"), {
          onClose: handleDelete,
        });
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

  const { t: common } = useI18n("Common");

  return (
    <AdminContentLayout className={"province-management"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header flex justify-between items-center w-full px-2 py-2">
          <div className="breakcrumb flex gap-1">
            {param?.nav ? (
              <NavNetworkLink
                to={`/customer/detail/${param?.CustomerCodeSys}`}
                className="text-black"
              >
                {breadcrumb("Detail Customer")}
              </NavNetworkLink>
            ) : (
              <NavNetworkLink to="/customer" className="text-black">
                {breadcrumb("List Customer")}
              </NavNetworkLink>
            )}

            <p>{`>`}</p>
            {param?.type == "add" ? (
              <p> {breadcrumb("Add customer")}</p>
            ) : (
              <p>{breadcrumb("Update customer")}</p>
            )}
          </div>
          <div className="flex gap-2">
            {param?.type == "edit" ? (
              <PermissionContainer permission={"BTN_CUSTOMER_EDITCUSTOM_SAVE"}>
                <Button
                  onClick={handleUpdate}
                  style={{
                    background: "#00703C",
                    color: "white",
                    padding: "10px 20px",
                  }}
                >
                  {common("Save")}
                </Button>
              </PermissionContainer>
            ) : (
              <div className="flex gap-2">
                <PermissionContainer
                  permission={"BTN_CUSTOMER_CREATECUSTOM_SAVE"}
                >
                  <Button
                    onClick={() =>
                      handleAdd({
                        handleSuccess: onSuccessCreate,
                      })
                    }
                    style={{
                      background: "#00703C",
                      color: "white",
                      padding: "10px 20px",
                    }}
                  >
                    {buttonTranslate("Save")}
                  </Button>
                </PermissionContainer>
                <PermissionContainer
                  permission={"BTN_CUSTOMER_CREATECUSTOM_SAVEANDCREATE"}
                >
                  <Button
                    onClick={() =>
                      handleAdd({
                        handleSuccess: onSuccessCreateAndSave,
                      })
                    }
                    style={{
                      background: "#00703C",
                      color: "white",
                      padding: "10px 20px",
                    }}
                  >
                    {buttonTranslate("Save and create")}
                  </Button>
                </PermissionContainer>
              </div>
            )}

            {param?.type == "add" && (
              <PermissionContainer
                permission={"BTN_CUSTOMER_CREATECUSTOM_CANCEL"}
              >
                <Button
                  onClick={handleCancel}
                  style={{
                    padding: "10px 20px",
                  }}
                >
                  {buttonTranslate("Cancel")}
                </Button>
              </PermissionContainer>
            )}

            {param?.type == "edit" && (
              <PermissionContainer
                permission={"BTN_CUSTOMER_EDITCUSTOM_CANCEL"}
              >
                <Button
                  onClick={handleCancel}
                  style={{
                    padding: "10px 20px",
                  }}
                >
                  {buttonTranslate("Cancel")}
                </Button>
              </PermissionContainer>
            )}
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
          <form ref={ref} className="overflow-auto" onSubmit={handleSubmit}>
            <Form
              className="form-customer-content"
              formData={formValue}
              validationGroup="customerData"
              onInitialized={handleInitialization}
              showValidationSummary={true}
              showRequiredMark={true}
            >
              {getFormField?.map((item: any) => {
                return (
                  <GroupItem
                    cssClass="px-4 mt-2"
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

export default CustomerEditPage;
