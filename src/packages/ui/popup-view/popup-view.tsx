import Form, { GroupItem } from "devextreme-react/form";
import { Popup } from "devextreme-react/popup";
import { useI18n } from "@/i18n/useI18n";
import ScrollView from "devextreme-react/scroll-view";
import { nanoid } from "nanoid";
import { GroupField } from "@packages/ui/group-field";
import { FormOptions } from "@/types";

export interface PopupViewProps {
  visible?: boolean;
  handleCancel: () => void;
  handleEdit: () => void;
  formSettings: FormOptions;
  title: string;
  data: any;
}

export const PopupView = ({
  visible,
  handleCancel,
  handleEdit,
  formSettings,
  title,
  data,
}: PopupViewProps) => {
  const { t } = useI18n("Common");

  const innerHandleCancel = () => {
    handleCancel();
  };
  const innerHandleEdit = () => {
    // console.log("data ", data);
    handleEdit();
  };
  return (
    <Popup
      visible={visible}
      showTitle={true}
      title={title}
      height={"auto"}
      wrapperAttr={{
        class: "popup-form",
      }}
      toolbarItems={[
        {
          toolbar: "bottom",
          location: "after",
          widget: "dxButton",
          options: {
            text: t("Edit"),
            stylingMode: "contained",
            type: "default",
            onClick: innerHandleEdit,
          },
        },
        {
          toolbar: "bottom",
          location: "after",
          widget: "dxButton",
          options: {
            text: t("Cancel"),
            type: "default",
            onClick: innerHandleCancel,
          },
        },
      ]}
    >
      <ScrollView height={"100%"}>
        <Form className={""} id={"view-form"} formData={data} readOnly={true}>
          {formSettings.items?.map((item) => {
            return (
              <GroupItem
                key={nanoid()}
                render={({}) => {
                  return (
                    <GroupField
                      item={item}
                      formData={data}
                      disableCollapsible={item.disableCollapsible}
                    />
                  );
                }}
              />
            );
          })}
        </Form>
      </ScrollView>
    </Popup>
  );
};
