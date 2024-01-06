import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { showErrorAtom } from "@/packages/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, LoadPanel, Popup } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useAtom, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import PasswordField from "../passwordField/PasswordField";
import UploadAvatar from "./UploadAvatar";
import "./UserPopup.scss";
import { PopupProfileAtom, dataIMGAtom } from "./store";

export default function UserPopup() {
  const { t } = useI18n("Profile");
  // const auth = useAtomValue(authAtom);
  const { auth } = useAuth();
  const [formData, setFormData] = useState({});
  const api = useClientgateApi();
  const { data: CurrentUser, refetch } = useQuery(["CurrentUserPopup"], () =>
    api.GetForCurrentUser()
  );
  const [showpassword, useShowPassword] = useState(false);
  const [dataImg, setDataImg] = useAtom(dataIMGAtom);
  const [showpopup, setShowPopup] = useAtom(PopupProfileAtom);
  const [isloading, setIsLoading] = useState(false);
  useEffect(() => {
    if (CurrentUser && showpopup) {
      setFormData({
        Name: CurrentUser?.Data?.Sys_User.UserName,
        Email: auth.currentUser?.Email,
        Phone: auth.currentUser?.Phone,
        Id: auth.currentUser?.Id.toString(),
        TimeZone: auth.currentUser?.TimeZone.toString(),
        Language: auth.currentUser?.Language.toString(),
        Avatar: CurrentUser?.Data?.Sys_User.Avatar,
      });
      setDataImg(CurrentUser?.Data?.Sys_User.Avatar);
    }
    if (showpopup === true) {
      useShowPassword(false);
    }
  }, [CurrentUser, auth, showpopup]);

  const handleCancel = () => {
    setShowPopup(false);
    setDataImg(null);
  };

  const handleShowPassWord = () => {
    useShowPassword((c) => {
      return !c;
    });
  };

  const validateRef = useRef<any>();
  const formRef = useRef<any>();
  const formSettings: any = [
    {
      colCount: 3,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 1,
          cssClass: "",
          items: [
            {
              dataField: "Avatar",
              cssClass: "FlagEditAvatar",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              visible: true,
              render: (paramValue: any) => {
                const {
                  component: formComponent,
                  dataField,
                  editorOptions,
                } = paramValue;
                const formData = formComponent.option("formData");
                const value = formData[dataField];
                return (
                  <UploadAvatar
                    data={value}
                    formInstance={formComponent}
                    dataField={dataField}
                  />
                );
              },
            },
          ],
        },
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 2,
          cssClass: "",
          items: [
            {
              dataField: "Name",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("Name"),
              },
              editorType: "dxTextBox",
              visible: true,
            },
            {
              dataField: "Email",
              editorOptions: {
                readOnly: true,
              },
              label: {
                text: t("Email"),
              },
              editorType: "dxTextBox",
              visible: true,
            },
            {
              dataField: "Phone",
              editorOptions: {
                placeholder: t("Input"),
                readOnly: true,
              },
              label: {
                text: t("Phone"),
              },
              editorType: "dxTextBox",
              caption: t("Phone"),
              visible: true,
            },
            {
              dataField: "Id",
              editorOptions: {
                placeholder: t("Input"),
                readOnly: true,
              },
              label: {
                text: t("UserID"),
              },
              editorType: "dxTextBox",
              caption: t("UserID"),
              visible: true,
            },
            {
              dataField: "Language",
              editorOptions: {
                dataSource: [
                  { text: t("Tiếng Việt"), value: "vi" },
                  { text: t("English"), value: "en" },
                ],
                displayExpr: "text",
                valueExpr: "value",
                placeholder: t("Input"),
              },
              label: {
                text: t("Language"),
              },
              editorType: "dxSelectBox",
              caption: t("Language"),
              visible: true,
            },
            {
              dataField: "TimeZone",
              editorOptions: {
                placeholder: t("Input"),
                dataSource: [{ text: t("UTC+7"), value: "7" }],
                displayExpr: "text",
                valueExpr: "value",
              },
              label: {
                text: t("TimeZone"),
              },
              editorType: "dxSelectBox",
              caption: t("TimeZone"),
              visible: true,
            },
            {
              dataField: "",
              cssClass: "FlagEditAvatar my-2 ml-[155px] ",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              visible: true,
              render: () => {
                return (
                  <span
                    onClick={handleShowPassWord}
                    className="bg-[#00703c] cursor-pointer text-white px-1 text-[13px] py-1 rounded"
                  >
                    {t("Đổi mật khẩu")}
                  </span>
                );
              },
            },
            {
              dataField: "PasswordOld",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("PasswordOld"),
              },
              editorType: "dxTextBox",
              caption: t("PasswordOld"),
              visible: showpassword ? true : false,
              render: ({ component: formInstance, dataField }: any) => {
                const formData = formInstance.option("formData");
                const value = formData[dataField];
                return (
                  <PasswordField
                    width={"100%"}
                    formInstance={formInstance}
                    dataField={dataField}
                    defaultValue={value}
                  />
                );
              },
            },
            {
              dataField: "Password",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("Password"),
              label: {
                text: t("Mật khẩu mới"),
              },
              visible: showpassword ? true : false,
              render: ({ component: formInstance, dataField }: any) => {
                const formData = formInstance.option("formData");
                const value = formData[dataField];
                return (
                  <PasswordField
                    width={"100%"}
                    formInstance={formInstance}
                    dataField={dataField}
                    defaultValue={value}
                  />
                );
              },
            },
            {
              dataField: "RePassword",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("Nhập lại mật khẩu mới"),
              },
              editorType: "dxTextBox",
              caption: t("RePassword"),
              visible: showpassword ? true : false,
              render: ({ component: formInstance, dataField }: any) => {
                const formData = formInstance.option("formData");
                const value = formData[dataField];
                return (
                  <PasswordField
                    width={"100%"}
                    formInstance={formInstance}
                    dataField={dataField}
                    defaultValue={value}
                  />
                );
              },
            },
          ],
        },
      ],
    },
  ];
  const customizeItem = () => {};
  const handleFieldDataChanged = () => {};
  const showError = useSetAtom(showErrorAtom);
  const queryClient = useQueryClient();
  const handleSubmit = async () => {
    setIsLoading(true);
    const dataForm = validateRef.current.instance.option("formData");
    const repsUpload = await api.SysUserData_UploadFile(dataForm?.Avatar);
    const dataSave = {
      AvatarFileUrl:
        repsUpload?.isSuccess === true
          ? repsUpload?.Data?.FileUrlFS
          : dataForm.Avatar,
      Name: dataForm.Name,
      OldPassword: dataForm.PasswordOld,
      NewPassword: dataForm.Password,
      TimeZone: dataForm.TimeZone ? dataForm.TimeZone : "7",
      Language: dataForm.Language ? dataForm.Language : "vi",
    };
    // console.log(287, dataSave);

    if (dataForm.RePassword === dataForm.Password) {
      const resp = await api.EditProfile(dataSave);
      if (resp.isSuccess) {
        refetch();
        queryClient.invalidateQueries({
          queryKey: ["CurrentUser"],
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: ["GetForCurrentUser"],
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: ["CurrentUserPopup"],
          exact: true,
        });
        setIsLoading(false);
        toast.success(t("Edit success"));
        setShowPopup(false);
      } else {
        showError({
          message: resp._strErrCode,
          _strErrCode: resp._strErrCode,
          _strTId: resp._strTId,
          _strAppTId: resp._strAppTId,
          _objTTime: resp._objTTime,
          _strType: resp._strType,
          _dicDebug: resp._dicDebug,
          _dicExcs: resp._dicExcs,
        });
      }
    } else {
      toast.warning("Kiểm tra lại password!");
    }
  };
  return (
    <Popup
      visible={showpopup}
      showTitle={true}
      title={t("Thông tin cá nhân")}
      showCloseButton={true}
      onHidden={handleCancel}
      className="popup_Profile"
      width={800}
      height={"auto"}
      toolbarItems={[
        {
          toolbar: "bottom",
          location: "after",
          widget: "dxButton",
          options: {
            text: t("Save"),
            stylingMode: "contained",
            type: "count",
            onClick: handleSubmit,
          },
        },
        {
          toolbar: "bottom",
          location: "after",
          widget: "dxButton",
          cssClass: "CancelBTN",
          options: {
            text: t("Cancel"),
            type: "default",
            onClick: handleCancel,
          },
        },
      ]}
    >
      <div className="w-full">
        <LoadPanel
          container={".dx-viewport"}
          position={"center"}
          visible={isloading}
          showIndicator={true}
          showPane={true}
        />
        <form
          action=""
          ref={formRef}
          //  onSubmit={handleSubmitPopup}
          className="px-5 pb-3"
        >
          <Form
            ref={validateRef}
            validationGroup="customerData"
            onInitialized={(e) => {
              validateRef.current = e.component;
            }}
            // readOnly={detailForm}
            className="ProfileForm"
            formData={formData}
            labelLocation="left"
            customizeItem={customizeItem}
            onFieldDataChanged={handleFieldDataChanged}
          >
            <SimpleItem />
            {formSettings
              .filter((item: any) => item.typeForm === "textForm")
              .map((value: any, index: any) => {
                return (
                  <GroupItem colCount={value.colCount} key={nanoid()}>
                    {value.items.map((items: any) => {
                      return (
                        <GroupItem key={nanoid()} colSpan={items.colSpan}>
                          {items.items.map((valueFrom: any) => {
                            return <SimpleItem key={nanoid()} {...valueFrom} />;
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
    </Popup>
  );
}
