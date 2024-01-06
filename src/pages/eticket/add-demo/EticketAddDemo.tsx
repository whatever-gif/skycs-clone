import NavNetworkLink from "@/components/Navigate";
import PermissionContainer from "@/components/PermissionContainer";
import { defaultAvatar } from "@/components/fields/AvatarField";
import { encodeFileType, revertEncodeFileType } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useNetworkNavigate } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { DateField } from "@/pages/admin/custom-field/components/date-field";
import { HtmlEditorField } from "@/pages/admin/custom-field/components/htmleditor-field";
import { SelectboxField } from "@/pages/admin/custom-field/components/selectbox-field";
import { TagBoxField } from "@/pages/admin/custom-field/components/tagbox-field";
import { TextboxField } from "@/pages/admin/custom-field/components/textbox-field";
import { UploadFileField } from "@/pages/admin/custom-field/components/uploadfile-field";
import CloseIcon from "@/pages/service/report/RptCallAnalysisByWaitTime/components/CloseIcon";
import { getFullTime } from "@/utils/time";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button, LoadPanel, Popup } from "devextreme-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import AddCustomerPopup from "./components/add-customer-popup";
import AutocompleteCustomer from "./components/autocomplete-customer";
import "./components/custom.scss";
import { customerPopup, detailPopupAtom } from "./components/customer-popup";
import DetailCustomerPopup from "./components/detail-customer-popup";
import DynamicFormEticket from "./components/dynamic-form";
import { listColor } from "./components/list-color";

