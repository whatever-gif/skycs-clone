import NavNetworkLink from "@/components/Navigate";
import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useNetworkNavigate } from "@/packages/hooks";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { getDay, getMonth } from "@/utils/time";
import { useQuery } from "@tanstack/react-query";
import { Button, Tabs } from "devextreme-react";
import { Item } from "devextreme-react/tabs";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import HeaderForm from "../components/header-form";
import { defaultTicketInfo, ticketInfo } from "../components/store";
import "../components/style.scss";
import TabOne from "./TabOne/TabOne";
import TabTwo from "./TabTwo/TabTwo";
import { initWorkingTimeList } from "./TabTwo/tabs/WorkingTime/store";

interface formValue {
  SLALevel: string;
  SLADesc: string;
  FirstResTime: string;
  ResolutionTime: string;
  SLAStatus: "0" | "1";
}

const SLA_PageDemo = () => {
  const { SLAID, nav }: any = useParams();

  const refSubmitButton: any = useRef();

  const { t: tabTranslate } = useI18n("SLA_Tabs");

  const { t: toastTranslate } = useI18n("SLA_Notify");

  const { t: breadcrumb } = useI18n("SLA_Breadcrumb");

  const { t: buttonTranslate } = useI18n("SLA_Button");

  const { t } = useI18n("ErrorMessage");

  const { type } = useParams();

  const headerFormRef: any = useRef();

  const tabOneRef: any = useRef();

  const api = useClientgateApi();

  const navigate = useNetworkNavigate();

  const { auth } = useAuth();

  const showError = useSetAtom(showErrorAtom);

  const setTicketInfo = useSetAtom(ticketInfo);

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
      Lst_Mst_SLAWorkingDay: initWorkingTimeList,
      Lst_Mst_SLAHoliday: [],
      SLALevel: "",
      SLADesc: "",
      FirstResTime: -21600000,
      ResolutionTime: -21600000,
      SLAStatus: true,
    },
  });

  const workingTime = watch("Lst_Mst_SLAWorkingDay");

  const { data, isLoading, refetch }: any = useQuery(
    ["Mst_SLA_Deatail", SLAID],
    async () => {
      if (!SLAID) {
        setTicketInfo(defaultTicketInfo);
        return;
      }
      const resp: any = await api.Mst_SLA_GetBySLAID(SLAID);

      if (resp.isSuccess && SLAID && resp?.Data) {
        const firstTime =
          (resp?.Data?.Mst_SLA?.FirstResTime / 60 - 420) * 60000;

        const resolutionTime =
          (resp?.Data?.Mst_SLA?.ResolutionTime / 60 - 420) * 60000;

        setValue("SLALevel", resp?.Data?.Mst_SLA?.SLALevel);

        setValue("SLADesc", resp?.Data?.Mst_SLA?.SLADesc);

        setValue("SLAStatus", resp?.Data?.Mst_SLA?.SLAStatus == "1");

        setValue("FirstResTime", firstTime);

        setValue("ResolutionTime", resolutionTime);

        setValue(
          "TicketType",
          resp?.Data?.Lst_Mst_SLATicketType?.filter(
            (item: any) => item?.TicketType
          )?.map((item: any) => {
            return item?.TicketType;
          }) || []
        );

        setValue(
          "TicketCustomType",
          resp?.Data?.Lst_Mst_SLATicketCustomType?.filter(
            (item: any) => item?.TicketCustomType
          )?.map((item: any) => item?.TicketCustomType) || []
        );

        setValue(
          "Customer",
          resp?.Data?.Lst_Mst_SLACustomerCN.filter(
            (item: any) => item?.CustomerCodeSys
          )?.map((item: any) => {
            return item?.CustomerCodeSys;
          }) || []
        );

        setValue(
          "CustomerGroup",
          resp?.Data?.Lst_Mst_SLACustomerGroupCN?.filter(
            (item: any) => item?.CustomerGrpCode
          )?.map((item: any) => {
            return item?.CustomerGrpCode;
          }) || []
        );

        setValue(
          "CustomerEnterprise",
          resp?.Data?.Lst_Mst_SLACustomerDN?.filter(
            (item: any) => item?.CustomerCodeSys
          )?.map((item: any) => {
            return item?.CustomerCodeSys;
          }) || []
        );
        setValue(
          "CustomerEnterpriseGroup",
          resp?.Data?.Lst_Mst_SLACustomerGroupDN?.filter(
            (item: any) => item?.CustomerGrpCode
          )?.map((item: any) => {
            return item?.CustomerGrpCode;
          }) || []
        );

        if (resp?.Data?.Lst_Mst_SLAHoliday) {
          setValue(
            "Lst_Mst_SLAHoliday",
            resp?.Data?.Lst_Mst_SLAHoliday?.filter(
              (item: any) => item?.SLAHoliday
            )?.map((item: any) => {
              return {
                Day: getDay(item?.SLAHoliday),
                Month: getMonth(item?.SLAHoliday),
                Event: item?.SLAHolidayName,
                id: nanoid(),
              };
            }) ?? []
          );
        }

        if (resp?.Data?.Lst_Mst_SLAWorkingDay) {
          const list: any = resp?.Data?.Lst_Mst_SLAWorkingDay;

          const currentList = workingTime.map((item: any) => {
            const findItem = list?.filter(
              (c: any) => c?.SLAWorkingDayCode == item.Day
            );
            if (findItem && findItem?.length > 0) {
              return {
                ...item,
                Check: true,
                hasMoreSlide: findItem?.length == 2,
                Slider: item.Slider.map((s: any) => {
                  const f = findItem.find((fc: any) => fc.Idx == s.Idx);
                  if (f) {
                    return {
                      ...s,
                      TimeStart: f.WorkingDTimeFrom,
                      TimeEnd: f.WorkingDTimeTo,
                    };
                  }
                  return s;
                }),
              };
            }
            return item;
          });

          const resultFlag247 = currentList?.some((item: any) => {
            return (
              item?.Check &&
              item?.hasMoreSlide &&
              item?.Slider?.[0]?.TimeStart == 0 &&
              item?.Slider?.[1]?.TimeStart == 0 &&
              item?.Slider?.[0]?.TimeEnd == 1440 &&
              item?.Slider?.[1]?.TimeEnd == 1440
            );
          });

          if (resultFlag247) {
            setValue("Flag247", true);
          }

          setValue("Lst_Mst_SLAWorkingDay", currentList);
        }
        return resp;
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
        handleCancel();
      }
    }
  );

  useEffect(() => {
    if (SLAID) {
      refetch();
    }
  }, [SLAID]);

  const handleEdit = () => {
    navigate(`/admin/SLADemoPage/edit/${SLAID}`);
  };

  const handleCancel = () => {
    navigate(`/admin/SLADemo`);
  };

  const handleSave = async () => {
    refSubmitButton?.current?.click();
  };

  const onSubmit = async (e: any) => {
    const Lst_Mst_SLATicketType =
      e.TicketType?.map((item: any) => {
        return {
          TicketType: item,
        };
      }) ?? [];

    const Lst_Mst_SLATicketCustomType =
      e.TicketCustomType?.map((item: any) => {
        return {
          TicketCustomType: item,
        };
      }) ?? [];

    const Lst_Mst_SLACustomerCN =
      e.Customer?.map((item: any) => {
        return {
          CustomerCodeSys: item,
        };
      }) ?? [];

    const Lst_Mst_SLACustomerDN =
      e.CustomerEnterprise?.map((item: any) => {
        return {
          CustomerCodeSys: item,
        };
      }) ?? [];

    const Lst_Mst_SLACustomerGroupCN =
      e.CustomerGroup?.map((item: any) => {
        return {
          CustomerGrpCode: item,
        };
      }) ?? [];

    const Lst_Mst_SLACustomerGroupDN =
      e.CustomerEnterpriseGroup?.map((item: any) => {
        return {
          CustomerGrpCode: item,
        };
      }) ?? [];

    const Lst_Mst_SLAHoliday =
      e.Lst_Mst_SLAHoliday?.map((item: any) => {
        return {
          SLAHoliday: `${`0${item.Day}`.slice(-2)}-${`0${item.Month}`.slice(
            -2
          )}`,
          SLAHolidayName: item.Event,
        };
      }) ?? [];

    const Lst_Mst_SLAWorkingDay =
      e.Lst_Mst_SLAWorkingDay.filter((item: any) => item.Check).reduce(
        (prev: any, cur: any) => {
          if (cur.hasMoreSlide) {
            cur.Slider.map((c: any) => {
              prev.push({
                SLAWorkingDayCode: cur.Day,
                WorkingDTimeFrom: c.TimeStart,
                WorkingDTimeTo: c.TimeEnd,
                Idx: c.Idx,
              });
            });
          } else {
            prev.push({
              SLAWorkingDayCode: cur.Day,
              WorkingDTimeFrom: cur.Slider[0].TimeStart,
              WorkingDTimeTo: cur.Slider[0].TimeEnd,
              Idx: cur.Slider[0].Idx,
            });
          }
          return prev;
        },
        []
      ) ?? [];

    const Mst_SLA = {
      SLAID: type == "add" ? "" : SLAID,
      OrgID: auth.orgData?.Id,
      ANDConditionDetails: null,
      ORConditionDetails: null,
      EveryResTime: "",
      ...e,
      SLAStatus: e.SLAStatus ? "1" : "0",
      FirstResTime: (Math.floor(e.FirstResTime / 60000) + 420) * 60,
      ResolutionTime: (Math.floor(e.ResolutionTime / 60000) + 420) * 60,
      FlagAllTicketCustomType:
        Lst_Mst_SLATicketCustomType.length > 0 ? "0" : "1",
      FlagAllTicketType: Lst_Mst_SLATicketType.length > 0 ? "0" : "1",
      FlagAllCustomerCN: Lst_Mst_SLACustomerCN.length > 0 ? "0" : "1",
      FlagAllCustomerDN: Lst_Mst_SLACustomerCN.length > 0 ? "0" : "1",
      FlagAllCustomerGrpCN: Lst_Mst_SLACustomerGroupCN.length > 0 ? "0" : "1",
      FlagAllCustomerGrpDN: Lst_Mst_SLACustomerGroupDN.length > 0 ? "0" : "1",
    };

    const result = {
      Mst_SLA,
      Lst_Mst_SLATicketType,
      Lst_Mst_SLATicketCustomType,
      Lst_Mst_SLACustomerCN,
      Lst_Mst_SLACustomerDN,
      Lst_Mst_SLACustomerGroupCN,
      Lst_Mst_SLACustomerGroupDN,
      Lst_Mst_SLAHoliday,
      Lst_Mst_SLAWorkingDay,
    };

    if (type == "add") {
      const resp: any = await api.Mst_SLA_Create(result);

      if (resp.isSuccess) {
        toast.success(toastTranslate("Create successfully!"), {
          onClose: handleCancel,
          delay: 500,
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
    } else {
      const resp: any = await api.Mst_SLA_Update(result);

      if (resp.isSuccess) {
        toast.success(toastTranslate("Update successfully!"), {
          onClose: handleCancel,
          delay: 500,
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
    }
  };

  const handleDelete = async () => {
    const req = {
      Mst_SLA: {
        SLAID: SLAID,
        OrgID: auth.orgData?.Id,
      },
      Lst_Mst_SLATicketType: [],
      Lst_Mst_SLATicketCustomType: [],
      Lst_Mst_SLACustomer: [],
      Lst_Mst_SLACustomerGroup: [],
      Lst_Mst_SLAHoliday: [],
      Lst_Mst_SLAWorkingDay: [],
    };

    const resp: any = await api.Mst_SLA_Delete(req);

    if (resp.isSuccess) {
      toast.success(toastTranslate("Delete successfully!"), {
        onClose: handleCancel,
        delay: 500,
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

  const matchTitle = () => {
    return match(type)
      .with("add", () => <p>{breadcrumb("Add SLA")}</p>)
      .with("edit", () => <p>{breadcrumb("Update SLA")}</p>)
      .otherwise(() => <p>{breadcrumb("Detail SLA")}</p>);
  };

  const tabOptions = [
    {
      text: tabTranslate("Set the scope of application of SLA"),
      key: 0,
      component: <TabOne ref={tabOneRef} control={control}></TabOne>,
    },
    {
      text: tabTranslate("Establish a support timeframe"),
      key: 1,
      component: <TabTwo control={control} watch={watch} setValue={setValue} />,
    },
  ];

  const [currentTab, setCurrentTab] = useState<any>(0);

  const currentComponent = useMemo(
    () => tabOptions.find((item: any) => item.key == currentTab)?.component,
    [currentTab]
  );

  return (
    <AdminContentLayout className={""}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header flex justify-between items-center w-full px-2 py-2">
          <div className="breakcrumb flex gap-1">
            {nav ? (
              <NavNetworkLink
                to={`/admin/SLADemoPage/detail/${SLAID}`}
                className="text-black"
              >
                {breadcrumb("Detail SLA")}
              </NavNetworkLink>
            ) : (
              <NavNetworkLink to="/admin/SLADemo" className="text-black">
                {breadcrumb("SLA List")}
              </NavNetworkLink>
            )}
            <p>{`>`}</p>
            {matchTitle()}
          </div>
          {SLAID && type == "detail" && (
            <div>
              <PermissionContainer permission={"BTN_ADMIN_SLA_DTLSLA_UPDATE"}>
                <Button
                  style={{
                    padding: 10,
                    margin: 5,
                    color: "white",
                    background: "#00703c",
                  }}
                  onClick={handleEdit}
                >
                  {buttonTranslate("Edit")}
                </Button>
              </PermissionContainer>
              <PermissionContainer permission={"BTN_ADMIN_SLA_DTLSLA_DELETE"}>
                <Button
                  style={{
                    padding: 10,
                    margin: 5,
                  }}
                  onClick={handleDelete}
                >
                  {buttonTranslate("Delete")}
                </Button>
              </PermissionContainer>
            </div>
          )}

          {SLAID && type == "edit" && (
            <div>
              <PermissionContainer permission={"BTN_ADMIN_SLA_DTLSLA_UPDATE"}>
                <Button
                  style={{
                    padding: 10,
                    margin: 5,
                    color: "white",
                    background: "#00703c",
                  }}
                  onClick={handleSave}
                >
                  {buttonTranslate("Update")}
                </Button>
              </PermissionContainer>

              <Button
                style={{
                  padding: 10,
                  margin: 5,
                }}
                onClick={handleCancel}
              >
                {buttonTranslate("Cancel")}
              </Button>
            </div>
          )}

          {(!SLAID || type == "create") && (
            <div>
              <PermissionContainer permission={"BTN_ADMIN_SLA_LIST_CREATE"}>
                <Button
                  style={{
                    padding: 10,
                    margin: 5,
                    color: "white",
                    background: "#00703c",
                  }}
                  onClick={handleSave}
                >
                  {buttonTranslate("Save")}
                </Button>
              </PermissionContainer>
              <Button
                style={{
                  padding: 10,
                  margin: 5,
                }}
                onClick={handleCancel}
              >
                {buttonTranslate("Cancel")}
              </Button>
            </div>
          )}
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <form className="px-[20px]" id="form" onSubmit={handleSubmit(onSubmit)}>
          <HeaderForm
            ref={headerFormRef}
            control={control}
            type={type}
            errors={errors}
          />

          <Tabs
            selectedIndex={currentTab}
            onItemClick={(value: any) => {
              setCurrentTab(value.itemIndex);
            }}
          >
            {tabOptions?.map((item: any) => {
              return (
                <Item
                  render={() => <div className="normal-case">{item?.text}</div>}
                ></Item>
              );
            })}
          </Tabs>

          {currentComponent}

          <button
            hidden={true}
            ref={refSubmitButton}
            type={"submit"}
            form={"form"}
          />
        </form>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
export default SLA_PageDemo;
