import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { SelectBox } from "devextreme-react";
import { forwardRef } from "react";
import { Controller, useForm } from "react-hook-form";

const CustomType = forwardRef(({ setFormValue, formValue }: any, ref: any) => {
  const api = useClientgateApi();

  const { t } = useI18n("RptCallAnalysisByWaitTime");
  const { t: validate } = useI18n("Validate");

  const { data: listSvImprvActive } = useQuery(
    ["listSvImprvActive_callconversationcontent"],
    async () => {
      const resp: any = await api.SvImpSvImprv_GetAllActive();

      return (
        resp?.Data?.Lst_SvImp_SvImprv?.filter(
          (item: any) => item?.SvImprvItType == "CALLCONVERSATIONCONTENT"
        ) ?? []
      );
    }
  );

  const {
    register,
    reset,
    unregister,
    watch,
    control,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = useForm<any>({
    values: formValue,
  });

  const onSubmit = (data: any) => {
    if (!data.SvImprvCodeSys) {
      // setValue("searched", true);
      return;
    } else {
      setFormValue({ ...data, searched: true });
    }
  };

  return (
    <form
      className="flex flex-col gap-3 overflow-auto pb-2 px-1 "
      onSubmit={handleSubmit(onSubmit)}
      id="form1"
    >
      <Controller
        name={"SvImprvCodeSys"}
        control={control}
        render={({ field }) => {
          const { onChange, ref, ...rest } = field;

          return (
            <div
              className={`flex gap-1 justify-center pt-2 ${
                errors.SvImprvCodeSys && "mb-1"
              }`}
            >
              <label className="mt-[5px]">
                {t("SvImprvCodeSys")} <span className="text-red-500">*</span>
              </label>
              <div>
                <SelectBox
                  dataSource={listSvImprvActive}
                  valueExpr="SvImprvCodeSys"
                  displayExpr="SvImprvName"
                  onValueChanged={async (e: any) => {
                    await onChange({
                      target: {
                        name: rest.name,
                        value: e.value,
                      },
                    });
                  }}
                  defaultValue={rest.value}
                  width={500}
                  searchEnabled
                ></SelectBox>
                <div>
                  {!watch("SvImprvCodeSys") && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {validate("SvImprvCodeSys is required!")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        }}
      />

      <button hidden={true} ref={ref} type={"submit"} form={"form1"} />
    </form>
  );
});

export default CustomType;