const EticketAddDemo = () => {
  const formRef: any = useRef();

  const methods = useForm();

  const navigate = useNetworkNavigate();

  const { TicketID, type } = useParams();

  const showError = useSetAtom(showErrorAtom);

  const { t: breadcrumb } = useI18n("Eticket_BreadCrumb");

  const { auth } = useAuth();

  const refSubmitButton = useRef<HTMLButtonElement>(null);

  const { t: validateMessage } = useI18n("Validate");

  const customerPopupValue = useAtomValue(customerPopup);
  const setCustomerPopup = useSetAtom(customerPopup);

  const [detailPopup, setDetailPopup] = useAtom(detailPopupAtom);

  const handleClose = () => {
    setCustomerPopup(false);
  };

  const api = useClientgateApi();

  const { data: defaultDepartment, refetch: refetchDep } = useQuery(
    ["defaultDepartment"],
    async () => {
      const resp: any = await api.Mst_DepartmentControl_GetByUserCode();

      if (
        resp?.isSuccess &&
        resp?.Data?.Sys_UserMapDepartment?.DepartmentCode
      ) {
        setValue(
          "DepartmentCode",
          resp?.Data?.Sys_UserMapDepartment?.DepartmentCode
        );
        setValue("AgentCode", resp?.Data?.Sys_UserMapDepartment?.UserCode);
      }

      return resp?.Data?.Sys_UserMapDepartment?.DepartmentCode ?? "";
    }
  );

  const { data: listField } = useQuery(["listETField"], async () => {
    const resp: any = await api.Mst_TicketColumnConfig_GetAllActive();

    const result = resp?.Data?.Lst_Mst_TicketColumnConfig;

    const listMasterData =
      result?.filter(
        (item: any) =>
          item?.TicketColCfgDataType == "MASTERDATA" ||
          item?.TicketColCfgDataType == "MASTERDATASELECTMULTIPLE"
      ) ?? [];

    const getMasterData: any = await api.Mst_TicketColumnConfig_GetListOption(
      listMasterData?.map((item: any) => item?.TicketColCfgCodeSys),
      auth?.orgData?.Id ?? ""
    );

    const listGetMasterData =
      getMasterData?.Data?.Lst_Mst_TicketColumnConfig ?? [];

    const newResult = result.map((item: any) => {
      const find = listGetMasterData?.find(
        (c: any) => c?.TicketColCfgCodeSys == item?.TicketColCfgCodeSys
      );

      const parsedList = JSON.parse(item?.JsonListOption ?? "[]");

      return {
        ...item,
        DataSource: find
          ? find?.Lst_MD_OptionValue
            ? find?.Lst_MD_OptionValue
            : []
          : parsedList,
      };
    });

    return newResult ?? [];
  });

  const { data: tagList } = useQuery(["tagList", listColor], async () => {
    const resp: any = await api.Mst_Tag_GetAllActive();

    const result = resp?.Data?.Lst_Mst_Tag ?? [];

    let count = 0;

    return result?.map((item: any) => {
      if (count == listColor.length - 1) {
        count = 0;
      } else {
        count++;
      }

      return {
        ...item,
        color: listColor[count],
      };
    });
  });

  const {
    register,
    reset,
    unregister,
    watch,
    control,
    setValue,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      TicketStatus: "OPEN",
      OrgID: auth?.orgData?.Id.toString(),
      TicketPriority: "NORMAL",
      TicketCustomers: [],
      TicketDetail: "",
      TicketFollowers: [auth?.currentUser?.Email?.toUpperCase()],
      isLoading: false,
      dynamic: [],
    },
  });

  const { t: common } = useI18n("Common");
  const { t } = useI18n("Ticket_Add");
  const { t: placeholder } = useI18n("Placeholder");

  const triggerSubmit = () => {
    refSubmitButton?.current?.click();
  };

  function convertUnderscoresToDots(obj: any) {
    const convertedObj: any = {};

    for (let key in obj) {
      const convertedKey = key.replace(/\_/g, ".");
      convertedObj[convertedKey] = obj[key];
    }

    return convertedObj;
  }

  function convertDotsToUnderscores(obj: any) {
    const convertedObj: any = {};
    for (let key in obj) {
      const convertedKey = key.replace(/\./g, "_");
      convertedObj[convertedKey] = obj[key];
    }

    return convertedObj;
  }

  const handleSaveClick = () => {
    triggerSubmit();
  };

  const { data: MstTicketEstablishInfo } = useQuery(
    ["MstTicketEstablishInfoType"],
    api.Mst_TicketEstablishInfoApi_GetAllInfo
  );

  const { data: nntList }: any = useQuery(["nntList"], async () => {
    const resp: any = await api.Mst_NNTController_GetMSTForETicket();

    const result = resp?.Data?.filter((item: any) => item?.FlagActive == "1");

    return result;
  });

  const { data: followList } = useQuery(["followList"], async () => {
    const resp: any = await api.Sys_User_GetAllActive();

    const data = resp?.DataList?.map((item: any) => {
      return {
        ...item,
        UserCode: item?.UserCode?.toUpperCase(),
      };
    });

    return data;
  });

  const watchOrgID = watch("OrgID");
  const watchDep = watch("DepartmentCode");

  const watchTicketCustomType = watch("TicketCustomType");
  const watchTicketType = watch("TicketType");
  const watchContactChannel = watch("ContactChannel");

  const { data: agentList, refetch: refetchAgentList } = useQuery(
    ["agentList", watchDep],
    async () => {
      const resp: any = await api.Mst_DepartmentControl_GetByDepartmentCode(
        watchDep,
        watchOrgID
      );

      const listAgent = resp?.Data?.Lst_Sys_UserMapDepartment ?? [];

      const find = listAgent?.find(
        (c: any) => c?.UserCode == auth?.currentUser?.Email?.toUpperCase()
      );

      return resp?.Data?.Lst_Sys_UserMapDepartment ?? [];
    }
  );

  const { data: listDepartment, refetch: refetchListDep } = useQuery(
    ["listDep", watchOrgID],
    async () => {
      const resp: any = await api.Mst_DepartmentControl_GetByOrgID(watchOrgID);

      if (resp?.isSuccess && resp?.Data && resp?.Data?.Lst_Mst_Department) {
        const result = resp?.Data?.Lst_Mst_Department ?? [];

        return result?.filter((item: any) => item?.FlagActive == "1");
      } else {
        return [];
      }
    },
    {
      enabled: false,
    }
  );

  const {
    data: getFormValue,
    isLoading,
    refetch,
  } = useQuery(["ticketUpdate", TicketID], async () => {
    if (TicketID && auth?.orgData?.Id) {
      const resp: any = await api.ET_Ticket_GetByTicketID({
        TicketID: TicketID,
        OrgID: auth?.orgData?.Id,
      });

      if (resp?.Data?.Lst_ET_Ticket && resp?.Data?.Lst_ET_Ticket[0]) {
        const data = resp?.Data?.Lst_ET_Ticket[0];

        const listFile = resp?.Data?.Lst_ET_TicketAttachFile;
        const listFollowers = resp?.Data?.Lst_ET_TicketFollower;
        const tags = data?.Tags?.split(",");

        const TicketJsonInfo = JSON.parse(data?.TicketJsonInfo ?? "[]");

        if (Array.isArray(TicketJsonInfo)) {
          const TicketJsonInfoParsed = TicketJsonInfo?.filter(
            (item: any) => Object.keys(item)?.[0] != undefined
          )?.map((item: any) => {
            const key = Object.keys(item)?.[0];
            const value = Object.values(item)?.[0];

            return { [String(key).replace(/\./g, "_")]: value };
          });

          const dynamic: any = {};

          for (const obj of TicketJsonInfoParsed) {
            const key = Object.keys(obj)[0];
            dynamic[key] = obj[key];
          }

          setValue("dynamic", dynamic);
        } else {
          setValue("dynamic", TicketJsonInfo);
        }

        // ticket deadline init
        if (data?.SLAID && !data?.TicketDeadline) {
          const getTicketDeadline: any = await api.Mst_SLA_GetBySLAID(
            data?.SLAID
          );

          if (getTicketDeadline?.isSuccess) {
            const currentTime = new Date();

            const SLATime = getTicketDeadline?.Data?.Mst_SLA?.ResolutionTime;

            currentTime.setMilliseconds(
              currentTime.getMilliseconds() + SLATime * 1000
            );

            setValue("TicketDeadline", currentTime);
          }
        } else {
          setValue("TicketDeadline", data?.TicketDeadline);
        }

        // const tags = tagList?.map((item: any) => item.TagName);
        setValue("Customer", resp?.Data?.Lst_ET_TicketCustomer?.[0]);
        setValue("TicketStatus", data?.TicketStatus);
        setValue("CustomerCodeSys", data?.CustomerCodeSys);
        setValue("CustomerCode", data?.CustomerCode);
        setValue("TicketName", data?.TicketName);
        setValue("TicketDetail", data?.TicketDetail);
        setValue("OrgID", data?.OrgID);
        setValue("DepartmentCode", data?.DepartmentCode);
        setValue("AgentCode", data?.AgentCode);
        setValue("TicketType", data?.TicketType);
        setValue("TicketPriority", data?.TicketPriority);
        setValue("TicketCustomType", data?.TicketCustomType);
        setValue("TicketSource", data?.TicketSource);
        setValue("ReceptionChannel", data?.ReceptionChannel);
        setValue("ContactChannel", data?.ContactChannel);
        setValue("Tags", tags);
        setValue("SLAID", data?.SLAID);
        setValue("SLALevel", data?.SLALevel);
        setValue("RemindWork", data?.RemindWork);
        setValue("RemindDTimeUTC", data?.RemindDTimeUTC);
        setValue("TicketCustomers", resp?.Data?.Lst_ET_TicketCustomer);

        setValue(
          "TicketAttachFile",
          listFile?.map((item: any, index: number) => {
            return {
              ...item,
              FileId: nanoid(),
              Idx: index + 1,
              FileFullName: item?.FileName,
              FileType: encodeFileType(item?.FileType),
            };
          }) ?? []
        );

        setValue(
          "TicketFollowers",
          listFollowers?.map((item: any) => {
            return item?.AgentCode?.toUpperCase();
          }) ?? []
        );

        // setDynamicForm(convertDotsToUnderscores(listDynamic));
      } else {
        setValue("AgentCode", auth?.currentUser?.Email?.toUpperCase());
      }

      return resp;
    }
  });

  console.log(watch("TicketDeadline"));

  useEffect(() => {
    if (TicketID) {
      refetch().then(() => refetchListDep());
    } else {
      refetchListDep().then(() => refetchDep());
    }
  }, [TicketID]);

  useEffect(() => {
    refetchListDep();

    if (!watchOrgID) {
      setValue("DepartmentCode", null);
      setValue("AgentCode", null);
    }
  }, [watchOrgID]);

  useEffect(() => {
    if (!watch("DepartmentCode")) {
      setValue("AgentCode", null);
    }
  }, [watch("DepartmentCode")]);

  const handleCancel = () => {
    navigate("/eticket/eticket_manager");
  };

  function convertDotToUnderscore(str: string) {
    return str.replace(/\./g, "_");
  }

  const onSubmit = async (data: any) => {
    const listDynamic = Object.entries(data?.dynamic)?.map(
      ([key, value]: any) => {
        const find = listField?.find(
          (c: any) =>
            convertDotToUnderscore(String(c?.TicketColCfgCodeSys)) == key
        );

        if (find) {
          return match(find?.TicketColCfgDataType)
            .with("DATE", () => {
              if (!value) {
                return { [key]: value };
              }

              const result = format(new Date(value), "yyyy-MM-dd").toString();

              return { [key]: result };
            })
            .with("DATETIME", () => {
              if (!value) {
                return { [key]: value };
              }

              const result = format(
                new Date(value),
                "yyyy-MM-dd HH:mm:ss"
              ).toString();

              return { [key]: result };
            })
            .otherwise(() => {
              return { [key]: value };
            });
        }
      }
    );

    const resultDynamic = listDynamic
      ?.filter((c: any) => c)
      ?.map((item: any) => {
        const key: any = Object.keys(item)?.[0];

        const value: any = Object.values(item)?.[0];

        return { [String(key).replace(/\_/g, ".")]: value };
      });

    const deadLine = data.TicketDeadline && getFullTime(data.TicketDeadline);
    const remindTime = data.RemindDTimeUTC && getFullTime(data.RemindDTimeUTC);

    const ET_Ticket = {
      TicketID: TicketID,
      TicketStatus: data.TicketStatus,
      OrgID: data.OrgID,
      CustomerCodeSys: data.Customer.CustomerCodeSys,
      TicketName: data.TicketName,
      TicketDetail: data.TicketDetail ?? "",
      AgentCode: data.AgentCode,
      DepartmentCode: data.DepartmentCode,
      TicketType: data.TicketType,
      TicketDeadline: deadLine != "" ? deadLine : null,
      TicketPriority: data.TicketPriority,
      TicketJsonInfo: JSON.stringify(resultDynamic ?? []),
      TicketCustomType: data.TicketCustomType ?? null,
      TicketSource: data.TicketSource ?? null,
      ReceptionChannel: data.ReceptionChannel ?? null,
      ContactChannel: data.ContactChannel ?? null,
      Tags: data.Tags?.join(",") ?? "",
      SLAID: data?.SLAID,
      RemindWork: data.RemindWork ?? "",
      RemindDTimeUTC: remindTime != "" ? remindTime : null,
    };

    const Lst_ET_TicketAttachFile =
      data.TicketAttachFile?.map((item: any, index: number) => {
        return {
          Idx: index + 1,
          FileId: nanoid(),
          FileName: item?.FileFullName,
          FileType: revertEncodeFileType(item?.FileType),
          FilePath: item?.FilePath ?? item?.FileUrlFS,
          FileSize: item?.FileSize ?? "",
        };
      }) ?? [];

    const Lst_ET_TicketFollower =
      data.TicketFollowers?.map((item: any) => {
        return {
          AgentCode: item,
          FollowType: "",
        };
      }) ?? [];

    const Lst_ET_TicketCustomer = data?.TicketCustomers ?? [];

    const param = TicketID
      ? {
          ET_Ticket,
          Lst_ET_TicketAttachFile,
          Lst_ET_TicketFollower,
          Lst_ET_TicketCustomer,
        }
      : {
          ET_Ticket,
          Lst_ET_TicketAttachFile,
          Lst_ET_TicketFollower,
        };

    setValue("isLoading", true);

    if (TicketID) {
      const resp: any = await api.ETTicket_Update(param);

      if (resp?.isSuccess) {
        setValue("isLoading", false);
        toast.success(common("Update successfully!"));

        handleCancel();
      } else {
        setValue("isLoading", false);

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
      const resp: any = await api.ETTicket_Create(param);

      if (resp?.isSuccess) {
        setValue("isLoading", false);

        toast.success(common("Create successfully!"));
        handleCancel();
      } else {
        setValue("isLoading", false);

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

  const handleInitContactChannel = (e: any) => {
    if (!watchContactChannel) {
      const find = MstTicketEstablishInfo?.Data?.Lst_Mst_ContactChannel?.find(
        (item: any) =>
          String(item?.AgentContactChannelName).toUpperCase() == e.value
      );

      setValue("ContactChannel", find?.ContactChannel);
    }
  };

  const getSLA = async () => {
    const resp: any = await api.Mst_SLA_GetSLADefault({
      OrgID: auth.orgData?.Id,
      CustomerCodeSys: watch("Customer")?.CustomerCodeSys,
      TicketCustomType: watchTicketCustomType,
      TicketType: watchTicketType,
    });

    if (resp?.isSuccess && resp?.Data?.Mst_SLA?.SLAID) {
      setValue("SLAID", resp?.Data?.Mst_SLA?.SLAID);
      setValue("SLALevel", resp?.Data?.Mst_SLA?.SLALevel);

      const currentTime = new Date();

      const SLATime = resp?.Data?.Mst_SLA?.ResolutionTime;

      currentTime.setMilliseconds(
        currentTime.getMilliseconds() + SLATime * 1000
      );

      setValue("TicketDeadline", currentTime);
      return resp?.Data?.Mst_SLA?.SLAID;
    } else {
      setValue("SLAID", null);
      setValue("SLALevel", null);
      return null;
    }
  };

  useEffect(() => {
    if (watch("Customer") && watch("TicketType") && watch("TicketCustomType")) {
      getSLA();
    }
  }, [watch("Customer"), watch("TicketType"), watch("TicketCustomType")]);

  return (
    <FormProvider {...methods}>
      <AdminContentLayout className={"EticketAdd"}>
        <AdminContentLayout.Slot name={"Header"}>
          <div className="header flex justify-between items-center w-full px-2">
            <div className="breakcrumb flex gap-1">
              <NavNetworkLink
                to="/eticket/eticket_manager"
                className="text-black"
              >
                {breadcrumb("eTicket")}
              </NavNetworkLink>
              <p>{`>`}</p>
              {TicketID ? (
                <p>{breadcrumb("Update eticket")}</p>
              ) : (
                <p>{breadcrumb("Add eTicket")}</p>
              )}
            </div>
            <div className="flex">
              {TicketID ? (
                <PermissionContainer
                  permission={"BTN_ETICKET_EDITETICKET_SAVE"}
                >
                  <Button
                    style={{
                      padding: 10,
                      margin: "10px 5px",
                      background: "#00703C",
                      color: "white",
                    }}
                    onClick={handleSaveClick}
                  >
                    {common("Save")}
                  </Button>
                </PermissionContainer>
              ) : (
                <PermissionContainer
                  permission={"BTN_ETICKET_CREATETICKET_SAVE"}
                >
                  <Button
                    style={{
                      padding: 10,
                      margin: "10px 5px",
                      background: "#00703C",
                      color: "white",
                    }}
                    onClick={handleSaveClick}
                  >
                    {common("Save")}
                  </Button>
                </PermissionContainer>
              )}

              <PermissionContainer permission="BTN_ETICKET_CREATETICKET_CANCEL">
                <Button
                  style={{
                    padding: 10,
                    margin: "10px 5px",
                  }}
                  onClick={handleCancel}
                >
                  {common("Cancel")}
                </Button>
              </PermissionContainer>
            </div>
          </div>
        </AdminContentLayout.Slot>
        <AdminContentLayout.Slot name={"Content"}>
          <form
            id={"editForm"}
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className="pb-[50px] px-2"
          >
            <div className="flex justify-between gap-[50px]">
              <div className="flex flex-col w-full relative divider-form">
                <Controller
                  name={"TicketStatus"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <SelectboxField
                        field={field}
                        label={t("TicketStatus")}
                        dataSource={
                          MstTicketEstablishInfo?.Data?.Lst_Mst_TicketStatus.filter(
                            (item: any) => item.FlagActive === "1"
                          ) ?? []
                        }
                        required={true}
                        error={errors.TicketStatus}
                        displayExpr={"AgentTicketStatusName"}
                        valueExpr={"TicketStatus"}
                        width={400}
                        readonly={true}
                      />
                    );
                  }}
                  rules={{
                    required: {
                      value: true,
                      message: validateMessage("TicketStatus is required!"),
                    },
                  }}
                />

                <Controller
                  name={"Customer"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <div className="flex gap-2 w-full items-center">
                        <AutocompleteCustomer
                          field={field}
                          errors={errors.Customer}
                        />
                        {field?.value && <CustomerDetailPopup />}
                        <CustomerUserPopup />
                      </div>
                    );
                  }}
                  rules={{
                    required: {
                      value: true,
                      message: validateMessage("CustomerCode is required!"),
                    },
                  }}
                />
                <Controller
                  name={"TicketName"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextboxField
                        field={field}
                        label={t("TicketName")}
                        required={true}
                        error={errors.TicketName}
                        props={{
                          placeholder: placeholder("Input"),
                        }}
                      />
                    );
                  }}
                  rules={{
                    required: {
                      value: true,
                      message: validateMessage("TicketName is required!"),
                    },
                  }}
                />
                <Controller
                  name={"TicketDetail"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <HtmlEditorField
                        field={field}
                        label={t("TicketDetail")}
                      />
                    );
                  }}
                />

                <div className="flex flex-grow justify-start items-stretch basis-0 w-auto h-auto gap-5">
                  <div className="flex flex-col " style={{ flex: "1 1 0px" }}>
                    <Controller
                      name={"OrgID"}
                      control={control}
                      render={({ field }) => {
                        return (
                          <SelectboxField
                            field={field}
                            label={t("OrgID")}
                            dataSource={nntList ?? []}
                            required={true}
                            error={errors.OrgID}
                            displayExpr={"NNTFullName"}
                            valueExpr={"OrgID"}
                            showClearButton={true}
                            onValueChanged={() => {
                              // setValue("AgentCode", null);
                              // setValue("DepartmentCode", null);
                            }}
                          />
                        );
                      }}
                      rules={{
                        required: {
                          value: true,
                          message: validateMessage("OrgID is required!"),
                        },
                      }}
                    />
                    <Controller
                      name={"DepartmentCode"}
                      control={control}
                      render={({ field }) => {
                        return (
                          <SelectboxField
                            field={field}
                            label={t("DepartmentCode")}
                            dataSource={listDepartment}
                            displayExpr={"DepartmentName"}
                            valueExpr={"DepartmentCode"}
                            error={errors.DepartmentCode}
                            showClearButton={true}
                            required
                            disabled={!watch("OrgID")}
                            onValueChanged={() => {
                              // setValue("AgentCode", null);
                            }}
                          />
                        );
                      }}
                      rules={{
                        required: {
                          value: true,
                          message: validateMessage(
                            "DepartmentCode is required!"
                          ),
                        },
                      }}
                    />
                    <Controller
                      name={"AgentCode"}
                      control={control}
                      render={({ field }) => {
                        return (
                          <SelectboxField
                            field={field}
                            label={t("AgentCode")}
                            dataSource={agentList ?? []}
                            required={false}
                            error={errors.AgentCode}
                            displayExpr={"FullName"}
                            valueExpr={"UserCode"}
                            showClearButton={true}
                            disabled={!watch("DepartmentCode")}
                          />
                        );
                      }}
                      // rules={{
                      //   required: {
                      //     value: true,
                      //     message: validateMessage("AgentCode is required!"),
                      //   },
                      // }}
                    />
                  </div>
                  <div className="flex flex-col" style={{ flex: "1 1 0px" }}>
                    <Controller
                      name={"TicketType"}
                      control={control}
                      render={({ field }) => {
                        const dataSource =
                          MstTicketEstablishInfo?.Data?.Lst_Mst_TicketType?.filter(
                            (item: any) => item?.FlagActive == "1"
                          )?.map((item: any) => {
                            return {
                              ...item,
                              visible: item?.TicketType != "MISSEDCALL",
                            };
                          }) ?? [];

                        return (
                          <SelectboxField
                            field={field}
                            label={t("TicketType")}
                            dataSource={dataSource ?? []}
                            required={true}
                            error={errors.TicketType}
                            displayExpr={"AgentTicketTypeName"}
                            valueExpr={"TicketType"}
                            showClearButton={true}
                            // onValueChanged={getSLA}
                          />
                        );
                      }}
                      rules={{
                        required: {
                          value: true,
                          message: validateMessage("TicketType is required!"),
                        },
                      }}
                    />

                    <Controller
                      name={"TicketDeadline"}
                      control={control}
                      render={({ field }) => {
                        return (
                          <DateField
                            field={field}
                            label={t("TicketDeadline")}
                            required={true}
                            error={errors.TicketDeadline}
                            displayFormat="yyyy-MM-dd HH:mm:ss"
                            showClearButton={true}
                          />
                        );
                      }}
                      rules={{
                        required: {
                          value: true,
                          message: validateMessage(
                            "TicketDeadline is required!"
                          ),
                        },
                      }}
                    />

                    <Controller
                      name={"TicketPriority"}
                      control={control}
                      render={({ field }) => {
                        return (
                          <SelectboxField
                            field={field}
                            label={t("TicketPriority")}
                            dataSource={
                              MstTicketEstablishInfo?.Data?.Lst_Mst_TicketPriority.filter(
                                (item: any) => item.FlagActive === "1"
                              ) ?? []
                            }
                            required={true}
                            error={errors.TicketPriority}
                            displayExpr={"AgentTicketPriorityName"}
                            valueExpr={"TicketPriority"}
                            showClearButton={true}
                          />
                        );
                      }}
                      rules={{
                        required: {
                          value: true,
                          message: validateMessage(
                            "TicketPriority is required!"
                          ),
                        },
                      }}
                    />
                  </div>
                </div>

                <Controller
                  name={"TicketAttachFile"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <UploadFileField field={field} label={t("UploadFiles")} />
                    );
                  }}
                />

                {/* dynamic here */}

                <DynamicFormEticket control={control} errors={errors} />
              </div>
              <div className="flex flex-col w-[400px] gap-1 my-1">
                <Controller
                  name={"TicketCustomType"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <SelectboxField
                        direction="vertical"
                        field={field}
                        label={t("TicketCustomType")}
                        dataSource={
                          MstTicketEstablishInfo?.Data?.Lst_Mst_TicketCustomType?.filter(
                            (item: any) => item?.FlagActive == "1"
                          ) ?? []
                        }
                        error={errors.TicketCustomType}
                        displayExpr={"AgentTicketCustomTypeName"}
                        valueExpr={"TicketCustomType"}
                        // onValueChanged={getSLA}
                        showClearButton={true}
                      />
                    );
                  }}
                />
                <Controller
                  name={"TicketSource"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <SelectboxField
                        direction="vertical"
                        field={field}
                        label={t("TicketSource")}
                        dataSource={
                          MstTicketEstablishInfo?.Data?.Lst_Mst_TicketSource.filter(
                            (item: any) => item.FlagActive === "1"
                          ) ?? []
                        }
                        error={errors.TicketSource}
                        displayExpr={"AgentTicketSourceName"}
                        valueExpr={"TicketSource"}
                        showClearButton={true}
                      />
                    );
                  }}
                />
                <Controller
                  name={"ReceptionChannel"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <SelectboxField
                        direction="vertical"
                        field={field}
                        label={t("ReceptionChannel")}
                        dataSource={
                          MstTicketEstablishInfo?.Data?.Lst_Mst_ReceptionChannel.filter(
                            (item: any) => item.FlagActive === "1"
                          ) ?? []
                        }
                        error={errors.ReceptionChannel}
                        displayExpr={"AgentReceptionChannelName"}
                        valueExpr={"ReceptionChannel"}
                        customFunction={handleInitContactChannel}
                        showClearButton={true}
                      />
                    );
                  }}
                />
                <Controller
                  name={"ContactChannel"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <SelectboxField
                        direction="vertical"
                        field={field}
                        label={t("ContactChannel")}
                        dataSource={
                          MstTicketEstablishInfo?.Data?.Lst_Mst_ContactChannel.filter(
                            (item: any) => item.FlagActive === "1"
                          ) ?? []
                        }
                        displayExpr={"AgentContactChannelName"}
                        valueExpr={"ContactChannel"}
                        showClearButton={true}
                      />
                    );
                  }}
                />
                <Controller
                  name={"Tags"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <TagBoxField
                        direction="vertical"
                        field={field}
                        label={t("Tags")}
                        dataSource={tagList ?? []}
                        displayExpr={"TagName"}
                        valueExpr={"TagName"}
                        showClearButton={true}
                        props={{
                          tagRender: (e: any) => {
                            return (
                              <div
                                className={`rounded-[20px] px-[8px] py-[6px] mb-1 flex items-center gap-1 tagbox-custom`}
                                style={{
                                  backgroundColor: e.color,
                                }}
                              >
                                <div className="text-white">{e.TagName}</div>
                                <div className="dx-tag-remove-button flex items-center justify-center">
                                  <svg
                                    width="8"
                                    height="8"
                                    viewBox="0 0 8 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className=""
                                  >
                                    <path
                                      d="M0.749822 7.75035C0.651349 7.75037 0.553841 7.73095 0.462892 7.6932C0.371944 7.65545 0.289345 7.6001 0.219835 7.53035C0.150141 7.4607 0.0948552 7.378 0.057135 7.28697C0.0194148 7.19595 0 7.09838 0 6.99985C0 6.90132 0.0194148 6.80375 0.057135 6.71273C0.0948552 6.6217 0.150141 6.539 0.219835 6.46935L6.21969 0.469352C6.28934 0.399657 6.37204 0.344369 6.46306 0.306648C6.55408 0.268927 6.65165 0.249512 6.75018 0.249512C6.84871 0.249512 6.94627 0.268927 7.03729 0.306648C7.12832 0.344369 7.21102 0.399657 7.28066 0.469352C7.35029 0.539067 7.4055 0.62182 7.44314 0.712881C7.48077 0.803942 7.50009 0.901527 7.5 1.00006C7.49991 1.09859 7.4804 1.19614 7.44259 1.28713C7.40479 1.37812 7.34942 1.46077 7.27966 1.53035L1.27981 7.53035C1.2103 7.6001 1.1277 7.65545 1.03675 7.6932C0.945803 7.73095 0.848295 7.75037 0.749822 7.75035Z"
                                      fill="#fff"
                                    />
                                    <path
                                      d="M6.74991 7.75032C6.65144 7.75034 6.55393 7.73092 6.46298 7.69316C6.37203 7.65541 6.28943 7.60007 6.21992 7.53032L0.220067 1.53032C0.0796202 1.38969 0.000732422 1.19907 0.000732422 1.00032C0.000732422 0.801566 0.0796202 0.610942 0.220067 0.470317C0.360689 0.329866 0.551309 0.250977 0.750054 0.250977C0.9488 0.250977 1.13942 0.329866 1.28004 0.470317L7.2799 6.47032C7.38465 6.5752 7.45597 6.70878 7.48486 6.85418C7.51374 6.99958 7.49889 7.15028 7.44218 7.28724C7.38547 7.4242 7.28945 7.54129 7.16623 7.62371C7.04302 7.70613 6.89815 7.75019 6.74991 7.75032Z"
                                      fill="#fff"
                                    />
                                  </svg>
                                </div>
                              </div>
                            );
                          },
                        }}
                      />
                    );
                  }}
                />
                <Controller
                  name={"TicketFollowers"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <TagBoxField
                        direction="vertical"
                        field={field}
                        label={t("TicketFollowers")}
                        dataSource={followList ?? []}
                        displayExpr={"UserName"}
                        valueExpr={"UserCode"}
                        showClearButton={true}
                        props={{
                          tagRender: (e: any) => {
                            return (
                              <div className="bg-[#EAF9F2] px-[4px] py-[6px] rounded-[20px] mb-1 flex items-center gap-1 tagbox-custom">
                                <img
                                  src={e.Avatar ?? defaultAvatar}
                                  alt=""
                                  className="w-[18px] h-[18px] rounded-[50%] shadow-sm"
                                />
                                <div>{e.UserName}</div>
                                <div className="dx-tag-remove-button flex items-center justify-center">
                                  <CloseIcon />
                                </div>
                              </div>
                            );
                          },
                        }}
                      />
                    );
                  }}
                />
                <Controller
                  name={"SLALevel"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextboxField
                        field={field}
                        label={t("SLAID")}
                        direction="vertical"
                        disabled={true}
                        showPlaceholder={false}
                      />
                    );
                  }}
                />
                <Controller
                  name={"RemindWork"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextboxField
                        field={field}
                        label={t("RemindWork")}
                        direction="vertical"
                      />
                    );
                  }}
                />
                <Controller
                  name={"RemindDTimeUTC"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <DateField
                        field={field}
                        label={t("RemindDTimeUTC")}
                        displayFormat="yyyy-MM-dd HH:mm:ss"
                        direction="vertical"
                        showClearButton={true}
                      />
                    );
                  }}
                />
              </div>
            </div>

            <button
              hidden={true}
              ref={refSubmitButton}
              type={"submit"}
              form={"editForm"}
            ></button>
          </form>
          {customerPopupValue && (
            <Popup
              onHiding={handleClose}
              visible={customerPopupValue}
              showCloseButton
              title={t("Add customer")}
              style={{
                background: "white",
              }}
            >
              <AddCustomerPopup setValue={setValue} close={handleClose} />
            </Popup>
          )}

          {detailPopup && (
            <Popup
              onHiding={() => setDetailPopup(false)}
              visible={detailPopup}
              showCloseButton
              title={t("Detail Customer")}
              style={{
                background: "white",
              }}
            >
              {watch("Customer") && (
                <DetailCustomerPopup
                  code={watch("Customer")?.CustomerCodeSys}
                />
              )}
            </Popup>
          )}

          {watch("isLoading") && <LoadPanel visible={watch("isLoading")} />}
        </AdminContentLayout.Slot>
      </AdminContentLayout>
    </FormProvider>
  );
};

const CustomerUserPopup = () => {
  const customerPopupValue = useAtomValue(customerPopup);
  const setCustomerPopup = useSetAtom(customerPopup);

  const { t } = useI18n("Common");

  return (
    <PermissionContainer permission={"BTN_CUSTOMER_CREATECUSTOM_SAVE"}>
      <Button
        style={{
          padding: 10,
          background: "#00703C",
          color: "white",
          width: 100,
        }}
        onClick={() => setCustomerPopup(!customerPopupValue)}
      >
        {t("Add")}
      </Button>
    </PermissionContainer>
  );
};

const CustomerDetailPopup = () => {
  const customerPopupValue = useAtomValue(detailPopupAtom);
  const setCustomerPopup = useSetAtom(detailPopupAtom);

  return (
    <div
      className="absolute right-[155px] cursor-pointer 
 w-[24px] h-[24px] flex items-center justify-center rounded-[50%] "
      onClick={() => setCustomerPopup(!customerPopupValue)}
    >
      <img
        src="/images/icons/explore-icon.png"
        alt=""
        className="w-[18px] h-[18px]"
      />
    </div>
  );
};

export default EticketAddDemo;
