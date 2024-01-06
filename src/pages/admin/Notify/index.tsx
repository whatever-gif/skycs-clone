import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { PageHeaderLayout } from "@/packages/layouts/page-header-layout";
import { showErrorAtom } from "@/packages/store";
import { useQuery } from "@tanstack/react-query";
import { Button, LoadPanel } from "devextreme-react";
import { useSetAtom } from "jotai";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CheckboxField } from "../custom-field/components/checkbox-field";
import { SelectboxField } from "../custom-field/components/selectbox-field";
import Email_Popup from "./Popup/Email_Popup";
import ZMS_Popup from "./Popup/ZMS_Popup";
import Zalo_Popup from "./Popup/Zalo_Popup";
import {
  visibleEmailAtom,
  visibleZMSAtom,
  visibleZaloAtom,
} from "./Popup/store";
const Notify = () => {
  const { t } = useI18n("Notify");
  const { t: button } = useI18n("Button");
  const auth = useAuth();
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const defaultData = {
    OrgID: auth.auth.orgData,
    EstablishID: "",
    FlagNotifySystem: false,
    FlagNotifyEmail: false,
    FlagNotifySMS: false,
    FlagNotifyZalo: false,
    SubFormCodeEmail: "",
    SubFormCodeSMS: "",
    SubFormCodeZalo: "",
    FlagActive: "",
    Remark: "",
  };

  const setVisibleZMS = useSetAtom(visibleZMSAtom);
  const setVisibleZALO = useSetAtom(visibleZaloAtom);
  const setVisibleEmail = useSetAtom(visibleEmailAtom);

  const ref: any = useRef();

  const handleSave = async (data: any) => {
    const custumize = {
      ...data,
      FlagNotifySystem: data.FlagNotifySystem ? "1" : "0",
      FlagNotifyEmail: data.FlagNotifyEmail ? "1" : "0",
      FlagNotifySMS: data.FlagNotifySMS ? "1" : "0",
      FlagNotifyZalo: data.FlagNotifyZalo ? "1" : "0",
    };

    const response = await api.Rpt_CpnCampaignResultCall_Save(custumize);
    if (response.isSuccess) {
      toast.success(t("Rpt_CpnCampaignResultCall_Save Success!"));
      refetch();
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

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Mst_EstablishRemindETicket_GetByOrgID"],
    queryFn: async () => {
      const response = await api.Mst_EstablishRemindETicket_GetByOrgID(
        auth?.auth?.orgId ?? ""
      );
      if (response.isSuccess) {
        if (response?.Data?.Mst_EstablishRemindETicket) {
          const data = response?.Data?.Mst_EstablishRemindETicket;
          const obj = {
            ...data,
            FlagNotifySystem: data.FlagNotifySystem === "1" ? true : false,
            FlagNotifyEmail: data.FlagNotifyEmail === "1" ? true : false,
            FlagNotifySMS: data.FlagNotifySMS === "1" ? true : false,
            FlagNotifyZalo: data.FlagNotifyZalo === "1" ? true : false,
          };
          return obj;
        }
        return response.Data;
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

  const { data: dataListMedia, isLoading: isLoadingListMedia } = useQuery({
    queryKey: ["MstSubmissionForm/Search"],
    queryFn: async () => {
      const response = await api.Mst_SubmissionForm_Search({
        Ft_PageSize: 1000,
        Ft_PageIndex: 0,
        FlagActive: 1,
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
    register,
    reset,
    unregister,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<any>({
    defaultValues: defaultData,
    values: data ?? {},
  });

  const triggerSubmit = () => {
    ref?.current?.click();
  };

  // if (watch("FlagNotifyEmail")) {
  //   setError("SubFormCodeEmail", {
  //     type: "required",
  //     message: "This is required",
  //   });
  // } else {
  //   clearErrors("SubFormCodeEmail");
  // }
  // if (watch("FlagNotifySMS")) {
  //   setError("SubFormCodeSMS", {
  //     type: "required",
  //     message: "This is required",
  //   });
  // } else {
  //   clearErrors("SubFormCodeSMS");
  // }
  // if (watch("FlagNotifyZalo")) {
  //   setError("SubFormCodeZalo", {
  //     type: "required",
  //     message: "This is required",
  //   });
  // } else {
  //   clearErrors("SubFormCodeZalo");
  // }

  return (
    <AdminContentLayout className={"Content_Managent"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderLayout>
          <PageHeaderLayout.Slot name={"Before"}>
            <div className="text-header font-bold dx-font-m">
              {t("Set up reminders")}
            </div>
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"Center"}></PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"After"}>
            <PermissionContainer permission={"BTN_ADMIN_NOTIFY_SAVE"}>
              <Button
                className="mr-1"
                text={button("Save")}
                onClick={() => {
                  triggerSubmit();
                }}
              ></Button>
            </PermissionContainer>
          </PageHeaderLayout.Slot>
        </PageHeaderLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <LoadPanel visible={isLoading || isLoadingListMedia} />
        {!(isLoading || isLoadingListMedia) && (
          <div className="p-4">
            <form id={"form"} onSubmit={handleSubmit(handleSave)}>
              <Controller
                name={"FlagNotifySystem"}
                control={control}
                render={({ field }) => {
                  return (
                    <div className="ml-[-190px]">
                      <CheckboxField
                        field={field}
                        readonly={true}
                        label={t("FlagNotifySystem")}
                      />
                    </div>
                  );
                }}
              />
              <Controller
                name={"FlagNotifyEmail"}
                control={control}
                render={({ field }) => {
                  return (
                    <div className="ml-[-190px]">
                      <CheckboxField
                        field={field}
                        label={t("FlagNotifyEmail")}
                      />
                    </div>
                  );
                }}
              />
              <Controller
                name={"SubFormCodeEmail"}
                control={control}
                render={({ field }) => {
                  return (
                    <div className="flex align-items-center">
                      <SelectboxField
                        dataSource={
                          dataListMedia
                            ? dataListMedia.filter((i) => {
                                return i.ChannelType === "EMAIL";
                              })
                            : []
                        }
                        error={errors.SubFormCodeEmail}
                        displayExpr="SubFormName"
                        valueExpr="SubFormCode"
                        required={!!watch("FlagNotifyEmail")}
                        field={field}
                        label={t("SubFormCodeEmail")}
                      />
                      <PermissionContainer permission="BTN_ADMIN_NOTIFY_PREVIEW">
                        <Button
                          className="ml-1 p-1 w-[100px]"
                          onClick={() => {
                            setVisibleEmail(true);
                          }}
                          text={button("Preview")}
                        ></Button>
                      </PermissionContainer>
                    </div>
                  );
                }}
                rules={{
                  required: {
                    value: !!watch("FlagNotifyEmail"),
                    message: "SubFormCodeEmail is required!",
                  },
                }}
              />
              <Controller
                name={"FlagNotifySMS"}
                control={control}
                render={({ field }) => {
                  return (
                    <div className="ml-[-190px]">
                      <CheckboxField field={field} label={t("FlagNotifySMS")} />
                    </div>
                  );
                }}
              />
              <Controller
                name={"SubFormCodeSMS"}
                control={control}
                render={({ field }) => {
                  return (
                    <div className="flex align-items-center">
                      <SelectboxField
                        dataSource={
                          dataListMedia
                            ? dataListMedia.filter(
                                (i) => i.ChannelType === "SMS"
                              )
                            : []
                        }
                        field={field}
                        displayExpr="SubFormName"
                        error={errors.SubFormCodeSMS}
                        required={!!watch("FlagNotifySMS")}
                        valueExpr="SubFormCode"
                        label={t("SubFormCodeSMS")}
                      />
                      <PermissionContainer permission="BTN_ADMIN_NOTIFY_PREVIEW">
                        <Button
                          className="ml-1 p-1 w-[100px]"
                          onClick={() => {
                            setVisibleZMS(true);
                          }}
                          text={button("Preview")}
                        ></Button>
                      </PermissionContainer>
                    </div>
                  );
                }}
                rules={{
                  required: {
                    value: !!watch("FlagNotifySMS"),
                    message: "SubFormCodeSMS is required!",
                  },
                }}
              />
              <Controller
                name={"FlagNotifyZalo"}
                control={control}
                render={({ field }) => {
                  return (
                    <div className="ml-[-190px]">
                      <CheckboxField
                        field={field}
                        label={t("FlagNotifyZalo")}
                      />
                    </div>
                  );
                }}
              />
              <Controller
                name={"SubFormCodeZalo"}
                control={control}
                render={({ field }) => {
                  return (
                    <div className="flex align-items-center">
                      <SelectboxField
                        dataSource={
                          dataListMedia
                            ? dataListMedia.filter(
                                (i) => i.ChannelType === "ZALO"
                              )
                            : []
                        }
                        field={field}
                        error={errors.SubFormCodeZalo}
                        required={!!watch("FlagNotifyZalo")}
                        displayExpr="SubFormName"
                        valueExpr="SubFormCode"
                        label={t("SubFormCodeZalo")}
                      />
                      <PermissionContainer permission="BTN_ADMIN_NOTIFY_PREVIEW">
                        <Button
                          className="ml-1 p-1 w-[100px]"
                          onClick={() => {
                            setVisibleZALO(true);
                          }}
                          text={button("Preview")}
                        ></Button>
                      </PermissionContainer>
                    </div>
                  );
                }}
                rules={{
                  required: {
                    value: !!watch("FlagNotifyZalo"),
                    message: "SubFormCodeZalo is required!",
                  },
                }}
              />
              <button hidden={true} ref={ref} type={"submit"} form={"form"} />
            </form>
          </div>
        )}
        <ZMS_Popup
          onClose={() => {
            setVisibleZMS(false);
          }}
          code={watch("SubFormCodeSMS")}
        />
        <Zalo_Popup
          onClose={() => {
            setVisibleZALO(false);
          }}
          code={watch("SubFormCodeZalo")}
        />
        <Email_Popup
          onClose={() => {
            setVisibleEmail(false);
          }}
          code={watch("SubFormCodeEmail")}
        />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Notify;
