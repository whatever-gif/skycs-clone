import { useI18n } from "@/i18n/useI18n";
import { DateField } from "@/pages/admin/custom-field/components/date-field";
import { SwitchField } from "@/pages/admin/custom-field/components/switch-field";
import { TextareaField } from "@/pages/admin/custom-field/components/textarea-field";
import { TextboxField } from "@/pages/admin/custom-field/components/textbox-field";
import { forwardRef } from "react";
import { Controller } from "react-hook-form";
import "./style.scss";

const HeaderForm = forwardRef(({ control, type, errors }: any, ref: any) => {
  const { t } = useI18n("SLA_Form");
  const { t: validateMessage } = useI18n("Validate");

  return (
    <div className="p-2 grid grid-cols-2 gap-[50px]">
      <div className="flex flex-col sla-left flex-grow-1 ">
        <Controller
          name={"SLALevel"}
          control={control}
          render={({ field }) => {
            return (
              <TextboxField
                disabled={type == "detail"}
                field={field}
                label={t("SLALevel")}
                required={true}
                error={errors.SLALevel}
              />
            );
          }}
          rules={{
            required: {
              value: true,
              message: validateMessage("SLALevel is required!"),
            },
          }}
        />
        <Controller
          name={"SLADesc"}
          control={control}
          render={({ field }) => {
            return (
              <TextareaField
                disabled={type == "detail"}
                field={field}
                label={t("SLADesc")}
                required={true}
                error={errors.SLADesc}
              />
            );
          }}
          rules={{
            required: {
              value: true,
              message: validateMessage("SLADesc is required!"),
            },
          }}
        />
      </div>
      <div className="flex flex-col flex-grow-1 sla-right ">
        <Controller
          name={"FirstResTime"}
          control={control}
          render={({ field }) => {
            return (
              <DateField
                field={field}
                label={t("FirstResTime")}
                required={true}
                error={errors.FirstResTime}
                displayFormat="HH:mm"
                showClearButton={true}
                type="time"
                readOnly={type == "detail"}
              />
            );
          }}
          rules={{
            required: {
              value: true,
              message: validateMessage("FirstResTime is required!"),
            },
          }}
        />
        <Controller
          name={"ResolutionTime"}
          control={control}
          render={({ field }) => {
            return (
              <DateField
                field={field}
                label={t("ResolutionTime")}
                required={true}
                error={errors.ResolutionTime}
                displayFormat="HH:mm"
                showClearButton={true}
                type="time"
                readOnly={type == "detail"}
              />
            );
          }}
          rules={{
            required: {
              value: true,
              message: validateMessage("ResolutionTime is required!"),
            },
          }}
        />
        <Controller
          name={"SLAStatus"}
          control={control}
          render={({ field }) => {
            return (
              <SwitchField
                field={field}
                label={t("SLAStatus")}
                readOnly={type == "detail"}
              />
            );
          }}
        />
      </div>
    </div>
  );
});

export default HeaderForm;
