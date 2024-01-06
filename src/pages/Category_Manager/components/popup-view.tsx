import { useI18n } from "@/i18n/useI18n";
import { useAtomValue, useSetAtom } from "jotai";

import { checkPermision } from "@/components/PermissionContainer";
import { Form, Popup, ScrollView } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useCallback, useRef } from "react";
import {
  bottomAtom,
  dataFormAtom,
  flagEditAtom,
  showDetail,
  showPopup,
} from "./store";

export interface DealerPopupViewProps {
  onEdit: any;
  formSettings: any;
  title: string;
  onCreate: any;
}

export const PopupView = ({
  onEdit,
  onCreate,
  formSettings,
  title,
}: DealerPopupViewProps) => {
  const popupVisible = useAtomValue(showPopup);
  const formRef = useRef<any>();
  const validateRef = useRef<any>();
  const { t } = useI18n("Category_Manager_poppup");
  const detailForm = useAtomValue(showDetail);
  const flagEdit = useAtomValue(flagEditAtom);
  const bottom = useAtomValue(bottomAtom);
  const dataFrom = useAtomValue(dataFormAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setflagEdit = useSetAtom(flagEditAtom);
  const setshowDetail = useSetAtom(showDetail);

  const handleCancel = () => {
    setPopupVisible(false);
    setflagEdit(false);
  };
  const onNoClick = () => {
    setPopupVisible(false);
    setflagEdit(false);
  };

  const handleSubmitPopup = (e: any) => {
    const dataForm = new FormData(formRef.current);
    const dataSaveForm: any = Object.fromEntries(dataForm.entries()); // chuyển thành form chính
    validateRef.current.instance.validate();
    const dataSave = {
      ...dataSaveForm,
      CategoryCode: validateRef.current.props.formData?.CategoryCode,
    };

    if (!flagEdit) {
      onCreate(dataSave);
    } else {
      onEdit(dataSave);
    }
  };

  const customizeItem = (item: any) => {
    if (item.dataField === "FlagActive") {
      item.editorOptions.value = dataFrom.FlagActive === "0" ? false : true;
    }
  };

  const handleFieldDataChanged = useCallback((changedData: any) => {
    // Handle the changed field data
  }, []);
  const handleChangeEdit = () => {
    setshowDetail(false);
    setflagEdit(true);
  };
  const handleChangeEditData = () => {
    const dataForm = new FormData(formRef.current);
    const dataSaveForm: any = Object.fromEntries(dataForm.entries()); // chuyển thành form chính
    validateRef.current.instance.validate();
    const dataSave = {
      ...dataSaveForm,
      CategoryCode: validateRef.current.props.formData.CategoryCode,
    };
    onEdit(dataSave);
  };

  const check = checkPermision("BTN_ADMIN_CAMPAIGN_CATEGORYMANAGER_UPDATE");

  return (
    <Popup
      visible={popupVisible}
      showTitle={true}
      title={title}
      showCloseButton={true}
      onHiding={onNoClick}
      width={600}
      height={370}
      wrapperAttr={{
        class: "popup-form-Category",
      }}
      toolbarItems={[
        {
          visible: (bottom === false ? true : false) && check,
          toolbar: "bottom",
          location: "after",
          widget: "dxButton",
          options: {
            text: t("Save"),
            stylingMode: "contained",
            type: "count",
            onClick: handleSubmitPopup,
          },
        },
        {
          // visible: bottom === true ? true : false,
          visible: check,
          toolbar: "bottom",
          location: "after",
          widget: "dxButton",
          options: {
            text: !flagEdit ? t("Edit") : t("Save"),
            stylingMode: "contained",
            type: "count",
            onClick: flagEdit ? handleChangeEditData : handleChangeEdit,
          },
        },
        {
          toolbar: "bottom",
          location: "after",
          widget: "dxButton",
          visible: true,
          options: {
            text: t("Cancel"),
            type: "default",
            onClick: handleCancel,
          },
          cssClass: "CancelBTN",
        },
      ]}
    >
      <ScrollView height={"100%"}>
        <div className="w-full">
          <form action="" ref={formRef} onSubmit={handleSubmitPopup}>
            <Form
              ref={validateRef}
              validationGroup="customerData"
              onInitialized={(e) => {
                validateRef.current = e.component;
              }}
              readOnly={detailForm}
              formData={dataFrom}
              labelLocation="left"
              customizeItem={customizeItem}
              onFieldDataChanged={handleFieldDataChanged}
            >
              <SimpleItem />
              {formSettings
                .filter((item: any) => item.typeForm === "textForm")
                .map((value: any, index: any) => {
                  return (
                    <GroupItem colCount={value.colCount} key={index}>
                      {value.items.map((items: any) => {
                        return (
                          <GroupItem colSpan={items.colSpan}>
                            {items.items.map((valueFrom: any) => {
                              return (
                                <SimpleItem
                                  key={valueFrom.caption}
                                  {...valueFrom}
                                />
                              );
                            })}
                          </GroupItem>
                        );
                      })}
                    </GroupItem>
                  );
                })}
            </Form>
          </form>
        </div>
      </ScrollView>
    </Popup>
  );
};
