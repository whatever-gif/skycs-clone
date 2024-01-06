import { TagBox } from "devextreme-react";
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
  showClearButton?: boolean;
  direction?: string;
  props?: any;
}
export const TagBoxField = ({
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
  props,
}: SelectboxFieldProps) => {
  const { onChange, ref, ...rest } = field;

  return (
    <div
      className={`flex ${
        direction == "vertical" ? "flex-col" : "items-center my-[6px] "
      }  ${required ? "required" : ""} ${!!error ? "mb-4" : ""}`}
    >
      <label
        htmlFor={rest.name}
        className={`${
          direction == "vertical"
            ? "w-full"
            : "w-[160px] min-w-[160px] pr-[10px]"
        } break-all`}
      >
        {label}
      </label>
      <TagBox
        // {...rest}
        {...props}
        defaultValue={rest.value}
        name={rest.name}
        readOnly={readonly}
        // deferRendering={true}
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
          // onValueChanged?.(e.value);
        }}
        validationMessagePosition={"bottom"}
        validationMessageMode={"always"}
        searchEnabled
        searchExpr={displayExpr}
        showClearButton={showClearButton}
      ></TagBox>
    </div>
  );
};
