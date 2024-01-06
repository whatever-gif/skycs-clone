import { useVisibilityControl } from "@packages/hooks";
import { GroupHeader } from "@packages/ui/group-header";
import Form, { SimpleItem } from "devextreme-react/form";

export interface GroupFieldProps {
  item: any;
  formData: any;
  disableCollapsible?: boolean;
}
export const GroupField = ({
  item,
  formData,
  disableCollapsible,
}: GroupFieldProps) => {
  const control = useVisibilityControl({ defaultVisible: true });

  // console.log("item ", item);

  return (
    <div className={"form-group"}>
      <GroupHeader
        caption={item.caption}
        control={control}
        disableCollapsible={disableCollapsible}
      />
      <Form
        visible={control.visible}
        className={control.visible ? "normal-content" : "collapsible-content"}
        readOnly={true}
        formData={formData}
        colCount={2}
      >
        {item.items?.map((subItem: any, subIndex: number) => {
          return <SimpleItem {...subItem} key={subIndex} colSpan={1} />;
        })}
      </Form>
    </div>
  );
};
