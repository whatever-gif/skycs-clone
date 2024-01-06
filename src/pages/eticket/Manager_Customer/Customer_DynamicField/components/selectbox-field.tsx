import { SelectBox, Validator } from "devextreme-react";
import { RequiredRule } from "devextreme-react/form";
import { useEffect, useState } from "react";
import { readOnly } from "@/pages/Business_Information/components/store";
interface SelectboxFieldProps {
  field: any;
  label: string;
  dataSource: any;
  valueExpr: string;
  displayExpr: string;
  required?: boolean;
  error?: any;
  defaultValue?: string;
  onValueChanged?: (dataType: string) => void;
  readonly?: boolean;
}
export const SelectboxField = ({
  field,
  error,
  label,
  dataSource,
  valueExpr = "value",
  displayExpr = "text",
  required = false,
  defaultValue,
  onValueChanged,
  readonly,
}: SelectboxFieldProps) => {
  const { onChange, ref, ...rest } = field;
  const [value, setValue] = useState(defaultValue);
  return (
    <div
      className={`my-2 flex items-center ${required ? "required" : ""} ${
        !!error ? "mb-4" : ""
      }`}
    >
      <label htmlFor={rest.name} className={"w-[150px]"}>
        {label}
      </label>
      <SelectBox
        {...rest}
        readOnly={readonly}
        deferRendering={true}
        id={rest.name}
        className={"w-full"}
        dataSource={dataSource}
        valueExpr={valueExpr}
        displayExpr={displayExpr}
        // defaultValue={value}
        isValid={!error}
        validationError={error}
        onValueChanged={async (e: any) => {
          await onChange({
            target: {
              name: rest.name,
              value: e.value,
            },
          });
          onValueChanged?.(e.value);
        }}
        validationMessagePosition={"bottom"}
        validationMessageMode={"always"}
      >
        <Validator>
          {required && <RequiredRule message={"This field is required"} />}
        </Validator>
      </SelectBox>
    </div>
  );
};
