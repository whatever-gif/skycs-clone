import { useI18n } from "@/i18n/useI18n";
import { searchPanelVisibleAtom } from "@layouts/content-searchpanel-layout";
import { useConfiguration, useVisibilityControl } from "@packages/hooks";
import Form, { IItemProps } from "devextreme-react/form";
import { useSetAtom } from "jotai";
import { forwardRef, useRef } from "react";

import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { Header } from "@/packages/ui/search-panel";
import { useQuery } from "@tanstack/react-query";
import { Button, DateRangeBox, SelectBox, TagBox } from "devextreme-react";
import { useAtomValue } from "jotai";
import { Controller, useForm } from "react-hook-form";
import { match } from "ts-pattern";
import CloseIcon from "./CloseIcon";
import "./style.scss";

interface ItemProps extends IItemProps {
  order?: number;
}

const defaultAvatar =
  "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180";

export const CustomSearch = forwardRef(
  ({ handleTrigger, setFormValue, formValue }: any, ref: any) => {
    const { t } = useI18n("SvImpAudioAnalysis_Popup");

    const { t: common_status } = useI18n("Common_AudioAnalysis");

    const { t: common } = useI18n("Common");

    const api = useClientgateApi();

    const config = useConfiguration();

    const searchPanelVisible = useAtomValue(searchPanelVisibleAtom);

    const setSearchPanelVisible = useSetAtom(searchPanelVisibleAtom);
    const onToggleSettings = () => {
      settingPopupVisible.toggle();
    };
    const onClose = () => {
      setSearchPanelVisible(false);
    };

    const { data: listOrg } = useQuery(["getListOrg"], async () => {
      const resp: any = await api.Mst_NNTController_GetAllActive();

      return resp?.Data?.Lst_Mst_NNT ?? [];
    });

    const { data: listUser } = useQuery(["getListUser"], async () => {
      const resp: any = await api.Sys_User_GetAllActive();

      return resp?.DataList ?? [];
    });

    const {
      register,
      reset,
      unregister,
      watch,
      control,
      handleSubmit,
      setError,
      setValue,
      getValues,
      formState: { errors },
    } = useForm<any>({
      // values: searchCondition,
      values: formValue,
    });

    const { t: validate } = useI18n("Validate");

    const settingPopupVisible = useVisibilityControl({ defaultVisible: false });

    const dataSource = [
      {
        label: t("Incoming Call"),
        value: "INCOMINGCALL",
      },
      {
        label: t("Outgoing Call"),
        value: "OUTGOINGCALL",
      },
      {
        label: t("Campagin"),
        value: "CAMPAIGN",
      },
      {
        label: t("All"),
        value: "ALL",
      },
    ];

    const { data: listCampaign } = useQuery(["listCpnActive"], async () => {
      const resp: any = await api.Cpn_CampaignAgent_GetActive();

      return (
        resp?.Data?.map((item: any) => {
          return {
            value: item?.CampaignCode,
            label: item?.CampaignName,
          };
        }) ?? []
      );
    });

    const watchDataSource = watch("DataSource");

    const getListDetail = match(watchDataSource)
      .with("CAMPAIGN", () => listCampaign)
      .otherwise(() => []);

    const onSubmit = (data: any) => {
      if (!data.DataSource) {
        setValue("searched", true);
        return;
      } else {
        setFormValue({ ...data, searched: true });
      }
    };

    return (
      <div
        className={`${
          searchPanelVisible ? "search-panel-visible" : "search-panel-hidden"
        } w-full flex flex-col justify-between pb-4 relative h-[85vh]`}
        id={"search-panel"}
      >
        <Header
          enableColumnToggler={false}
          onCollapse={onClose}
          onToggleSettings={onToggleSettings}
        />
        <form
          className="h-full flex flex-col gap-3 overflow-auto pb-2 px-1"
          onSubmit={handleSubmit(onSubmit)}
          id="form"
          // ref={formRef}
        >
          <Controller
            name={"DataSource"}
            control={control}
            render={({ field }) => {
              const { onChange, ref, ...rest } = field;

              return (
                <div>
                  <div
                    className={`flex flex-col gap-1 ${
                      errors.DataSource && "mb-1"
                    }`}
                  >
                    <label>
                      {t("DataSource")} <span className="text-red-500">*</span>
                    </label>
                    <SelectBox
                      dataSource={dataSource}
                      valueExpr="value"
                      displayExpr="label"
                      onValueChanged={async (e: any) => {
                        await onChange({
                          target: {
                            name: rest.name,
                            value: e.value,
                          },
                        });
                      }}
                      defaultValue={rest.value}
                    ></SelectBox>
                  </div>
                  <div>
                    {!watch("DataSource") && (
                      <p className="text-red-500 text-[11px] mt-1">
                        {validate("DataSource is required!")}
                      </p>
                    )}
                  </div>
                </div>
              );
            }}
          />

          <Controller
            name={"DetailDataSource"}
            control={control}
            render={({ field }) => {
              const { onChange, ref, ...rest } = field;

              return (
                <div className="flex flex-col gap-1">
                  <label>{t("DetailDataSource")}</label>
                  <TagBox
                    dataSource={getListDetail}
                    valueExpr="value"
                    displayExpr="label"
                    onValueChanged={async (e: any) => {
                      await onChange({
                        target: {
                          name: rest.name,
                          value: e.value,
                        },
                      });
                    }}
                    defaultValue={rest.value}
                  ></TagBox>
                </div>
              );
            }}
          />
          <Controller
            name={"StartDTime"}
            control={control}
            render={({ field }) => {
              const { onChange, ref, ...rest } = field;

              return (
                <div className="flex flex-col gap-1">
                  <label>{t("StartDTime")}</label>
                  <DateRangeBox
                    displayFormat="yyyy-MM-dd"
                    startDateLabel=""
                    endDateLabel=""
                    onValueChanged={async (e: any) => {
                      await onChange({
                        target: {
                          name: rest.name,
                          value: e.value,
                        },
                      });
                    }}
                    defaultValue={rest.value}
                    showClearButton
                  ></DateRangeBox>
                </div>
              );
            }}
          />
          <Controller
            name={"OrgIDRpt"}
            control={control}
            render={({ field }) => {
              const { onChange, ref, ...rest } = field;

              return (
                <div className="flex flex-col gap-1">
                  <label>{t("OrgIDRpt")}</label>
                  <SelectBox
                    dataSource={listOrg}
                    valueExpr="OrgID"
                    displayExpr="NNTFullName"
                    onValueChanged={async (e: any) => {
                      await onChange({
                        target: {
                          name: rest.name,
                          value: e.value,
                        },
                      });
                    }}
                    defaultValue={rest.value}
                  ></SelectBox>
                </div>
              );
            }}
          />
          <Controller
            name={"UserCodeConditionList"}
            control={control}
            render={({ field }) => {
              const { onChange, ref, ...rest } = field;

              return (
                <div className="flex flex-col gap-1">
                  <label>{t("UserCodeConditionList")}</label>
                  <TagBox
                    dataSource={listUser}
                    valueExpr="UserCode"
                    displayExpr="UserName"
                    onValueChanged={async (e: any) => {
                      await onChange({
                        target: {
                          name: rest.name,
                          value: e.value,
                        },
                      });
                    }}
                    defaultValue={rest.value}
                    tagRender={(e: any) => {
                      return (
                        <div className="bg-[#EAF9F2] px-1 py-1 rounded-[20px] mb-1 flex items-center gap-1 tagbox-custom">
                          <img
                            src={e.Avatar ?? defaultAvatar}
                            alt=""
                            className="w-[24px] h-[24px] rounded-[50%] shadow-sm"
                          />
                          <div>{e.UserName}</div>
                          <div className="dx-tag-remove-button flex items-center justify-center">
                            <CloseIcon />
                          </div>
                        </div>
                      );
                    }}
                    searchEnabled
                  ></TagBox>
                </div>
              );
            }}
          />

          <button hidden={true} ref={ref} type={"submit"} form={"form"} />
        </form>

        <Button
          style={{
            background: "#00703C",
            color: "#fff",
            // bottom: "-250px",
          }}
          className="custom-btn"
          onClick={handleTrigger}
        >
          {common("Analysis")}
        </Button>
      </div>
    );
  }
);
