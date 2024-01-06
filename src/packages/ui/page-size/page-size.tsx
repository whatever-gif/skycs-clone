import { SelectBox } from "devextreme-react";

interface Props {
  title: string;
  onChangePageSize: (pageSize: number) => void;
  defaultPageSize?: number;
  showAllOption?: boolean;
  showAllOptionText?: string;
  allowdPageSizes: number[];
}
export const PageSize = ({
  title,
  allowdPageSizes,
  showAllOption,
  showAllOptionText = "Show All",
  onChangePageSize,
  defaultPageSize,
}: Props) => {
  let options = allowdPageSizes.map((item) => ({
    value: item,
    text: item + "",
  }));
  if (showAllOption) {
    options.push({ value: 9999999, text: showAllOptionText });
  }
  return (
    <div className={"min-w-fit flex items-center page-size"}>
      <label className={"mr-2"}>{title}</label>
      <SelectBox
        items={options}
        displayExpr={"text"}
        valueExpr={"value"}
        className={"flex w-[80px] mx-1"}
        placeholder={""}
        defaultValue={defaultPageSize ?? allowdPageSizes[0]}
        onValueChanged={(e) => onChangePageSize?.(e.value)}
      />
    </div>
  );
};
