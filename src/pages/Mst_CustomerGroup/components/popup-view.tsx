import { useI18n } from "@/i18n/useI18n";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import {
  Button,
  Form,
  List,
  LoadPanel,
  Popup,
  ScrollView,
} from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import DataGrid, {
  Column,
  Editing,
  FilterRow,
  Item,
  Paging,
  Selection,
  Toolbar,
} from "devextreme-react/data-grid";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToolbarItemProps } from "@/packages/ui/base-gridview";
import { logger } from "@/packages/logger";
import {
  avatar,
  dataFormAtom,
  dataTableAtom,
  fileAtom,
  flagEdit,
  isLoadingAtom,
  showDetail,
  showPopup,
  viewingDataAtom,
} from "./store";
import { useClientgateApi } from "@/packages/api";
import UploadAvatar from "./UploadAvatar";

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
  const flagCheckCRUD = useAtomValue(flagEdit);
  const formRef = useRef<any>();
  const ref = useRef<any>();
  const validateRef = useRef<any>();
  const { t } = useI18n("Common");
  const dataRef = useRef<any>(null);
  const detailForm = useAtomValue(showDetail);
  const [dataTable, setDataTable] = useAtom(dataTableAtom);
  const [dataForm, setDataForm] = useAtom(dataFormAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const [value, setValue] = useState("");
  const [avt, setAvt] = useAtom(avatar);
  const setFile = useSetAtom(fileAtom);
  const [isloading, setIsLoading] = useAtom(isLoadingAtom);

  const api = useClientgateApi();

  const handleCancel = () => {
    setFile(undefined);
    setPopupVisible(false);
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

  const handleSubmitPopup = useCallback(
    async (e: any) => {
      validateRef.current.instance.validate();
      const dataForm = new FormData(formRef.current);
      const dataSaveForm: any = Object.fromEntries(dataForm.entries()); // chuyển thành form chính
      const repsUpload = await api.SysUserData_UploadFile(avt);

      const formSubmit = {
        ...dataSaveForm,
        CustomerGrpImage: repsUpload?.Data?.FileUrlFS
          ? repsUpload?.Data?.FileUrlFS
          : "",
      };
      if (flagCheckCRUD) {
        onCreate(formSubmit);
      } else {
        onEdit(formSubmit);
      }
    },
    [avt]
  );

  const handleDatatable = (e: any) => {
    console.log(122, e.component.totalCount());
  };
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
      if (["OrgID", "CustomerGrpCode"].includes(item.dataField)) {
        if (flagCheckCRUD === false) {
          item.editorOptions.readOnly = true;
        } else {
          item.editorOptions.readOnly = false;
        }
        if (detailForm === true) {
          item.editorOptions.readOnly = true;
        }
      }
      if (["FlagActive"].includes(item.dataField)) {
        item.editorOptions.value = true;
      }
    },
    [value, flagCheckCRUD, detailForm]
  );

  const handleFieldDataChanged = (changedData: any) => {
    // Handle the changed field data
    if (changedData.dataField === "EMail") {
    }
  };

  return (
    <Popup
      visible={popupVisible}
      showTitle={true}
      title={title}
      width={980}
      height={"auto"}
      wrapperAttr={{
        class: "popup-form-department",
      }}
      toolbarItems={[
        {
          visible: !detailForm,
          toolbar: "bottom",
          location: "after",
          widget: "dxButton",
          options: {
            text: flagCheckCRUD ? t("Save") : t("Edit"),
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
        },
      ]}
    >
      <LoadPanel
        container={".dx-viewport"}
        position={"center"}
        visible={isloading}
        showIndicator={true}
        showPane={true}
      />
      <ScrollView height={"100%"}>
        <div className="flex justify-between">
          <div>
            <UploadAvatar
              data={flagCheckCRUD ? undefined : avt}
              setAvt={setAvt}
            />
          </div>
          <div className="w-[77%]">
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
                <SimpleItem />
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
            <div
              className={`mt-2 hidden ${
                formSettings.filter(
                  (item: any) => item.typeForm === "TableForm"
                )[0].hidden
                  ? "hidden"
                  : ""
              }`}
            >
              <DataGrid
                ref={dataRef}
                id="gridContainer"
                dataSource={dataTable}
                keyExpr="ID"
                onSaved={innerSavingRowHandler}
                noDataText={t("There is no data")}
                remoteOperations={false}
                columnAutoWidth={true}
                repaintChangesOnly
                allowColumnReordering={true}
                showColumnLines
                showRowLines
                showBorders
                width={"100%"}
              >
                <Toolbar>
                  {!!toolbarItems &&
                    toolbarItems.map((item, index) => {
                      return (
                        <Item key={index} location={item.location}>
                          {item.widget === "dxButton" && (
                            <Button {...item.options} />
                          )}
                          {!!item.render && item.render()}
                        </Item>
                      );
                    })}
                </Toolbar>
                <Editing
                  mode="row"
                  allowUpdating={!detailForm}
                  allowDeleting={!detailForm}
                  allowAdding={!detailForm}
                />
                {formSettings
                  .filter((item: any) => item.typeForm === "TableForm")
                  .map((value: any) =>
                    value.items.map((item: any) => {
                      return <Column key={item.caption} {...item} />;
                    })
                  )}
              </DataGrid>
            </div>
          </div>
        </div>
      </ScrollView>
    </Popup>
  );
};
