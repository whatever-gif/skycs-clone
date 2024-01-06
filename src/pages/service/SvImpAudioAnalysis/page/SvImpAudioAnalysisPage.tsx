import NavNetworkLink from "@/components/Navigate";
import PermissionContainer, {
  checkPermision,
} from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useNetworkNavigate } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { GridViewPopup } from "@/packages/ui/base-gridview";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button, Popup, SelectBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AudioStatus } from "../components/AudioStatus";
import TimeIcon from "./component/TimeIcon";
import { useColumn } from "./component/use-columns";
import ChooseAudioPopup, { audioPopupAtom } from "./component/use-popup";
import PopupResult from "./component/use-popup-result";

const SvImpAudioAnalysisPage = () => {
  const { t } = useI18n("SvImpAudioAnalysisPage");
  const { t: common } = useI18n("Common");
  const { t: error } = useI18n("ErrorMessage");
  const { t: validate } = useI18n("Validate");

  const setOpen = useSetAtom(audioPopupAtom);

  const showError = useSetAtom(showErrorAtom);

  let gridRef = useRef();

  const { code } = useParams();

  const [type, setType] = useState("detail");

  const [openWarning, setOpenWarning] = useState<boolean>(false);

  const { auth } = useAuth();

  const api = useClientgateApi();

  const navigate = useNetworkNavigate();

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
      CreateDTimeUTC: format(new Date(), "yyyy-MM-dd"),
      CreateBy: "",
      TotalTimeAnalysis: 0,
      TimeRemain: format(new Date(), "HH:mm:ss"),
      listData: [],
    },
  });

  const data = watch("Lst_SvImp_AudioAnalysis");

  const columns = useColumn({ type: data?.AudioAnalysisType });

  const { data: getSeq, refetch: fetchSeq } = useQuery(
    ["getSeqAudioAnalysis"],
    async () => {
      if (code) {
        return;
      }
      const resp: any = await api.SvImpAudioAnalysis_GetAudioAnalysisCodeSys();
      setValue("AudioAnalysisCode", resp?.Data);
      return resp?.Data;
    }
  );

  const { data: listType } = useQuery(
    ["listTypeAnalysis"],
    api.MstAudioAnalysisType_GetAllActive
  );

  const { data: getData, refetch: fetchData } = useQuery(
    ["getDataSvImpAudioAnalysis", code],

    async () => {
      if (code) {
        const resp: any =
          await api.SvImpAudioAnalysis_GetByAudioAnalysisCodeSys(code);

        if (resp?.isSuccess) {
          if (
            resp?.Data?.Lst_SvImp_AudioAnalysis &&
            resp?.Data?.Lst_SvImp_AudioAnalysis[0]
          ) {
            const obj = resp?.Data?.Lst_SvImp_AudioAnalysis[0];

            const objDetail = {
              ...obj,
              TotalTimeAnalysis: Number(obj?.TotalTimeAnalysis?.toFixed(2)),
              TotalAudioAnalysisTime: Number(
                obj?.TotalAudioAnalysisTime?.toFixed(2)
              ),
              TotalAudioAnalysisRemainTime: Number(
                obj?.TotalAudioAnalysisRemainTime?.toFixed(2)
              ),
              TotalAudioAnalysisOkTime: Number(
                obj?.TotalAudioAnalysisOkTime?.toFixed(2)
              ),
              TotalAudioAnalysisFailTime: Number(
                obj?.TotalAudioAnalysisFailTime?.toFixed(2)
              ),
            };

            setValue("Lst_SvImp_AudioAnalysis", objDetail);
            setValue("listData", resp?.Data?.Lst_SvImp_AudioAnalysisDtl);
          }
        } else {
          showError({
            message: error(resp._strErrCode),
            _strErrCode: resp._strErrCode,
            _strTId: resp._strTId,
            _strAppTId: resp._strAppTId,
            _objTTime: resp._objTTime,
            _strType: resp._strType,
            _dicDebug: resp._dicDebug,
            _dicExcs: resp._dicExcs,
          });
        }

        return resp;
      }
    }
  );

  useEffect(() => {
    if (code) {
      fetchData();
    } else {
      fetchSeq();
    }
  }, []);

  const handleEdit = () => {
    setType("edit");
  };

  const handleUpdate = async () => {
    const SvImp_AudioAnalysis = {
      AudioAnalysisCodeSys: watch("Lst_SvImp_AudioAnalysis")
        .AudioAnalysisCodeSys,
      AudioAnalysisCode: watch("Lst_SvImp_AudioAnalysis").AudioAnalysisCode,
      NetworkID: watch("Lst_SvImp_AudioAnalysis").NetworkID,
      OrgID: watch("Lst_SvImp_AudioAnalysis").OrgID,
      AudioAnalysisType: watch("Lst_SvImp_AudioAnalysis").AudioAnalysisType,
    };

    const listData = watch("listData");

    const Lst_SvImp_AudioAnalysisDtl = listData.map((item: any) => {
      return {
        AudioId: item.AudioId,
        CallId: item.CallId,
      };
    });

    const resp: any = await api.SvImpAudioAnalysis_Save({
      SvImp_AudioAnalysis,
      Lst_SvImp_AudioAnalysisDtl,
    });

    if (resp.isSuccess) {
      toast.success(common("Update successfully!"), {
        onClose: handleCancel,
      });
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

  const handleDelete = async () => {
    const SvImp_AudioAnalysis = {
      AudioAnalysisCodeSys: watch("Lst_SvImp_AudioAnalysis")
        .AudioAnalysisCodeSys,
      AudioAnalysisCode: watch("Lst_SvImp_AudioAnalysis").AudioAnalysisCode,
      NetworkID: watch("Lst_SvImp_AudioAnalysis").NetworkID,
      OrgID: watch("Lst_SvImp_AudioAnalysis").OrgID,
    };

    const resp: any = await api.SvImpAudioAnalysis_Delete({
      SvImp_AudioAnalysis,
    });

    if (resp.isSuccess) {
      toast.success(common("Delete successfully!"), {
        onClose: handleCancel,
      });
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

  const handleSave = async () => {
    if (!watch("AudioAnalysisType")) {
      toast.error(t("Please choose AudioAnalysisType!"));
      return;
    }

    const SvImp_AudioAnalysis = {
      AudioAnalysisCodeSys: watch("AudioAnalysisCode"),
      AudioAnalysisCode: watch("AudioAnalysisCode"),
      AudioAnalysisType: watch("AudioAnalysisType"),
      NetworkID: auth?.networkId,
      OrgID: auth?.orgData?.Id,
    };

    const listData = watch("listData");

    const Lst_SvImp_AudioAnalysisDtl = listData.map((item: any) => {
      return {
        AudioId: item.AudioId,
        CallId: item.CallId,
      };
    });

    if (!Lst_SvImp_AudioAnalysisDtl || Lst_SvImp_AudioAnalysisDtl.length == 0) {
      toast.error(t("Please choose audio file!"));
      return;
    }

    const resp: any = await api.SvImpAudioAnalysis_Save({
      SvImp_AudioAnalysis,
      Lst_SvImp_AudioAnalysisDtl,
    });

    if (resp.isSuccess) {
      toast.success(common("Create successfully!"), {
        onClose: handleCancel,
      });
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

  const handleCancel = () => {
    navigate("/service/SvImpAudioAnalysis");
  };

  const handleConvert = async () => {
    const SvImp_AudioAnalysis = {
      AudioAnalysisCodeSys:
        watch("Lst_SvImp_AudioAnalysis")?.AudioAnalysisCodeSys ??
        watch("AudioAnalysisCode"),
    };

    const listData = watch("listData");

    const Lst_SvImp_AudioAnalysisDtl = listData.map((item: any) => {
      return {
        AudioId: item.AudioId,
        CallId: item.CallId,
      };
    });

    if (!Lst_SvImp_AudioAnalysisDtl || Lst_SvImp_AudioAnalysisDtl.length == 0) {
      toast.error(t("Please choose audio file!"));
      return;
    }

    const resp: any = await api.SvImpAudioAnalysisDtl_Process({
      SvImp_AudioAnalysis,
      Lst_SvImp_AudioAnalysisDtl,
    });

    if (resp.isSuccess) {
      setOpenWarning(true);
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

  const handleClose = () => {
    setOpenWarning(false);
  };

  const popupSettings = {};

  const formSettings = {};

  const handleSelectionChanged = () => {};

  const handleSavingRow = () => {};
  const handleEditorPreparing = () => {};
  const handleOnEditRow = () => {};
  const handleEditRowChanges = async () => {};
  const handleDeleteRows = async (data: any) => {
    const list = watch("listData");
    const result = list.filter((item: any) => !data.includes(item?.AudioId));

    const dur = await calculateTotalDuration(result);

    setValue("TotalTimeAnalysis", dur);

    setValue("listData", result);
  };
  const handleOpenPopup = () => {
    setOpen(true);
  };
  const handleAddAudio = async (data: any) => {
    const listData = watch("listData");

    const result = data.filter(
      (item: any) => !listData.includes(item?.AudioId)
    );

    const dur = await calculateTotalDuration(result);

    setValue("TotalTimeAnalysis", dur);
    setValue("listData", result);
  };

  const renderInfo = () => {
    if (!code) {
      return (
        <div className="flex flex-col mx-2 my-5 gap-4 relative">
          <div className="grid grid-cols-3 w-full">
            <div className="flex w-full gap-[20px]">
              <div className="w-[150px] font-semibold">
                {t("AudioAnalysisCode")}
              </div>
              <div className="">{watch("AudioAnalysisCode")}</div>
            </div>
            <div className="flex w-full gap-[20px]">
              <div className="w-[150px] font-semibold">
                {t("TotalTimeAnalysis")}
              </div>
              <div>{Number(watch("TotalTimeAnalysis")).toFixed(2)}</div>
            </div>
            <div className="flex w-full gap-[20px]">
              <div className="w-[150px] font-semibold">{t("CreateBy")}</div>
              <div>{auth?.currentUser?.Name}</div>
            </div>
          </div>
          <div className="grid grid-cols-3">
            <div className="flex w-full gap-[20px]">
              <div className="w-[150px] font-semibold">
                {t("Type")}
                <span className="text-red-500">*</span>
              </div>
              <div className="flex flex-col">
                <SelectBox
                  dataSource={listType?.DataList ?? []}
                  valueExpr="AudioAnalysisType"
                  displayExpr="AudioAnalysisTypeName"
                  onValueChanged={(e: any) => {
                    setValue("AudioAnalysisType", e.value);
                  }}
                  value={watch("AudioAnalysisType")}
                  width={160}
                />
                {!watch("AudioAnalysisType") && (
                  <div className="text-[11px] text-red-500">
                    {validate("AudioAnalysisType is required!")}
                  </div>
                )}
              </div>
            </div>
            <div className="flex w-full gap-[20px]">
              <div className="w-[150px] font-semibold">{t("TotalAudio")}</div>
              <div>{watch("listData")?.length}</div>
            </div>

            <div className="flex w-full gap-[20px]">
              <div className="w-[150px] font-semibold">
                {t("CreateDTimeUTC")}
              </div>
              <div>{watch("CreateDTimeUTC")}</div>
            </div>
          </div>

          {/*  */}

          <div className="bg-[#FFDCDC] h-[30px] absolute right-[6px] top-[-32px] rounded-[5px] flex items-center px-2 gap-2">
            <TimeIcon />
            <div className="text-[#FF004A] font-semibold">
              {t("Time remain: ")}
              {watch("TimeRemain")}
            </div>
          </div>
        </div>
      );
    }

    if (code) {
      if (data?.AudioAnalysisType == "AUDIOTOSOUNDVALUE") {
        const crType = listType?.DataList?.find((item: any) => {
          return item.AudioAnalysisType == data?.AudioAnalysisType;
        })?.AudioAnalysisTypeName;

        return (
          <div className="flex flex-col mx-2 my-5 gap-4 relative">
            <div className="grid grid-cols-3 w-full">
              <div className="flex w-full gap-[20px]">
                <div className="w-[150px] font-semibold">
                  {t("AudioAnalysisCode")}
                </div>
                <div className="">{data?.AudioAnalysisCodeSys}</div>
              </div>
              <div className="flex w-full gap-[20px]">
                <div className="w-[200px] font-semibold">{t("TotalAudio")}</div>
                <div>{data?.TotalAudio}</div>
              </div>
              <div className="flex w-full gap-[20px]">
                <div className="w-[200px] font-semibold">
                  {t("TotalAudioAnalysisFail")}
                </div>
                <div>{data?.TotalAudioAnalysisFail}</div>
              </div>
            </div>

            <div className="grid grid-cols-3">
              <div className="flex w-full gap-[20px]">
                <div className="w-[150px] font-semibold">
                  {t("AudioAnalysisType")}
                </div>
                <div>
                  {/* {data?.CreateDTimeUTC
                    ? format(
                        new Date(data?.CreateDTimeUTC),
                        "yyyy-MM-dd"
                      ).toString()
                    : "---"} */}
                  {crType}
                </div>
              </div>
              <div className="flex w-full gap-[20px]">
                <div className="w-[200px] font-semibold">
                  {t("TotalAudioAnalysisRemain")}
                </div>
                <div>{data?.TotalAudioAnalysisRemain}</div>
              </div>
              <div className="flex w-full gap-[20px]">
                <div className="w-[200px] font-semibold">{t("CreateBy")}</div>
                <div>{data?.CreateBy}</div>
              </div>
            </div>

            <div className="grid grid-cols-3">
              <div className="flex w-full gap-[20px]">
                <div className="w-[150px] font-semibold">
                  {t("CreateDTimeUTC")}
                </div>
                <div>
                  {data?.CreateDTimeUTC
                    ? format(
                        new Date(data?.CreateDTimeUTC),
                        "yyyy-MM-dd"
                      ).toString()
                    : "---"}
                </div>
              </div>
              <div className="flex w-full gap-[20px]">
                <div className="w-[200px] font-semibold">
                  {t("TotalAudioAnalysisOk")}
                </div>
                <div>{data?.TotalAudioAnalysisOk}</div>
              </div>
              <div className="flex w-full gap-[20px]">
                <div className="w-[200px] font-semibold">
                  {t("AudioAnalysisStatus")}
                </div>
                <div>
                  <AudioStatus content={data?.AudioAnalysisStatus} />
                </div>
              </div>
            </div>

            {/*  */}

            <div className="bg-[#FFDCDC] h-[30px] absolute right-[6px] top-[-32px] rounded-[5px] flex items-center px-2 gap-2">
              <TimeIcon />
              <div className="text-[#FF004A] font-semibold">
                {t("Time remain: ")}
                {watch("TimeRemain")}
              </div>
            </div>
          </div>
        );
      }
      if (data?.AudioAnalysisType == "SPEECHTOTEXT") {
        const crType = listType?.DataList?.find((item: any) => {
          return item.AudioAnalysisType == data?.AudioAnalysisType;
        })?.AudioAnalysisTypeName;

        return (
          <div className="flex flex-col mx-2 my-5 gap-4 relative">
            <div className="grid grid-cols-3 w-full">
              <div className="flex w-full gap-[20px]">
                <div className="w-[150px] font-semibold">
                  {t("AudioAnalysisCode")}
                </div>
                <div className="">{data?.AudioAnalysisCodeSys}</div>
              </div>
              <div className="flex w-full gap-[20px]">
                <div className="w-[200px] font-semibold">{t("TotalAudio")}</div>
                <div>{data?.TotalAudio}</div>
              </div>
              <div className="flex w-full gap-[20px]">
                <div className="w-[200px] font-semibold">
                  {t("TotalTimeAnalysis")}
                </div>
                <div>{data?.TotalTimeAnalysis}</div>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="flex w-full gap-[20px]">
                <div className="w-[150px] font-semibold">
                  {t("AudioAnalysisType")}
                </div>
                <div>{crType}</div>
              </div>
              <div className="flex w-full gap-[20px]">
                <div className="w-[200px] font-semibold">
                  {t("TotalAudioAnalysisRemain")}
                </div>
                <div>{data?.TotalAudioAnalysisRemain}</div>
              </div>
              <div className="flex w-full gap-[20px]">
                <div className="w-[200px] font-semibold">
                  {t("TotalAudioAnalysisRemainTime")}
                </div>
                <div>{data?.TotalAudioAnalysisRemainTime}</div>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="flex w-full gap-[20px]">
                <div className="w-[150px] font-semibold">
                  {t("CreateDTimeUTC")}
                </div>
                <div>
                  {data?.CreateDTimeUTC
                    ? format(
                        new Date(data?.CreateDTimeUTC),
                        "yyyy-MM-dd"
                      ).toString()
                    : "---"}
                </div>
              </div>
              <div className="flex w-full gap-[20px]">
                <div className="w-[200px] font-semibold">
                  {t("TotalAudioAnalysisOk")}
                </div>
                <div>{data?.TotalAudioAnalysisOk}</div>
              </div>
              <div className="flex w-full gap-[20px]">
                <div className="w-[200px] font-semibold">
                  {t("TotalAudioAnalysisOkTime")}
                </div>
                <div>{data?.TotalAudioAnalysisOkTime}</div>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="flex w-full gap-[20px]">
                <div className="w-[150px] font-semibold">{t("CreateBy")}</div>
                <div>{data?.CreateBy}</div>
              </div>
              <div className="flex w-full gap-[20px]">
                <div className="w-[200px] font-semibold">
                  {t("TotalAudioAnalysisFail")}
                </div>
                <div>{data?.TotalAudioAnalysisFail}</div>
              </div>
              <div className="flex w-full gap-[20px]">
                <div className="w-[200px] font-semibold">
                  {t("TotalAudioAnalysisFailTime")}
                </div>
                <div>{data?.TotalAudioAnalysisFailTime}</div>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="flex w-full gap-[20px]">
                <div className="w-[150px] font-semibold">
                  {t("AudioAnalysisStatus")}
                </div>
                <div>
                  <AudioStatus content={data?.AudioAnalysisStatus} />
                </div>
              </div>
            </div>

            {/*  */}

            <div className="bg-[#FFDCDC] h-[30px] absolute right-[6px] top-[-32px] rounded-[5px] flex items-center px-2 gap-2">
              <TimeIcon />
              <div className="text-[#FF004A] font-semibold">
                {t("Time remain: ")}
                {watch("TimeRemain")}
              </div>
            </div>
          </div>
        );
      }
    }
  };

  const calculateTotalDuration = async (list: any) => {
    const result = await list.reduce(async (prevPromise: any, file: any) => {
      const prev = await prevPromise; // Wait for the previous promise to resolve

      const audio: any = document.createElement("AUDIO");
      audio.src = file.RecFilePathFull;

      const durationPromise = new Promise((resolve) => {
        audio.addEventListener("loadedmetadata", () => {
          resolve(audio.duration);
        });
      });

      const duration = await durationPromise; // Wait for the duration to be calculated

      return prev + duration;
    }, Promise.resolve(0)); // Initialize with a resolved promise and 0 as the initial accumulator

    return result / 60;
  };

  const renderTable = useMemo(() => {
    const fixedList =
      watch("listData")?.map((item: any) => {
        return {
          ...item,
          TalkTimeToMinutes: Number(item?.TalkTimeToMinutes?.toFixed(2)),
        };
      }) ?? [];

    return (
      <div className="w-full pb-[20px]">
        <GridViewPopup
          isLoading={false}
          dataSource={fixedList ?? []}
          columns={columns}
          keyExpr={"AudioId"}
          allowInlineEdit={false}
          popupSettings={popupSettings}
          formSettings={formSettings}
          onReady={(ref) => (gridRef = ref)}
          allowSelection={true}
          onSelectionChanged={handleSelectionChanged}
          onSaveRow={handleSavingRow}
          onEditorPreparing={handleEditorPreparing}
          onEditRow={handleOnEditRow}
          onEditRowChanges={handleEditRowChanges}
          onDeleteRows={handleDeleteRows}
          toolbarItems={[
            {
              visible: code && type == "detail" ? false : true,
              widget: "dxButton",
              toolbar: "bottom",
              location: "before",
              options: {
                text: t("Choose audio"),
                type: "primary",
                style: {
                  marginRight: 5,
                  background: "#00703c",
                  color: "white",
                },
                onClick: handleOpenPopup,
              },
            },
          ]}
          storeKey={"SvImpAudioAnalysisPage-columns"}
          height={500}
          checkboxMode={code && type == "detail" ? "none" : "always"}
          editable={code && type == "detail" ? false : true}
        />
      </div>
    );
  }, [watch("listData")]);

  return (
    <AdminContentLayout className="w-full">
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header flex justify-between items-center w-full px-2">
          <div className="breakcrumb flex gap-1">
            <NavNetworkLink
              to="/service/SvImpAudioAnalysis"
              className="text-black"
            >
              {t("SvImpAudioAnalysisManager")}
            </NavNetworkLink>
            <p>{`>`}</p>
            {code ? (
              type == "detail" ? (
                <p>{t("SvImpAudioAnalysis Detail")}</p>
              ) : (
                <p>{t("SvImpAudioAnalysis Edit")}</p>
              )
            ) : (
              <p>{t("SvImpAudioAnalysis Add")}</p>
            )}
          </div>
          <div className="flex">
            {data?.AudioAnalysisStatus == "PENDING" && type == "detail" && (
              <PermissionContainer
                permission={
                  "BTN_CHI_TIET_LAN_SU_DUNG_AI_PHAN_TICH_AM_THANH_BAT_DAU_CHUYEN_DOI"
                }
              >
                <Button
                  style={{
                    padding: 10,
                    margin: "10px 5px",
                    background: "#00703C",
                    color: "white",
                  }}
                  onClick={handleConvert}
                >
                  {common("Convert")}
                </Button>
              </PermissionContainer>
            )}

            {code &&
              data?.AudioAnalysisStatus == "PENDING" &&
              (type == "detail" ? (
                <PermissionContainer
                  permission={
                    "BTN_CHI_TIET_LAN_SU_DUNG_AI_PHAN_TICH_AM_THANH_SUA"
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
                    "BTN_CAP_NHAT_LAN_SU_DUNG_AI_PHAN_TICH_AM_THANH_LUU"
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
              ))}

            {!code && (
              <PermissionContainer
                permission={
                  "BTN_THEM_MOI_LAN_SU_DUNG_AI_PHAN_TICH_AM_THANH_LUU"
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

            {data?.AudioAnalysisStatus == "PENDING" && code && (
              <PermissionContainer
                permission={
                  "BTN_CHI_TIET_LAN_SU_DUNG_AI_PHAN_TICH_AM_THANH_XOA"
                }
              >
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
        {renderInfo()}

        <div className="separator"></div>

        {renderTable}

        <ChooseAudioPopup
          addAudio={handleAddAudio}
          listCheck={watch("listData")}
        />
        <Popup
          visible={openWarning}
          showCloseButton
          title={common("Warning")}
          width={450}
          height={300}
          toolbarItems={[
            {
              visible: checkPermision(
                "BTN_QUAN_LY_SU_DUNG_AI_PHAN_TICH_AM_THANH_TIM_KIEM"
              ),
              widget: "dxButton",
              toolbar: "bottom",
              location: "after",
              options: {
                text: common("Cancel"),
                type: "primary",
                style: {},
                onClick: handleClose,
              },
            },
          ]}
        >
          <p className="text-lg">
            {t(
              "The call list that needs to be converted has been successfully queued!"
            )}
          </p>
          <p className="text-lg">
            {t(
              "The conversion process can take a long time. You can close the screen and return to monitoring the conversion status at any time!"
            )}
          </p>
        </Popup>

        <PopupResult />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default SvImpAudioAnalysisPage;
