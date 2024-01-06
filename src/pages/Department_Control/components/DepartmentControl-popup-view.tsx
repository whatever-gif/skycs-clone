import { useI18n } from "@/i18n/useI18n";

import {
  UserAutoAssignTicketAtom,
  dataFormAtom,
  dataTableAtom,
  dataTableUserAtom,
  dataUserAtom,
  flagDetail,
  flagEdit,
  showDetail,
  showPopup,
} from "@/pages/Department_Control/components/store";
import { useAtom, useAtomValue } from "jotai";

import { useClientgateApi } from "@/packages/api";
import { authAtom } from "@/packages/store";
import { BaseGridView } from "@/packages/ui/base-gridview";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { useQuery } from "@tanstack/react-query";
import {
  CheckBox,
  Form,
  Popup,
  RadioGroup,
  ScrollView,
  SelectBox,
} from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { match } from "ts-pattern";

export interface DealerPopupViewProps {
  onEdit: any;
  formSettings: any;
  title: string;
  onCreate: any;
}

export const DepartMentControlPopupView = ({
  onEdit,
  onCreate,
  title,
  formSettings,
}: DealerPopupViewProps) => {
  let gridRef: any = useRef<any>(null);
  const checkboxRef = useRef<any>(null);
  const [popupVisible, setPopupVisible] = useAtom(showPopup);
  const flagCheckCRUD = useAtomValue(flagEdit);
  const detailForm = useAtomValue(showDetail);
  const dataFlagDetail = useAtomValue(flagDetail);
  const formRef = useRef<any>();
  const validateRef = useRef<any>();
  const { t } = useI18n("Department_Control-popup");
  const { t: titlePopup } = useI18n("Department_Control-title");
  const [userSelect, setUserSelect] = useAtom(dataTableAtom);
  const dataForm = useAtomValue(dataFormAtom);
  const dataUserAutoTicket = useAtomValue(UserAutoAssignTicketAtom);
  const auth = useAtomValue(authAtom);
  const [hidenPopupAddUser, setHidenPopupAddUser] = useState(false);
  const [dataUser, setDataUser] = useAtom(dataUserAtom);
  const [dataTable, setDataTable] = useAtom(dataTableUserAtom);
  const radioRef = useRef<any>();
  const [valueRadio, setValueRadio] = useState("");

  const api = useClientgateApi();

  const {
    data: listUser,
    isLoading,
    refetch,
  } = useQuery(["listDataUser"], () => api.Sys_User_GetAllActive());

  useEffect(() => {
    if (listUser && flagCheckCRUD === true) {
      setDataUser(
        listUser?.DataList?.filter(
          (item: any) => item.OrgID === auth.orgId.toString()
        )
      );
    }
    if (flagCheckCRUD === true) {
      checkboxRef?.current?.instance.option("value", false);
    }
    if (listUser && flagCheckCRUD === false) {
      setDataUser(
        listUser?.DataList?.filter(
          (item: any) =>
            !dataTable.some(
              (arrItem: any) => arrItem.UserCode === item.UserCode
            )
        ).filter((item: any) => item.OrgID === auth.orgId.toString())
      );
    }
  }, [listUser, flagCheckCRUD, dataTable]);
  useEffect(() => {
    if (dataForm) {
      radioRef.current?.instance.option("value", dataForm?.FlagAutoDiv);
    }
  }, [dataForm, radioRef]);

  const handleSubmitPopup = useCallback(
    (e: any) => {
      validateRef.current.instance.validate();
      const dataFormSubmit = new FormData(formRef.current);
      const dataSaveForm: any = Object.fromEntries(dataFormSubmit.entries()); // chuyển thành form chính
      const dataSave = {
        Mst_Department: {
          ...dataSaveForm,
          DepartmentCode: dataSaveForm.DepartmentCode,
          FlagActive: dataSaveForm.FlagActive === "true" ? "1" : "0",
          OrgID: auth.orgData.Id.toString(),
          FlagAutoDiv:
            dataTable.filter(
              (value: any, index: any, self: any) =>
                self.indexOf(value) === index
            )?.length === 0
              ? ""
              : valueRadio
              ? valueRadio
              : dataForm.FlagAutoDiv,
        },
        Lst_Sys_UserMapDepartment: dataTable
          .filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          )
          .map((item: any) => {
            return {
              DepartmentCode: dataSaveForm.DepartmentCode,
              UserCode: item.UserCode,
              OrgID: auth.orgData.Id.toString(),
              FullName: item.UserName,
              Email: item.EMail,
              PhoneNo: item.PhoneNo,
            };
          }),
        Lst_Sys_UserAutoAssignTicket:
          dataTable?.filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          ).length > 0 &&
          (valueRadio === "0" || dataForm.FlagAutoDiv === "0")
            ? [
                {
                  DepartmentCode: dataSaveForm.DepartmentCode,
                  UserCode:
                    typeof radioRef.current === "string"
                      ? radioRef.current
                      : dataUserAutoTicket[0]?.UserCode,
                  OrgID: auth.orgId.toString(),
                },
              ]
            : [],
      };

      if (flagCheckCRUD) {
        onCreate(dataSave);
      } else {
        onEdit(dataSave);
      }
    },
    [
      flagCheckCRUD,
      dataTable,
      valueRadio,
      radioRef,
      dataForm,
      dataUserAutoTicket,
    ]
  );

  const handleChooseUser = (user: any, userCode: any, check: any) => {
    if (check) {
      // console.log(164, user);
      setUserSelect([...userSelect, user]);
    } else {
      setUserSelect(userSelect?.filter((e: any) => e.UserCode !== userCode));
    }
  };

  const handleSearchUser = (e: any) => {
    if (e.target.value !== "") {
      setDataUser(
        dataUser
          .filter((item: any) => {
            return item.UserName.toLowerCase().includes(
              e.target.value.toLowerCase()
            );
          })
          .filter((item: any) => item.OrgID === auth.orgId.toString())
      );
    } else {
      setDataUser(deleteCommonElements(listUser?.DataList, dataTable));
    }
  };

  const handleSubmitUser = (e: any) => {
    toast.success(t("Save User Successfully"));
    setDataTable(userSelect.concat(dataTable));
    // console.log(230, userSelect);
    setTimeout(() => {
      setHidenPopupAddUser(false);
    }, 1000);
  };

  const handleCancel = () => {
    setPopupVisible(false);
  };

  const handleCancelUser = () => {
    setHidenPopupAddUser(false);
  };

  const customizeItem = (item: any) => {
    if (item.dataField === "FlagActive" && flagCheckCRUD === true) {
      item.editorOptions.value = true;
    }
    if (item.dataField === "DepartmentCode" && flagCheckCRUD === false) {
      item.editorOptions.readOnly = true;
    }
    if (item.dataField === "DepartmentCode" && flagCheckCRUD === true) {
      item.editorOptions.readOnly = false;
    }
    if (item.dataField === "DepartmentDesc" && detailForm === true) {
      item.editorOptions.readOnly = true;
    }
    if (item.dataField === "DepartmentDesc" && detailForm === false) {
      item.editorOptions.readOnly = false;
    }
  };

  function handleFieldDataChanged(changedData: any) {
    // Handle the changed field data
    // setValue(changedData.value);
  }

  const handleAddUser = () => {
    setDataUser(
      dataUser
        ?.filter(
          (item: any) =>
            !dataTable.some(
              (arrItem: any) => arrItem.UserCode === item.UserCode
            )
        )
        .filter((item: any) => item.OrgID === auth.orgId.toString())
    );
    setHidenPopupAddUser(true);
  };

  const handleCheckNumberUser = () => {
    if (flagCheckCRUD === true) {
      setDataUser(userSelect);
    }
    setHidenPopupAddUser(true);
  };

  const handleDeleteRow = (e: any) => {
    const dataRow = e.row.data;
    setDataUser(dataUser.concat(dataRow));
    setDataTable(
      dataTable?.filter((item: any) => item?.UserCode !== e.row.key.UserCode)
    );
    setUserSelect(
      userSelect?.filter((item: any) => item?.UserCode !== e.row.key.UserCode)
    );
  };

  // console.log(60, dataForm);
  const dataSource = [
    {
      id: 0,
      text: t("Phân chia tự động đều cho các thành viên"),
      FlagAutoDiv: "1",
    },
    {
      id: 1,
      text: t("Giao cho User"),
      FlagAutoDiv: "0",
      component: (
        <SelectBox
          dataSource={
            valueRadio === "1"
              ? []
              : dataTable.filter(
                  (value: any, index: any, self: any) =>
                    self.indexOf(value) === index
                )
          }
          onValueChanged={(e) => handleUserTicket(e.value)}
          valueExpr={"UserCode"}
          displayExpr={"UserName"}
          searchEnabled={true}
          defaultValue={dataUserAutoTicket[0]?.UserCode}
        />
      ),
    },
  ];

  const handleUserTicket = (data: any) => {
    radioRef.current = data;
  };

  const handleChangeRadio = (data: any) => {
    setValueRadio(data);
  };

  const GridFunction = useCallback(() => {
    console.log("re ", dataTable);

    return (
      <GridViewCustomize
        id={"grid-deparment"}
        customerHeight={"100%"}
        isShowIconEdit={false}
        cssClass={"listUser_Department"}
        isLoading={isLoading}
        dataSource={dataTable.filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        )}
        columns={
          formSettings.filter((item: any) => item.typeForm === "TableForm")[0]
            .items
        }
        keyExpr={["UserCode", "OrgID"]}
        formSettings={formSettings}
        onReady={(ref) => (gridRef = ref)}
        allowSelection={false}
        onSelectionChanged={() => {}}
        onSaveRow={() => {}}
        onEditorPreparing={() => {}}
        onEditRowChanges={() => {}}
        onDeleteRows={handleDeleteRow}
        onEditRow={() => {}}
        storeKey={"List-user-columns"}
        isShowEditting={detailForm === true ? false : true}
        isSingleSelection={false}
        isHidenHeaderFilter={false}
        isHiddenCheckBox={true}
        customToolbarItems={[]}
      />
    );
  }, [dataTable]);

  return (
    <div>
      <Popup
        visible={popupVisible}
        showTitle={true}
        title={match(dataFlagDetail)
          .with("Addnew", () => titlePopup("Create department"))
          .with("Edit", () => titlePopup("Edit department"))
          .otherwise(() => title)}
        width={870}
        className="popup_department"
        wrapperAttr={{
          class: "popup-form-department",
        }}
        toolbarItems={[
          {
            toolbar: "bottom",
            location: "after",
            widget: "dxButton",
            visible: !detailForm,
            options: {
              text: t("Save"),
              stylingMode: "contained",
              type: "default",
              useSubmitBehavior: true,
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
        <ScrollView height={"100%"}>
          <form ref={formRef} onSubmit={handleSubmitPopup}>
            <Form
              ref={validateRef}
              formData={dataForm}
              labelLocation="top"
              validationGroup="DepartmentControlData"
              onInitialized={(e) => {
                validateRef.current = e.component;
              }}
              readOnly={detailForm}
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
                          <GroupItem colSpan={items.colSpan} key={nanoid()}>
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

            <div className="flex items-center mt-1 px-2 mb-2 justify-between">
              {detailForm ? (
                ""
              ) : (
                <div
                  onClick={handleAddUser}
                  className="bg-[#008016] cursor-pointer px-2 text-[white] py-1 rounded-sm"
                >
                  {t("Thêm thành viên")}
                </div>
              )}
              <div
                // onClick={handleCheckNumberUser}
                className="text-[#008016]"
              >
                {t("Số lượng nhân viên:") +
                  "  " +
                  `${
                    dataTable?.filter(
                      (value: any, index: any, self: any) =>
                        self.indexOf(value) === index
                    ).length
                  }`}
              </div>
            </div>
          </form>
          <form ref={gridRef} className="listUser_Department">
            {/* {GridFunction()} */}
            <BaseGridView
              showCheck={"none"}
              hidePagination={true}
              height={"100%"}
              editable={detailForm === true ? false : true}
              // cssClass={"listUser_Department"}
              isShowIconEdit={false}
              isLoading={isLoading}
              dataSource={dataTable.filter(
                (value: any, index: any, self: any) =>
                  self.indexOf(value) === index
              )}
              columns={
                formSettings.filter(
                  (item: any) => item.typeForm === "TableForm"
                )[0].items
              }
              keyExpr={["UserCode", "OrgID"]}
              formSettings={formSettings}
              onReady={(ref) => (gridRef = ref)}
              allowSelection={false}
              onSelectionChanged={() => {}}
              onSaveRow={() => {}}
              onEditorPreparing={() => {}}
              onEditRowChanges={() => {}}
              onDeleteRows={() => {}}
              onCustomerDeleteRow={handleDeleteRow}
              storeKey={"List-user-columns"}
              // isShowEditting={detailForm === true ? false : true}
              // isSingleSelection={false}
              // isHidenHeaderFilter={false}
              // isHiddenCheckBox={true}
              // customToolbarItems={[]}
            />
          </form>

          <div className="mt-3">
            {dataTable?.length !== 0 ? (
              <div>
                <span className="font-bold">
                  {t("Tự động giao việc eTicket trong Team")}
                </span>
                <div className="ml-3 mt-3">
                  <div>
                    <RadioGroup
                      ref={radioRef}
                      readOnly={detailForm}
                      dataSource={dataSource}
                      itemRender={renderRadioGroupItem}
                      // defaultValue={dataForm?.FlagAutoDiv}
                      onValueChanged={(e) => handleChangeRadio(e.value)}
                      valueExpr="FlagAutoDiv"
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <Popup
            visible={hidenPopupAddUser}
            onHiding={handleCancelUser}
            showCloseButton={true}
            hideOnOutsideClick={true}
            // dragEnabled={true}
            showTitle={true}
            title={t("Thông tin các nhân viên")}
            container=".dx-viewport"
            width={850}
            height={600}
            toolbarItems={[
              {
                toolbar: "bottom",
                location: "after",
                widget: "dxButton",
                visible: !detailForm,
                options: {
                  text: t("Save"),
                  stylingMode: "contained",
                  type: "default",
                  useSubmitBehavior: true,
                  onClick: handleSubmitUser,
                },
              },
              {
                toolbar: "bottom",
                location: "after",
                widget: "dxButton",
                visible: !detailForm,
                options: {
                  text: t("Cancel"),
                  stylingMode: "contained",
                  type: "default",
                  useSubmitBehavior: true,
                  onClick: handleCancelUser,
                },
              },
            ]}
          >
            {/* <LoadPanel visible={dataUser} position={{ of: "#gridContainer" }} /> */}
            <div>
              <div className="mb-3">
                <input
                  className="h-[30px] w-full text-[14px]"
                  type="text"
                  placeholder={t("Nhập khóa để tìm kiếm ...")}
                  onChange={(e) => handleSearchUser(e)}
                />
              </div>

              {dataUser?.map((item: any) => {
                return (
                  <div>
                    <div
                      key={item.UserCode}
                      className="flex items-center border-b border-t py-2 px-2"
                    >
                      {detailForm ? (
                        ""
                      ) : (
                        <div className="mr-4">
                          <CheckBox
                            ref={checkboxRef}
                            onValueChanged={(e) =>
                              handleChooseUser(item, item.UserCode, e.value)
                            }
                          />
                        </div>
                      )}
                      <div className="flex w-[95%] items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                            <img
                              src={
                                item?.Avatar !== null
                                  ? item?.Avatar
                                  : "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180"
                              }
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-2">
                            <div className="mb-1 h-[17px] truncate">
                              {item.UserName ?? "---"}
                            </div>
                            <div className="h-[20px] truncate">
                              {item.ACEmail ?? "---"}
                            </div>
                          </div>
                        </div>
                        <div>{item.PhoneNo}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Popup>
        </ScrollView>
      </Popup>
    </div>
  );
};

const renderRadioGroupItem = (itemData: any) => {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span>{itemData.text}</span>
        <div>{itemData?.component}</div>
      </div>
    </div>
  );
};

function deleteCommonElements(array1: any, array2: any) {
  const result = [];

  for (const item1 of array1) {
    const isDuplicate = array2.some((item2: any) => {
      return (
        item1.UserCode.toLowerCase() === item2.UserCode.toLowerCase() &&
        item1.UserName.toLowerCase() === item2.UserName.toLowerCase()
      );
    });

    if (!isDuplicate) {
      result.push(item1);
    }
  }

  return result;
}
