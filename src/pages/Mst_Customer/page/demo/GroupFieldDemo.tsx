import { useVisibilityControl } from "@packages/hooks";
import { GroupHeader } from "@packages/ui/group-header";
import { Controller } from "react-hook-form";
import { getController } from "./customer-field";

export interface GroupFieldProps {
  item: any;
  formData: any;
  disableCollapsible?: boolean;
  readOnly?: boolean;
  control: any;
}
export const GroupFieldDemo = ({
  item,
  formData,
  disableCollapsible,
  readOnly = true,
  control,
}: GroupFieldProps) => {
  const controlGroup = useVisibilityControl({ defaultVisible: true });

  const listItem = item?.items?.[0]?.items ?? [];

  const renderController = (item: any) => {
    return (
      <Controller
        name={item?.ColCodeSys}
        control={control}
        render={({ field }) => {
          return getController({
            currentField: item,
            controllerField: field,
            label: item?.label?.text,
            currentError: null,
            dataType: item?.ColDataType,
          });
        }}
      />
    );
  };

  const odd = listItem?.filter((_: any, i: any) => i % 2 != 0);

  const even = listItem?.filter((_: any, i: any) => i % 2 == 0);

  return (
    <div className={"form-group my-4"}>
      <GroupHeader
        caption={item.caption}
        control={controlGroup}
        disableCollapsible={disableCollapsible}
      />

      <div
        className={`${controlGroup.visible ? "flex" : "hidden"} w-full gap-4`}
      >
        <div className="flex flex-col w-[50%] gap-1">
          {even?.map((c: any) => {
            return renderController(c);
          })}
        </div>
        <div className="flex flex-col w-[50%] gap-1">
          {odd?.map((c: any) => {
            return renderController(c);
          })}
        </div>
      </div>
    </div>
  );
};
