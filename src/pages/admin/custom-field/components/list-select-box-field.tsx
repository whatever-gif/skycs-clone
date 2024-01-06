import { CheckBox } from "devextreme-react";
import { nanoid } from "nanoid";

interface listSelectBoxProps {
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
export const ListSelectBoxField = ({
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
}: listSelectBoxProps) => {
  const { onChange, ref, ...rest } = field;

  const handleChange = async (value: any, index: any) => {
    const result = rest.value
      ? rest.value?.map((item: any, i: any) => {
          if (index == i) {
            return {
              ...item,
              IsSelected: value,
            };
          }
          return item;
        })
      : dataSource?.map((item: any, i: any) => {
          if (index == i) {
            return {
              ...item,
              IsSelected: value,
            };
          }
          return item;
        });

    await onChange({
      target: {
        name: rest.name,
        value: result,
      },
    });
  };

  return (
    <>
      <div
        className={`flex w-full ${
          direction == "vertical" ? "flex-col" : "items-center my-2"
        }  ${required ? "required" : ""} `}
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

        <div className="grid grid-cols-4 gap-1 w-full ">
          {dataSource?.map((item: any, index: any) => {
            const checked = rest.value?.find(
              (c: any) => c?.Value == item?.Value && c?.IsSelected
            );

            return (
              <CheckBox
                text={item?.Value}
                onValueChanged={(e: any) => {
                  handleChange(e.value, index);
                }}
                value={checked ? true : false}
                key={nanoid()}
                // value={rest?.value?.[index]?.IsSelected}
              />
            );
          })}
        </div>
      </div>
      {error && (
        <span className="text-[#f44336] text-[0.85em] pl-[11px]">
          {error.message}
        </span>
      )}
    </>
  );
};
