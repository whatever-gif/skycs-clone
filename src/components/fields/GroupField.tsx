import { useVisibilityControl } from "@packages/hooks";
import { GroupHeader } from "@packages/ui/group-header";
import Form, { GroupItem, Item } from "devextreme-react/form";
import { nanoid } from "nanoid";

export interface GroupFieldProps {
  item: any;
  formData: any;
  disableCollapsible?: boolean;
  readOnly?: boolean;
}
export const GroupField = ({
  item,
  formData,
  disableCollapsible,
  readOnly = true,
}: GroupFieldProps) => {
  const control = useVisibilityControl({ defaultVisible: true });
  return (
    <div className={"form-group"}>
      <GroupHeader
        caption={item.caption}
        control={control}
        disableCollapsible={disableCollapsible}
      />
      <Form
        visible={control.visible}
        className={`${
          control.visible ? "normal-content" : "collapsible-content"
        }`}
        formData={formData}
        validationGroup="customerData"
        onInitialized={() => {}}
        labelLocation="left"
        showRequiredMark={true}
        labelMode="outside"
        readOnly={readOnly}
        style={{ padding: 10 }}
      >
        {item.items?.map((subItem: any, subIndex: number) => {
          return (
            <GroupItem
              colCount={subItem.colCount}
              key={subIndex}
              cssClass={subItem.cssClass}
              itemType={subItem.itemType}
            >
              {subItem?.items.map((c: any) => {
                return <Item {...c} key={nanoid()} name={c?.ColCodeSys} />;
              })}
            </GroupItem>
          );
        })}
      </Form>
    </div>
  );
};
