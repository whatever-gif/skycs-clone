import { SelectBox, Validator } from "devextreme-react";
import { RequiredRule } from "devextreme-react/form";
interface SelectboxFieldProps {
  field: any;
  label: string;
  dataSource: any;
  valueExpr?: string;
  displayExpr: string;
  required?: boolean;
  error?: any;
  defaultValue?: string;
  onValueChanged?: any;
  readonly?: boolean;
  showClearButton?: boolean;
  direction?: string;
  width?: number;
  customFunction?: any;
  props?: any;
  acceptOnchange?: boolean;
  customSelection?: any;
  disabled?: boolean;
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
  showClearButton,
  direction,
  width,
  customFunction,
  props,
  acceptOnchange = true,
  disabled = false,
  customSelection,
}: SelectboxFieldProps) => {
  const { onChange, ref, ...rest } = field;

  return (
    <div
      className={`relative flex ${width ? `${width + 200}px` : "w-full"} ${
        direction == "vertical" ? "flex-col" : "items-center my-[6px] "
      }  ${required ? "required" : ""} ${error && "mb-2"} `}
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

      <SelectBox
        {...props}
        {...rest}
        readOnly={readonly}
        disabled={disabled}
        deferRendering={true}
        id={rest.name}
        className={width ? `w-[${width}px]` : "w-full"}
        dataSource={dataSource}
        valueExpr={valueExpr}
        displayExpr={displayExpr}
        // defaultValue={value}
        isValid={!error}
        validationError={error}
        onValueChanged={async (e: any) => {
          acceptOnchange &&
            (await onChange({
              target: {
                name: rest.name,
                value: e.value,
              },
            }));
          onValueChanged && onValueChanged(e.value);
          customFunction && customFunction(e);
        }}
        validationMessagePosition={"bottom"}
        validationMessageMode={"always"}
        searchEnabled
        searchExpr={displayExpr}
        showClearButton={showClearButton}
        onSelectionChanged={customSelection}
      >
        <Validator>
          {required && <RequiredRule message={"This field is required"} />}
        </Validator>
      </SelectBox>
    </div>
  );
};
