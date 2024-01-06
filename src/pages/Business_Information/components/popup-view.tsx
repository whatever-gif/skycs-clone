import { useI18n } from "@/i18n/useI18n";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { checkPermision } from "@/components/PermissionContainer";
import { useClientgateApi } from "@/packages/api";
import { ToolbarItemProps } from "@/packages/ui/base-gridview";
import { useQuery } from "@tanstack/react-query";
import { Form, Popup, ScrollView } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useCallback, useRef, useState } from "react";
import {
  activeInputAtom,
  dataFormAtom,
  flagEdit,
  readOnly,
  showDetail,
  showPopup,
} from "./store";

export interface DealerPopupViewProps {
  onEdit: any;
  formSettings: any;
  title: string;
  onCreate: any;
  formRef: any;
}

export const PopupView = ({
  onEdit,
  formSettings,
  title,
  onCreate,
  formRef,
}: DealerPopupViewProps) => {
  const popupVisible = useAtomValue(showPopup);
  const [value, setValue] = useState("Business_Information-popup");
  const ref = useRef<any>();
  const validateRef = useRef<any>();
  const { t } = useI18n("");
  const dataRef = useRef<any>(null);
  const setPopupVisible = useSetAtom(showPopup);
  const [dataForm, setDataForm] = useAtom(dataFormAtom);
  const flagCheckCRUD = useAtomValue(flagEdit);
  const activeInput = useAtomValue(activeInputAtom);
  const detailForm = useAtomValue(showDetail);
  const readonly = useAtomValue(readOnly);

  const api = useClientgateApi();

  const { data: listOrgNNTActive } = useQuery(["listOrgIDNNTActive"], () =>
    api.MstOrg_GetOrgsNotInSolution()
  );
  const { data: listNNTActive } = useQuery(["listNNTActive"], () =>
    api.Mst_NNTController_GetAllActive()
  );
  const handleCancel = () => {
    setPopupVisible(false);
    // dataGrid.current?.instance.deselectRows(selectedItems[0]);
  };

  const toolbarItems: ToolbarItemProps[] = [
    {
      location: "before",
      render: (e) => {
        return <div>{t("Danh sách các thành viên")}</div>;
      },
    },
    {
      widget: "dxButton",
      location: "after",
      options: {
        text: t("Thêm thành viên"),
        stylingMode: "contained",
        onClick: (e: any) => {
          dataRef.current.instance.addRow();
        },
      },
    },
  ];

  const handleSubmitPopup = (e: any) => {
    const dataForm = new FormData(formRef.current);
    const dataSaveForm: any = Object.fromEntries(dataForm.entries()); // chuyển thành form chính
    validateRef.current.instance.validate();
    const invalidate = validateRef.current.instance.validate();
    const dataSave = {
      ...dataSaveForm,
      invalidate: invalidate.isValid,
    };
    if (flagCheckCRUD) {
      onCreate(dataSave);
    } else if (!flagCheckCRUD) {
      onEdit(dataSave);
    }
  };

  const handleDatatable = (e: any) => {};
  const innerSavingRowHandler = (e: any) => {
    if (e.changes && e.changes.length > 0) {
      // we don't enable batch mode, so only 1 change at a time.
      const { type } = e.changes[0];
      if (type === "insert" || type === "update") {
        // pass handle to parent page
        handleDatatable?.(e);
      } else {
        // set selected keys, then open the confirmation
        // setDeletingId(e.changes[0].key);
        // // show the confirmation box of Delete single case
        // controlDeleteSingleConfirmBox.open();
        // // this one to clear `changes` set from grid.
        // dataGridRef.current?.instance.cancelEditData();
      }
    }
    e.cancel = true;
  };

  const customizeItem = useCallback(
    (item: any) => {
      if (["OrgID"].includes(item.dataField) && readonly === false) {
        item.editorOptions.readOnly = true;
        // item.editorOptions.dataSource = listNNTActive?.DataList ?? [];
        // item.editorOptions.displayExpr = "OrgID";
        // item.editorOptions.valueExpr = "OrgID";
      }
      if (item.dataField === "FlagActive") {
        if (flagCheckCRUD === true) {
          item.editorOptions.value = true;
        } else {
          item.editorOptions.value = dataForm.FlagActive;
        }
      }

      if (["MST"].includes(item.dataField) && readonly === false) {
        item.editorOptions.readOnly = true;
      } else if (["MST"].includes(item.dataField) && readonly === true) {
        item.editorOptions.readOnly = false;
      }
      if (
        ["NNTFullName", "NNTAddress"].includes(item.dataField) &&
        readonly === false
      ) {
        item.editorOptions.readOnly = true;
      }
      if (
        ["OrgID", "NNTFullName", "NNTAddress"].includes(item.dataField) &&
        readonly === true
      ) {
        item.editorOptions.readOnly = false;
      }
      if (
        ["NNTFullName", "NNTAddress"].includes(item.dataField) &&
        activeInput === true
      ) {
        item.editorOptions.readOnly = false;
      }
    },
    [dataForm, listNNTActive?.DataList, activeInput, flagCheckCRUD]
  );

  const handleFieldDataChanged = useCallback(
    (changedData: any) => {
      if (changedData.dataField === "OrgID") {
        setValue(changedData.value);
        if (
          listOrgNNTActive?.Data?.Lst_Mst_Org.find(
            (item: any) => item.Id === Number(changedData.value)
          )
        ) {
          setValue(changedData.value);
          const dataLookUP = listOrgNNTActive?.Data?.Lst_Mst_Org.find(
            (item: any) => item.Id === Number(changedData.value)
          );
          setDataForm({
            ...dataLookUP,
            OrgID: dataLookUP.Id.toString(),
            NNTFullName: dataLookUP.Name ?? "",
            ContactEmail: dataLookUP.Email ?? "",
            ContactPhone: dataLookUP.PhoneNo ?? "",
            FlagActive: dataLookUP.FlagActive === null ? false : true,
          });
        }
      }
    },
    [listOrgNNTActive?.Data?.Lst_Mst_Org]
  );

  return (
    <Popup
      visible={popupVisible}
      showTitle={true}
      title={title}
      width={870}
      wrapperAttr={{
        class: "popup-form-department",
      }}
      toolbarItems={[
        {
          visible:
            checkPermision("BTN_ADMIN_BUSINESS_INFORMATION_CREATE_SAVE") &&
            !detailForm,
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
          toolbar: "bottom",
          location: "after",
          widget: "dxButton",
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
        <form action="" ref={formRef} onSubmit={handleSubmitPopup}>
          <Form
            ref={validateRef}
            validationGroup="customerData"
            onInitialized={(e) => {
              validateRef.current = e.component;
            }}
            readOnly={detailForm}
            formData={dataForm}
            labelLocation="top"
            customizeItem={customizeItem}
            onFieldDataChanged={handleFieldDataChanged}
          >
            {formSettings
              .filter((item: any) => item.typeForm === "textForm")
              .map((value: any) => {
                return (
                  <GroupItem colCount={value.colCount}>
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
      </ScrollView>
    </Popup>
  );
};
