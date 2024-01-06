import NavNetworkLink from "@/components/Navigate";
import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useNetworkNavigate } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { SelectboxField } from "@/pages/admin/custom-field/components/selectbox-field";
import { SwitchField } from "@/pages/admin/custom-field/components/switch-field";
import { TextboxField } from "@/pages/admin/custom-field/components/textbox-field";
import { useQuery } from "@tanstack/react-query";
import { Button } from "devextreme-react";
import { atom, useAtom, useSetAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import ServiceImprovement_Audio from "./components/audio/ServiceImprovement_Audio";
import ServiceImprovement_Time from "./components/time/ServiceImprovement_Time";
import ServiceImprovement_Word_Deny from "./components/word/ServiceImprovement_Word_Deny";
import ServiceImprovement_Word_Honorific from "./components/word/ServiceImprovement_Word_Honorific";

const defaultTime = () => {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
};

export const Lst_SvImp_SvImprvDenyWordAtom = atom<any>([]);
export const Lst_SvImp_SvImprvHonorificAtom = atom<any>([]);

const defaultTalkTime = [
  {
    SvImprvItCode: "TIME01",
    TalkTimeMinValue: defaultTime(),
    TalkTimeMaxValue: defaultTime(),
    FlagActive: "1",
  },
  {
    SvImprvItCode: "TIME02",
    TalkTimeMinValue: defaultTime(),
    TalkTimeMaxValue: defaultTime(),
    FlagActive: "1",
  },
  {
    SvImprvItCode: "TIME03",
    TalkTimeMinValue: defaultTime(),
    TalkTimeMaxValue: defaultTime(),
    FlagActive: "1",
  },
];

export const Lst_SvImp_SvImprvCallTalkTimeAtom = atom(defaultTalkTime);

const defaultAudio = [
  {
    SvImprvItCode: "SOUND01",
    MinValue: 0,
    MaxValue: 0,
    QtyAllow: 0,
    FlagActive: "1",
  },
  {
    SvImprvItCode: "SOUND02",
    MinValue: 0,
    MaxValue: 0,
    QtyAllow: 0,
    FlagActive: "1",
  },
];

export const Lst_SvImp_SvImprvAudioAtom = atom(defaultAudio);

const ServiceImprovementPage = () => {
  const { t } = useI18n("ServiceImprovementPage");
  const { t: errorCode } = useI18n("ErrorCode");

  const { flag, SvImprvCodeSys } = useParams();
  const { auth } = useAuth();
  const showError = useSetAtom(showErrorAtom);
  const navigate = useNetworkNavigate();
  const ref = useRef({
    Lst_SvImp_SvImprvDenyWord: [],
    Lst_SvImp_SvImprvHonorific: [],
    Lst_SvImp_SvImprvCallTalkTime: [],
    Lst_SvImp_SvImprvAudio: [],
  });

  const [Lst_SvImp_SvImprvDenyWord, setLst_SvImp_SvImprvDenyWord] = useAtom(
    Lst_SvImp_SvImprvDenyWordAtom
  );
  const [Lst_SvImp_SvImprvHonorific, setLst_SvImp_SvImprvHonorific] = useAtom(
    Lst_SvImp_SvImprvHonorificAtom
  );
  const [Lst_SvImp_SvImprvCallTalkTime, setLst_SvImp_SvImprvCallTalkTime] =
    useAtom(Lst_SvImp_SvImprvCallTalkTimeAtom);
  const [Lst_SvImp_SvImprvAudio, setLst_SvImp_SvImprvAudio] = useAtom(
    Lst_SvImp_SvImprvAudioAtom
  );

  const [type, setType] = useState<any>("detail");

  const { t: common } = useI18n("Common");

  const handleUpdate = () => {
    refSubmitButton?.current?.click();
  };

  const handleSave = () => {
    refSubmitButton?.current?.click();
  };

  const handleCancel = () => {
    navigate("/service/ServiceImprovement");
  };

  const { t: placeholder } = useI18n("Placeholder");
  const { t: validateMessage } = useI18n("Validate");

  const api = useClientgateApi();

  const formRef: any = useRef();

  const refSubmitButton: any = useRef();

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
      FlagActive: true,
    },
  });

  const setTime = (sec: any) => {
    const date = new Date();

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(sec);

    return date;
  };

  const { data: getData, refetch } = useQuery(
    ["getSvImprvCodeSys", SvImprvCodeSys],
    async () => {
      if (SvImprvCodeSys) {
        const resp: any = await api.SvImpSvImprv_GetBySvImprvCodeSys(
          SvImprvCodeSys
        );

        if (resp?.isSuccess) {
          const data = resp.Data.Lst_SvImp_SvImprv[0];
          setValue("SvImprvName", data.SvImprvName);
          setValue("SvImprvItType", data.SvImprvItType);
          setValue("FlagActive", data.FlagActive == "1");
          setLst_SvImp_SvImprvDenyWord(resp?.Data?.Lst_SvImp_SvImprvDenyWord);
          setLst_SvImp_SvImprvHonorific(resp?.Data?.Lst_SvImp_SvImprvHonorific);
          setLst_SvImp_SvImprvCallTalkTime(
            resp?.Data?.Lst_SvImp_SvImprvCallTalkTime?.map((item: any) => {
              return {
                ...item,
                TalkTimeMinValue: setTime(item.TalkTimeMinValue),
                TalkTimeMaxValue: setTime(item.TalkTimeMaxValue),
              };
            })
          );
          setLst_SvImp_SvImprvAudio(resp?.Data?.Lst_SvImp_SvImprvAudio);

          return resp?.Data;
        } else {
          setValue("SvImprvName", null);
          setValue("SvImprvItType", null);
          setValue("FlagActive", true);
          setLst_SvImp_SvImprvDenyWord([]);
          setLst_SvImp_SvImprvHonorific([]);
          setLst_SvImp_SvImprvCallTalkTime(defaultTalkTime);
          setLst_SvImp_SvImprvAudio(defaultAudio);
          showError({
            message: errorCode(resp._strErrCode),
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
        setValue("SvImprvName", null);
        setValue("SvImprvItType", null);
        setValue("FlagActive", true);
        setLst_SvImp_SvImprvDenyWord([]);
        setLst_SvImp_SvImprvHonorific([]);
        setLst_SvImp_SvImprvCallTalkTime(defaultTalkTime);
        setLst_SvImp_SvImprvAudio(defaultAudio);
      }
    }
  );

  const { data: sysgGen, refetch: refetchSysGen } = useQuery(
    ["sysGen"],
    async () => {
      const resp: any = await api.Seq_GetSvImprvCodeSys();
      setValue("SvImprvCodeSys", resp?.Data);

      return resp?.Data;
    }
  );

  const refetching = () => {
    refetchSysGen();
    refetch();
  };

  useEffect(() => {
    refetching();
  }, [SvImprvCodeSys]);

  const { data: listSvImprvItType } = useQuery(
    ["ListSvImprvItType"],
    api.MstSvImprvItemType_GetAllActive
  );

  const svImprvItType = watch("SvImprvItType");

  const renderTable = useMemo(() => {
    const readOnly = SvImprvCodeSys && type == "detail" ? true : false;

    return match(svImprvItType)
      .with("CALLCONVERSATIONCONTENT", () => (
        <div className="w-full flex justify-center gap-[20px]">
          <ServiceImprovement_Word_Honorific readOnly={readOnly} />
          <ServiceImprovement_Word_Deny readOnly={readOnly} />
        </div>
      ))
      .with("CALLTALKTIME", () => (
        <ServiceImprovement_Time readOnly={readOnly} />
      ))
      .with("CALLAUDIO", () => <ServiceImprovement_Audio readOnly={readOnly} />)

      .otherwise(() => <></>);
  }, [svImprvItType, type, SvImprvCodeSys]);

  const checkListByType = ({ type }: any) => {
    return match(type)
      .with("CALLCONVERSATIONCONTENT", () => {
        const listDenyWord = Lst_SvImp_SvImprvDenyWord;
        const listImprvHonorific = Lst_SvImp_SvImprvHonorific;

        const checkListDenyWord =
          listDenyWord.length == 0
            ? true
            : listDenyWord.some((item: any) => {
                return item.WordDesc && item.QtyStd;
              });
        const checkListImprvHonorific =
          listImprvHonorific.length == 0
            ? true
            : listImprvHonorific.some((item: any) => {
                return item.WordDesc && item.QtyStd && item.FlagIsRequire;
              });
        return checkListDenyWord && checkListImprvHonorific;
      })
      .with("CALLTALKTIME", () => {
        const list = Lst_SvImp_SvImprvCallTalkTime;
        if (list.length == 0) {
          return true;
        }
        const result = list.some(
          (item: any) =>
            item.TalkTimeMinValue &&
            item.TalkTimeMaxValue &&
            item.TalkTimeMinValue <= item.TalkTimeMaxValue
        );
        return result;
      })
      .with("CALLAUDIO", () => {
        const list = Lst_SvImp_SvImprvAudio;
        const result = list.some(
          (item: any) =>
            item.MinValue >= 0 &&
            item.MaxValue >= 0 &&
            item.QtyAllow >= 0 &&
            item.MinValue <= item.MaxValue
        );
        return result;
      })
      .otherwise(() => false);
  };

  const getSec = (time: any) => {
    const inputDate = new Date(time);

    const hour = inputDate.getHours();
    const minute = inputDate.getMinutes();

    const secondsInThisHour = hour * 3600 + minute * 60;

    return secondsInThisHour;
  };

  const onSave = async (data: any) => {
    const check = checkListByType({
      type: data.SvImprvItType,
    });

    if (!check) {
      return;
    }

    const listTime = Lst_SvImp_SvImprvCallTalkTime?.map((item: any) => {
      return {
        ...item,
        TalkTimeMinValue: getSec(item.TalkTimeMinValue),
        TalkTimeMaxValue: getSec(item.TalkTimeMaxValue),
      };
    });

    let param: any = {
      SvImp_SvImprv: {
        SvImprvCodeSys: watch("SvImprvCodeSys"),
        NetworkID: auth.networkId,
        OrgID: auth.orgData?.Id,
        SvImprvCode: watch("SvImprvCodeSys"),
        SvImprvItType: data.SvImprvItType,
        SvImprvName: data.SvImprvName,
        FlagActive: data.FlagActive ? "1" : "0",
      },
      Lst_SvImp_SvImprvHonorific:
        data.SvImprvItType == "CALLCONVERSATIONCONTENT"
          ? Lst_SvImp_SvImprvHonorific?.map((item: any, index: any) => {
              return {
                ...item,
                Idx: index + 1,
              };
            })
          : [],
      Lst_SvImp_SvImprvDenyWord:
        data.SvImprvItType == "CALLCONVERSATIONCONTENT"
          ? Lst_SvImp_SvImprvDenyWord?.map((item: any, index: any) => {
              return {
                ...item,
                Idx: index + 1,
              };
            })
          : [],
      Lst_SvImp_SvImprvCallTalkTime:
        data.SvImprvItType == "CALLTALKTIME" ? listTime : [],
      Lst_SvImp_SvImprvAudio:
        data.SvImprvItType == "CALLAUDIO" ? Lst_SvImp_SvImprvAudio : [],
    };

    if (SvImprvCodeSys) {
      param = {
        SvImp_SvImprv: {
          SvImprvCodeSys: SvImprvCodeSys,
          NetworkID: auth.networkId,
          OrgID: auth.orgData?.Id,
          SvImprvCode: SvImprvCodeSys,
          SvImprvItType: data.SvImprvItType,
          SvImprvName: data.SvImprvName,
          FlagActive: data.FlagActive ? "1" : "0",
        },
        Lst_SvImp_SvImprvHonorific:
          data.SvImprvItType == "CALLCONVERSATIONCONTENT"
            ? Lst_SvImp_SvImprvHonorific?.map((item: any, index: any) => {
                return {
                  ...item,
                  Idx: index + 1,
                };
              })
            : [],
        Lst_SvImp_SvImprvDenyWord:
          data.SvImprvItType == "CALLCONVERSATIONCONTENT"
            ? Lst_SvImp_SvImprvDenyWord?.map((item: any, index: any) => {
                return {
                  ...item,
                  Idx: index + 1,
                };
              })
            : [],
        Lst_SvImp_SvImprvCallTalkTime:
          data.SvImprvItType == "CALLTALKTIME" ? listTime : [],
        Lst_SvImp_SvImprvAudio:
          data.SvImprvItType == "CALLAUDIO" ? Lst_SvImp_SvImprvAudio : [],
      };
    }

    const resp: any = await api.SvImpSvImprv_Save(param);

    if (resp.isSuccess) {
      toast.success(common("Create successfully!"), {
        onClose: handleCancel,
      });
    } else {
      showError({
        message: errorCode(resp._strErrCode),
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

  const handleDelete = async () => {
    const param = {
      SvImp_SvImprv: {
        SvImprvCodeSys: watch("SvImprvCodeSys"),
        NetworkID: auth.networkId,
        OrgID: auth.orgData?.Id,
        SvImprvCode: watch("SvImprvCodeSys"),
      },
      Lst_SvImp_SvImprvHonorific: [],
      Lst_SvImp_SvImprvDenyWord: [],
      Lst_SvImp_SvImprvCallTalkTime: [],
      Lst_SvImp_SvImprvAudio: [],
    };

    const resp: any = await api.SvImpSvImprv_Delete(param);

    if (resp.isSuccess) {
      toast.success(common("Delete successfully!"), {
        onClose: handleCancel,
      });
    } else {
      showError({
        message: errorCode(resp._strErrCode),
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

  const handleDuplicate = async () => {
    const listTime = Lst_SvImp_SvImprvCallTalkTime?.map((item: any) => {
      return {
        ...item,
        TalkTimeMinValue: getSec(item.TalkTimeMinValue),
        TalkTimeMaxValue: getSec(item.TalkTimeMaxValue),
      };
    });

    const param = {
      SvImp_SvImprv: {
        SvImprvCodeSys: watch("SvImprvCodeSys"),
        NetworkID: auth.networkId,
        OrgID: auth.orgData?.Id,
        SvImprvCode: watch("SvImprvCodeSys"),
        SvImprvItType: watch("SvImprvItType"),
        SvImprvName: watch("SvImprvName"),
        FlagActive: watch("FlagActive") ? "1" : "0",
      },

      Lst_SvImp_SvImprvHonorific:
        watch("SvImprvItType") == "CALLCONVERSATIONCONTENT"
          ? Lst_SvImp_SvImprvHonorific?.map((item: any, index: any) => {
              return {
                ...item,
                Idx: index + 1,
              };
            })
          : [],
      Lst_SvImp_SvImprvDenyWord:
        watch("SvImprvItType") == "CALLCONVERSATIONCONTENT"
          ? Lst_SvImp_SvImprvDenyWord?.map((item: any, index: any) => {
              return {
                ...item,
                Idx: index + 1,
              };
            })
          : [],
      Lst_SvImp_SvImprvCallTalkTime:
        watch("SvImprvItType") == "CALLTALKTIME" ? listTime : [],
      Lst_SvImp_SvImprvAudio:
        watch("SvImprvItType") == "CALLAUDIO" ? Lst_SvImp_SvImprvAudio : [],
    };

    const resp: any = await api.SvImpSvImprv_Save(param);

    if (resp.isSuccess) {
      toast.success(common("Duplicate successfully!"));

      navigate(`/service/ServiceImprovement/Add/${watch("SvImprvCodeSys")}`);
      // refetching();
      setType("Add");
    } else {
      showError({
        message: errorCode(resp._strErrCode),
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

  const handleEdit = () => {
    setType("edit");
  };

  return (
    <AdminContentLayout className="w-full">
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header flex justify-between items-center w-full px-2">
          <div className="breakcrumb flex gap-1">
            <NavNetworkLink
              to="/service/ServiceImprovement"
              className="text-black"
            >
              {t("ServiceImprovementManager")}
            </NavNetworkLink>
            <p>{`>`}</p>
            {!flag && SvImprvCodeSys ? (
              <p>{t("ServiceImprovementManager Detail")}</p>
            ) : (
              <p>{t("ServiceImprovementManager Add")}</p>
            )}
          </div>
          <div className="flex">
            {!flag && SvImprvCodeSys ? (
              type == "detail" ? (
                <PermissionContainer
                  permission={
                    "BTN_THEM_MOI_BO_TIEU_CHI_PHAN_TICH_CHAT_LUONG_DICH_VU_SUA"
                  }
                >
                  <Button
                    style={{
                      padding: 10,
                      margin: "10px 5px",
                      background: "#00703C",
                      color: "white",
                    }}
                    onClick={handleEdit}
                  >
                    {common("Edit")}
                  </Button>
                </PermissionContainer>
              ) : (
                <PermissionContainer
                  permission={
                    "BTN_CAP_NHAT_BO_TIEU_CHI_PHAN_TICH_CHAT_LUONG_DICH_VU_CAP_NHAT"
                  }
                >
                  <Button
                    style={{
                      padding: 10,
                      margin: "10px 5px",
                      background: "#00703C",
                      color: "white",
                    }}
                    onClick={handleUpdate}
                  >
                    {common("Update")}
                  </Button>
                </PermissionContainer>
              )
            ) : (
              <PermissionContainer
                permission={
                  "BTN_THEM_MOI_BO_TIEU_CHI_PHAN_TICH_CHAT_LUONG_DICH_VU_LUU"
                }
              >
                <Button
                  style={{
                    padding: 10,
                    margin: "10px 5px",
                    background: "#00703C",
                    color: "white",
                  }}
                  onClick={handleSave}
                >
                  {common("Save")}
                </Button>
              </PermissionContainer>
            )}

            {SvImprvCodeSys && type == "detail" && (
              <PermissionContainer permission="BTN_THEM_MOI_BO_TIEU_CHI_PHAN_TICH_CHAT_LUONG_DICH_VU_XOA">
                <Button
                  style={{
                    padding: 10,
                    margin: "10px 5px",
                    background: "#00703C",
                    color: "white",
                  }}
                  onClick={handleDelete}
                >
                  {common("Delete")}
                </Button>
              </PermissionContainer>
            )}

            {SvImprvCodeSys && type == "detail" && (
              <PermissionContainer permission="BTN_THEM_MOI_BO_TIEU_CHI_PHAN_TICH_CHAT_LUONG_DICH_VU_NHAN_BAN">
                <Button
                  style={{
                    padding: 10,
                    margin: "10px 5px",
                    background: "#00703C",
                    color: "white",
                  }}
                  onClick={handleDuplicate}
                >
                  {common("Duplicate")}
                </Button>
              </PermissionContainer>
            )}

            <PermissionContainer permission="">
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
      <AdminContentLayout.Slot name={"Center"}></AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div>
          <form
            id={"editForm"}
            ref={formRef}
            className="pb-[50px] px-2"
            onSubmit={handleSubmit(onSave)}
          >
            <div>
              <Controller
                name={"SvImprvName"}
                control={control}
                render={({ field }) => {
                  return (
                    <TextboxField
                      field={field}
                      label={t("SvImprvName")}
                      required={true}
                      error={errors.SvImprvName}
                      props={{
                        placeholder: placeholder("Input"),
                        readOnly: SvImprvCodeSys && type == "detail",
                      }}
                    />
                  );
                }}
                rules={{
                  required: {
                    value: true,
                    message: validateMessage("SvImprvName is required!"),
                  },
                }}
              />
              <div className="flex items-center gap-4">
                <Controller
                  name={"SvImprvItType"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <SelectboxField
                        width={300}
                        field={field}
                        label={t("SvImprvItType")}
                        dataSource={listSvImprvItType?.DataList ?? []}
                        required={true}
                        error={errors.SvImprvItType}
                        displayExpr={"SvImprvItTypeName"}
                        valueExpr={"SvImprvItType"}
                        showClearButton={true}
                        readonly={
                          SvImprvCodeSys && type == "detail" ? true : false
                        }
                      />
                    );
                  }}
                  rules={{
                    required: {
                      value: true,
                      message: validateMessage("SvImprvItType is required!"),
                    },
                  }}
                />
                <Controller
                  name={"FlagActive"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <SwitchField
                        field={field}
                        label={t("FlagActive")}
                        readOnly={
                          !SvImprvCodeSys ||
                          (SvImprvCodeSys && type == "detail")
                            ? true
                            : false
                        }
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
            />
          </form>
          <div className="p-2 mx-2 font-semibold bg-[#E8F0F6]">
            {t("Detailed analysis and evaluation")}
          </div>
          <div className="mx-2 mt-5">{renderTable}</div>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default ServiceImprovementPage;
