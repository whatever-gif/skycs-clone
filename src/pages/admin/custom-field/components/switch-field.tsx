import { useI18n } from "@/i18n/useI18n";
import { Switch } from "devextreme-react";

interface TextboxFieldProps {
  field: any;
  label: string;
  error?: any;
  required?: boolean;
  disabled?: boolean;
  direction?: string;
  props?: any;
  readOnly?: boolean;
  onValueChange?: any;
}

export const SwitchField = ({
  field,
  label,
  required = false,
  error,
  disabled,
  direction,
  props,
  readOnly = false,
  onValueChange,
}: TextboxFieldProps) => {
  const { onChange, ref, ...rest } = field;

  const { t } = useI18n("Placeholder");

  return (
    <div
      className={` flex ${
        direction == "vertical" ? "flex-col" : "items-center my-2"
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

      <Switch
        {...props}
        disabled={disabled}
        readOnly={readOnly}
        className={"w-full"}
        defaultValue={rest.value}
        onValueChanged={async (e: any) => {
          await onChange({
            target: {
              name: rest.name,
              value: e.value,
            },
          });
          if (onValueChange) {
            onValueChange(e);
          }
        }}
      />
    </div>
  );
};
