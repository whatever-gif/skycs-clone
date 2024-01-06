import { useI18n } from "@/i18n/useI18n";
import { searchPanelVisibleAtom } from "@layouts/content-searchpanel-layout";
import { useVisibilityControl } from "@packages/hooks";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { useSavedState } from "@packages/ui/base-gridview/components/use-saved-state";
import Form, { IItemProps } from "devextreme-react/form";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { Header } from "@/packages/ui/search-panel";
import { useQuery } from "@tanstack/react-query";
import { Button, DateRangeBox, SelectBox, TagBox } from "devextreme-react";
import { useAtomValue } from "jotai";
import { Controller, useForm } from "react-hook-form";
import { match } from "ts-pattern";

interface ItemProps extends IItemProps {
  order?: number;
}

interface DataProps {
  listOrg: any[];
  listUser: any[];
  listCampaign: any[];
}

interface SearchPanelProps {
  data?: any;
  onSearch?: (data: any) => void;
  storeKey: string;
  colCount?: number;
  enableColumnToggler?: boolean;
  permission?: string;
  height?: number;
  dataProps: DataProps;
}

export const CustomSearch = ({
  data,
  onSearch,
  storeKey,
  colCount = 1,
  enableColumnToggler = true,
  permission = "",
  height,
  dataProps,
}: SearchPanelProps) => {
  const { t } = useI18n("SvImpAudioAnalysis_Popup");

  const { t: common_status } = useI18n("Common_AudioAnalysis");

  const { t: common } = useI18n("Common");

  const { t: validate } = useI18n("Validate");

  const api = useClientgateApi();

  const { loadState, saveState } = useSavedState<ColumnOptions[]>({
    storeKey: `search-panel-settings-${storeKey}`,
  });

  const [currentData, setCurrentData] = useState<any>(data);

  useEffect(() => {
    const state = loadState();
    setCurrentData(state);
  }, []);

  const searchPanelVisible = useAtomValue(searchPanelVisibleAtom);

  const setSearchPanelVisible = useSetAtom(searchPanelVisibleAtom);
  const onToggleSettings = () => {
    settingPopupVisible.toggle();
  };
  const onClose = () => {
    setSearchPanelVisible(false);
  };

  const formRef: any = useRef<Form | null>(null);

  const refSubmitButton: any = useRef();

  const { auth } = useAuth();

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
    values: currentData,
  });

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

  const listStatus = [
    {
      label: common_status("PENDING"),
      value: "PENDING",
    },
    {
      label: common_status("SUCCESSED"),
      value: "SUCCESSED",
    },
  ];
  const watchDataSource = watch("DataSource");

  const getListDetail = match(watchDataSource)
    .with("CAMPAIGN", () => dataProps.listCampaign)
    .otherwise(() => []);

  const handleSearch = () => {
    refSubmitButton?.current?.click();
  };

  const onSubmit = (data: any) => {
    onSearch?.(data);
    saveState(data);
  };

  return (
    <div
      className={`${
        searchPanelVisible ? "search-panel-visible" : "search-panel-hidden"
      } h-full w-full  flex flex-col justify-between`}
      id={"search-panel"}
    >
      <Header
        enableColumnToggler={enableColumnToggler}
        onCollapse={onClose}
        onToggleSettings={onToggleSettings}
      />
      <form
        className="h-[380px] flex flex-col gap-3 overflow-auto pb-2"
        onSubmit={handleSubmit(onSubmit)}
        id="form"
        ref={formRef}
      >
        <Controller
          name={"DataSource"}
          control={control}
          render={({ field }) => {
            const { onChange, ref, ...rest } = field;

            return (
              <div className="flex flex-col gap-1">
                <label>{t("DataSource")}</label>
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
                <div className="flex flex-col">
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
                    disableOutOfRangeSelection
                    isValid={!errors?.StartDTime}
                    validationMessageMode="always"
                    validationMessagePosition="bottom"
                  ></DateRangeBox>
                  <p className="text-red-500 text-[11px] mt-1">
                    {errors?.StartDTime &&
                      errors?.StartDTime?.message &&
                      validate(errors?.StartDTime?.message?.toString())}
                  </p>
                </div>
              </div>
            );
          }}
          rules={{
            validate: (value: any) => {
              const d1: any = value?.[0];
              const d2: any = value?.[1];

              if (d1 && d2) {
                const result: any = new Date(d2) - new Date(d1);

                const condi = result / (1000 * 60 * 60 * 24);

                if (condi > 90) {
                  return validate("StartDTime is not valid!");
                } else {
                  return true;
                }
              } else {
                return true;
              }
            },
          }}
        />
        <Controller
          name={"OrgIDSearch"}
          control={control}
          render={({ field }) => {
            const { onChange, ref, ...rest } = field;

            return (
              <div className="flex flex-col gap-1">
                <label>{t("OrgIDSearch")}</label>
                <SelectBox
                  dataSource={dataProps.listOrg}
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
          name={"UserCode"}
          control={control}
          render={({ field }) => {
            const { onChange, ref, ...rest } = field;

            return (
              <div className="flex flex-col gap-1">
                <label>{t("UserCode")}</label>
                <TagBox
                  dataSource={dataProps.listUser}
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
                ></TagBox>
              </div>
            );
          }}
        />
        <Controller
          name={"AudioAnalysisStatus"}
          control={control}
          render={({ field }) => {
            const { onChange, ref, ...rest } = field;

            return (
              <div className="flex flex-col gap-1">
                <label>{t("AudioAnalysisStatus")}</label>
                <TagBox
                  dataSource={listStatus}
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

        <button
          hidden={true}
          ref={refSubmitButton}
          type={"submit"}
          form={"form"}
        />
      </form>
      <Button
        style={{
          background: "#00703C",
          color: "#fff",
        }}
        onClick={handleSearch}
      >
        {common("Search")}
      </Button>
    </div>
  );
};
