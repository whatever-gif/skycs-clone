import { useI18n } from "@/i18n/useI18n";
import { NumberBox } from "devextreme-react";

interface NumberBoxFieldProps {
  field: any;
  label: string;
  error?: any;
  required?: boolean;
  disabled?: boolean;
  direction?: string;
  props?: any;
  showPlaceholder?: boolean;
}

export const NumberBoxField = ({
  field,
  label,
  required = false,
  error,
  disabled,
  direction,
  props,
  showPlaceholder = true,
}: NumberBoxFieldProps) => {
  const { onChange, ref, ...rest } = field;

  const { t } = useI18n("Placeholder");

  return (
    <div
      className={` flex ${
        direction == "vertical" ? "flex-col" : "items-center my-[6px] "
      }  ${required ? "required" : ""} ${!!error ? "mb-4" : ""}`}
    >
      <label
        className={`${
          direction == "vertical"
            ? "w-full"
            : "w-[160px] min-w-[160px] pr-[10px]"
        } break-all`}
      >
        {label}
      </label>
      <NumberBox
        {...props}
        disabled={disabled ? true : false}
        {...rest}
        className={"w-full"}
        defaultValue={rest.value}
        isValid={!error}
        validationError={error}
        validationMessagePosition={"bottom"}
        validationMessageMode={"always"}
        placeholder={showPlaceholder ? t("Input") : ""}
        // max={100}
        onValueChanged={async (e: any) => {
          await onChange({
            target: {
              name: rest.name,
              value: e.value,
            },
          });
        }}
      />
    </div>
  );
};
