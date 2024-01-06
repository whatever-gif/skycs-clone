import { RadioGroup } from "devextreme-react";
import { useEffect } from "react";
interface RadioBoxFieldProps {
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
}
export const RadioBoxField = ({
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
  customSelection,
}: RadioBoxFieldProps) => {
  const { onChange, ref, ...rest } = field;

  useEffect(() => {
    onChange({
      target: {
        name: rest.name,
        value:
          dataSource?.find((item: any) => item?.IsSelected)?.Value ??
          dataSource?.[0]?.Value,
      },
    });
  }, []);

  const handleChanged = async (e: any) => {
    await onChange({
      target: {
        name: rest.name,
        value: e.value,
      },
    });
  };

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
      {/* <SelectBox
        {...props}
        {...rest}
        readOnly={readonly}
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
      </SelectBox> */}
      <RadioGroup
        {...props}
        // {...rest}
        dataSource={dataSource}
        valueExpr={valueExpr}
        displayExpr={displayExpr}
        defaultValue={defaultValue}
        isValid={!error}
        validationError={error}
        onValueChanged={handleChanged}
      />
    </div>
  );
};
