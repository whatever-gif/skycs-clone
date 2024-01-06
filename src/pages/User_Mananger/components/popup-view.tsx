import { useI18n } from "@/i18n/useI18n";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { Button, Form, LoadPanel, Popup, ScrollView } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import DataGrid, {
  Column,
  Editing,
  Item,
  Toolbar,
} from "devextreme-react/data-grid";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToolbarItemProps } from "@/packages/ui/base-gridview";
import {
  avatar,
  dataFormAtom,
  dataTableAtom,
  fileAtom,
  flagEdit,
  isLoadingAtom,
  showDetail,
  showPopup,
} from "./store";
import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { viewingDataAtom } from "@/pages/User_Mananger/components/store";
import UploadAvatar from "./UploadAvatar";
import { authAtom } from "@/packages/store";
import { isExists } from "date-fns";
import { match } from "ts-pattern";

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
  const { t } = useI18n("User_Mananger-popup");
  const dataRef = useRef<any>(null);
  const detailForm = useAtomValue(showDetail);
  const [dataTable, setDataTable] = useAtom(dataTableAtom);
  const [dataForm, setDataForm] = useAtom(dataFormAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setFile = useSetAtom(fileAtom);
  const [value, setValue] = useState<any>("");
  const [derpartmentTag, setDerpartmentTag] = useState([]);
  const [groupTag, setGroupTag] = useState([]);
  const [avt, setAvt] = useAtom(avatar);
  const auth = useAtomValue(authAtom);
  const api = useClientgateApi();
  const [isloading, setIsLoading] = useAtom(isLoadingAtom);

  const { data: listUserActive } = useQuery(
    ["listMst_DepartmentControl"],
    () => api.Sys_User_GetAllActive() as any
  );
  const [dataMST, setValueMST] = useState("0317844394");
  const { data: dataDepartmentORGID } = useQuery(
    ["dataDepartment", dataForm?.OrgID],
    () =>
      api.Mst_DepartmentControl_GetByOrgID(
        dataForm.OrgID ? dataForm.OrgID : auth.orgId.toString()
      ) as any
  );

  useEffect(() => {
    if (dataForm) {
      setValueMST(dataForm.MST);
    }
  }, [dataForm]);

  const [dataPB, setDataPB] = useState<any>([]);
  useEffect(() => {
    if (dataDepartmentORGID) {
      setDataPB(dataDepartmentORGID?.Data?.Lst_Mst_Department);
    }
  }, [dataDepartmentORGID]);
  const handleCancel = () => {
    setFile(undefined);
    setPopupVisible(false);
    setValue(false);
  };
  const toolbarItems: ToolbarItemProps[] = [
    {
      location: "before",
      render: (e: any) => {
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
      const dataFormSub = new FormData(formRef.current);
      const dataSaveForm: any = Object.fromEntries(dataFormSub.entries()); // chuyển thành form chính
      const repsUpload = await api.SysUserData_UploadFile(avt);
      const dataSave = {
        ...dataSaveForm,
        Avatar: repsUpload?.Data?.FileUrlFS ?? "",
        UserPassword: flagCheckCRUD
          ? dataSaveForm.UserPassword ?? ""
          : dataForm.UserPassword,
        UserCode: dataSaveForm.EMail ?? "",
        Lst_Sys_UserMapDepartment:
          derpartmentTag.length !== 0
            ? derpartmentTag?.map((item: any) => {
                return {
                  UserCode: dataSaveForm.EMail,
                  DepartmentCode: item,
                  OrgID: dataPB[0].OrgID,
                };
              })
            : dataForm?.DepartmentName?.map((item: any) => {
                return {
                  UserCode: dataSaveForm.EMail,
                  OrgID: dataForm.OrgID,
                  DepartmentCode: item,
                };
              }) || [],
        Lst_Sys_UserInGroup:
          groupTag.length !== 0
            ? groupTag?.map((item: any) => {
                return {
                  UserCode: dataSaveForm.EMail,
                  OrgID: dataPB[0].OrgID,
                  GroupCode: item,
                };
              })
            : dataForm?.GroupName?.map((item: any) => {
                return {
                  UserCode: dataSaveForm.EMail,
                  OrgID: dataForm.OrgID,
                  GroupCode: item,
                };
              }) || [],
      };
      if (flagCheckCRUD) {
        onCreate(dataSave, value);
      } else {
        onEdit({
          ...dataSave,
          Avatar: repsUpload?.Data?.FileUrlFS
            ? repsUpload?.Data?.FileUrlFS
            : dataForm?.Avatar,
        });
      }
    },
    [avt, flagCheckCRUD, groupTag, derpartmentTag, dataForm, dataPB]
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
      if (
        ["UserPassword", "ReUserPassword"].includes(item.dataField) &&
        flagCheckCRUD === false
      ) {
        item.visible = false;
      }
      if (item.dataField === "MST") {
        item.editorOptions.value = dataMST;
      }
      if (
        [
          "UserName",
          "EMail",
          "PhoneNo",
          "ACLanguage",
          "ACTimeZone",
          "UserPassword",
          "ReUserPassword",
          "ACId",
        ].includes(item.dataField)
      ) {
        if (flagCheckCRUD === true) {
          item.editorOptions.readOnly = false;
        } else if (flagCheckCRUD === false) {
          item.editorOptions.readOnly = true;
        }
      }
      if (item.dataField === "DepartmentName") {
        item.editorOptions.dataSource = dataPB;
        item.editorOptions.displayExpr = "DepartmentName";
        item.editorOptions.valueExpr = "DepartmentCode";
      }

      if (
        flagCheckCRUD === true &&
        ["ACId", "FlagActive"].includes(item.dataField)
      ) {
        item.visible = false;
      }

      // nếu tìm thấy thì ko cho sửa
      if (item.dataField === "UserName") {
        if (value === true) {
          item.editorOptions.readOnly = true;
        }
      }
      if (item.dataField === "ACLanguage") {
        if (value === true) {
          item.editorOptions.readOnly = true;
        }
      }
      if (item.dataField === "ReUserPassword") {
        if (value === true) {
          item.editorOptions.readOnly = true;
        }
      }
      if (item.dataField === "PhoneNo") {
        if (value === true) {
          item.editorOptions.readOnly = true;
        }
      }
      if (item.dataField === "UserPassword") {
        if (value === true) {
          item.editorOptions.readOnly = true;
        }
      }
      if (item.dataField === "ACTimeZone") {
        if (value === true) {
          item.editorOptions.readOnly = true;
        }
      }

      // init value mặc định
      if (item.dataField === "ACTimeZone") {
        item.editorOptions.value = "7";
      }
      if (item.dataField === "ACLanguage") {
        item.editorOptions.value = "vi";
      }
    },
    [flagCheckCRUD, value, dataMST, dataPB, auth]
  );

  const handleFieldDataChanged = useCallback(
    async (changedData: any) => {
      if (changedData.dataField === "EMail") {
        const checkUser = await api.Sys_User_CheckUser(changedData.value);
        setValue(checkUser?.Data?.FlagExist);
        if (checkUser.isSuccess && checkUser?.Data?.FlagExist) {
          setDataForm({
            EMail:
              checkUser?.Data?.FlagExist === true
                ? checkUser?.Data?.User.Email
                : changedData.value,
            UserName: checkUser?.Data?.User.Name ?? "",
            ACTimeZone: checkUser?.Data?.User.TimeZone === 7 ? "7" : "7",
            ACLanguage: checkUser?.Data?.User.Language === "vn" ? "vi" : "vi",
            PhoneNo: checkUser?.Data?.User.Phone ?? "",
            MST: dataMST,
          });
        }
      }
      if (changedData.dataField === "DepartmentName") {
        setDerpartmentTag(changedData.value);
      }
      if (changedData.dataField === "GroupName") {
        setGroupTag(changedData.value);
      }
      if (changedData.dataField === "MST") {
        setValueMST(changedData.vale);
        const dataMSTNNT = await api.Mst_NNTController_GetNNTCode(
          changedData.value || "0317844394"
        );
        const dataDepartment = await api.Mst_DepartmentControl_GetByOrgID(
          dataMSTNNT.Data?.OrgID || "7206207001"
        );
        setDataPB(dataDepartment?.Data?.Lst_Mst_Department);
      }
    },
    [listUserActive?.DataList, derpartmentTag, groupTag, dataMST, dataPB]
  );

  return (
    <Popup
      visible={popupVisible}
      showTitle={true}
      title={match(flagCheckCRUD)
        .with(true, () => t("Create user"))
        .with(false, () => t("Edit user")) // đợi màu từ thiết kế
        .otherwise(() => title)}
      width={980}
      height={620}
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
                {!value
                  ? formSettings.formSettings
                      .filter((item: any) => item.typeForm === "textForm")
                      .map((value: any) => {
                        return (
                          <GroupItem colCount={value.colCount}>
                            {value
                              ? value.items.map((items: any) => {
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
                                })
                              : value.items.map((items: any) => {
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
                      })
                  : formSettings.formSettingWhenSuccess
                      .filter((item: any) => item.typeForm === "textForm")
                      .map((value: any) => {
                        return (
                          <GroupItem colCount={value.colCount}>
                            {value
                              ? value.items.map((items: any) => {
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
                                })
                              : value.items.map((items: any) => {
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
                formSettings.formSettings.filter(
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
                {!value
                  ? formSettings.formSettings
                      .filter((item: any) => item.typeForm === "TableForm")
                      .map((value: any) =>
                        value.items.map((item: any) => {
                          return <Column key={item.caption} {...item} />;
                        })
                      )
                  : formSettings.formSettingWhenSuccess
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
