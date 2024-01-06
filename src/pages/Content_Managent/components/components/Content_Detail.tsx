import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";

import { Button, Form } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../list/Content_Managent.scss";

import PermissionContainer from "@/components/PermissionContainer";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { authAtom, showErrorAtom } from "@/packages/store";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { toast } from "react-toastify";
import {
  checkUIZNSAtom,
  idZNSAtom,
  refetchAtom,
  valueIDAtom,
  zaloTemplatetom,
} from "../store";
import { checkCharSpecial } from "./CheckStringSpecial";
import Content_Email from "./Content_Email";
import Content_SMS from "./Content_SMS";
import Zalo_Parent from "./Zalo_Parent";

export default function Content_Detail() {
  const { t } = useI18n("Content_Managent-detail");
  const { idContent } = useParams();
  const navigate = useNavigate();
  const validateRef = useRef<any>();
  const formRef = useRef<any>();
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const [valueSelect, setValueSelect] = useState("");
  const [valueID, setValueID] = useAtom(valueIDAtom);
  const [saveFormType, setSaveFormType] = useState("");
  const auth = useAtomValue(authAtom);
  const setRefetchAtom = useSetAtom(refetchAtom);
  const setcheckUIZNSAtom = useSetAtom(checkUIZNSAtom);
  const setidZNS = useSetAtom(idZNSAtom);
  const setZaloTemplateAtom = useSetAtom(zaloTemplatetom);
  const { data: dataFormDetail, refetch } = useQuery(
    ["ListdataForm", idContent],
    () => api.Mst_SubmissionForm_GetBySubFormCode(idContent)
  );

  useEffect(() => {
    if (dataFormDetail) {
      if (dataFormDetail?.Data?.Lst_Mst_SubmissionForm[0].IDZNS !== null) {
        setValueID(true);
        setcheckUIZNSAtom(true);
      } else {
        setValueID(false);
      }
    }
  }, [dataFormDetail]);

  const dataTabChanel = [
    {
      id: "ZALO",
      component: (
        <Zalo_Parent
          markup={dataFormDetail?.Data}
          formRef={validateRef}
          dataForm={dataFormDetail?.Data}
        />
      ),
    },
    {
      id: "SMS",
      component: (
        <Content_SMS markup={dataFormDetail?.Data} formRef={validateRef} />
      ),
    },
    {
      id: "EMAIL",
      component: (
        <Content_Email markup={dataFormDetail?.Data} formRef={validateRef} />
      ),
    },
  ];
  const [listZNS, setListZNS] = useState<any>();
  const outlet = dataTabChanel?.filter((item: any) => {
    if (
      item?.id === valueSelect ||
      item?.id === dataFormDetail?.Data?.Lst_Mst_SubmissionForm[0].ChannelType
    ) {
      return item?.component;
    }
  })[0]?.component;

  const { data: listMstChannelType } = useQuery(["listMstChannelType"], () =>
    api.MstChannelType_GetAllActive()
  );
  const { data: listMstBulletinType } = useQuery(["listMstBulletinType"], () =>
    api.MstBulletinType_GetAllActive()
  );
  const { data: listGetByTemplate } = useQuery(["listGetByTemplate"], () =>
    api.ZaloTemplate_GetByTemplate()
  );

  useEffect(() => {
    if (listGetByTemplate?.Data) {
      setListZNS([
        { templateName: "---", templateId: "" },
        ...listGetByTemplate?.Data,
      ]);
    }
  }, [listGetByTemplate?.Data]);

  const formSettings: any = [
    {
      colCount: 2,
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
              dataField: "SubFormCode",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("SubFormCode"),
              },
              editorType: "dxTextBox",
              caption: t("SubFormCode"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "ChannelType",
              label: {
                text: t("ChannelType"),
              },
              editorOptions: {
                placeholder: t("Select"),
                dataSource: listMstChannelType?.DataList || [],
                displayExpr: "ChannelTypeName",
                valueExpr: "ChannelType",
                onValueChanged: (e: any) => setSaveFormType(e.value),
              },
              editorType: "dxSelectBox",
              caption: t("ChannelType"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "IDZNS",
              label: {
                text: t("IDZNS"),
              },
              editorOptions: {
                placeholder: t("Select"),
                dataSource: listZNS,
                displayExpr: "templateName",
                valueExpr: "templateId",
                onValueChanged: async (e: any) => {
                  if (e.value !== "") {
                    const resp = await api.ZaloTemplate_GetByTemplateId(
                      e.value
                    );
                    if (resp.isSuccess) {
                      setidZNS(e.value);
                      setcheckUIZNSAtom(false);
                      setValueID(true);
                      setZaloTemplateAtom(resp.Data);
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
                    setValueID(false);
                  }
                },
              },
              editorType: "dxSelectBox",
              caption: t("IDZNS"),
              visible: false,
            },
          ],
        },
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 1,
          cssClass: "",
          items: [
            {
              dataField: "SubFormName",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("SubFormName"),
              },
              editorType: "dxTextBox",
              caption: t("SubFormName"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "BulletinType",
              editorOptions: {
                placeholder: t("Select"),
                dataSource: listMstBulletinType?.DataList || [],
                valueExpr: "BulletinType",
                displayExpr: "BulletinTypeName",
              },
              label: {
                text: t("BulletinType"),
              },
              editorType: "dxSelectBox",
              caption: t("BulletinType"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "FlagActive",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("FlagActive"),
              },
              editorType: "dxSwitch",
              caption: t("FlagActive"),
              visible: true,
            },
          ],
        },
      ],
    },
  ];
  const handleSubmitPopup = async (e: any) => {
    validateRef.current.instance.validate();
    const resp = await api.Mst_SubmissionForm_GetBySubFormCode(idContent);
    const invalidate = validateRef.current.instance.validate();
    const dataForm = new FormData(formRef.current);
    const dataSaveForm: any = Object.fromEntries(dataForm.entries());
    const formData = validateRef.current.instance.option("formData");
    const isSame =
      JSON.stringify(formData) ===
      JSON.stringify(resp?.Data?.Lst_Mst_SubmissionForm[0]);
    const checkSpecial = checkCharSpecial(
      formData?.MessageSMS?.replace(/\$\{\{.*?\}\}/g, "").replace(/<.*?>/g, "")
    );
    if (
      !isSame &&
      formData.BulletinType !== "" &&
      formData.ChannelType !== "" &&
      formData.SubFormCode !== "" &&
      formData.SubFormName !== ""
    ) {
      if (valueID === true && formData.ChannelType === "ZALO") {
        const dataNoChange =
          dataFormDetail?.Data?.Lst_Mst_SubmissionFormZNS.map((item: any) => {
            return {
              SubFormCode: item.SubFormCode,
              ParamValue: item.ParamValue,
              ParamSFCode: item.ParamSFCode,
              SourceDataType: item.SourceDataType,
              ParamSFCodeZNS: item.ParamSFCodeZNS,
            };
          });
        if (formData.strJsonZNS !== undefined) {
          const newData = Object.entries(formData.strJsonZNS || {}).map(
            ([key, value]: any) => {
              return {
                SubFormCode: dataSaveForm.SubFormCode ?? "",
                ParamValue:
                  value.SourceDataType === "INPUT" ? value.ParamSFCode : null,
                ParamSFCode:
                  value.SourceDataType === "SYS" ? value.ParamSFCode : null,
                SourceDataType: value.SourceDataType,
                ParamSFCodeZNS: value.ParamSFCodeZNS,
              };
            }
          );
          const dataSave = {
            ...dataSaveForm,
            FlagActive: dataSaveForm.FlagActive === "true" ? "1" : "0",
            ...{
              strJsonZNS: JSON.stringify(
                formData.strJsonZNS === undefined ? dataNoChange : newData
              ),
            },
          };
          const resp = await api.MstSubmissionForm_Save(dataSave);
          if (resp.isSuccess) {
            setRefetchAtom(true);
            toast.success(t("Update Successfully"));
            await refetch();
            navigate(`/${auth.networkId}${"/admin/Content_Managent"}`);
            return true;
          }
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
          throw new Error(resp._strErrCode);
        } else {
          const dataSave = {
            ...dataSaveForm,
            FlagActive: dataSaveForm.FlagActive === "true" ? "1" : "0",
            ...{
              strJsonZNS: JSON.stringify(dataNoChange),
            },
          };
          const resp = await api.MstSubmissionForm_Save(dataSave);
          if (resp.isSuccess) {
            setRefetchAtom(true);
            toast.success(t("Update Successfully"));
            await refetch();
            navigate(`/${auth.networkId}${"/admin/Content_Managent"}`);
            return true;
          }
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
          throw new Error(resp._strErrCode);
        }
      }
      if (valueID === false && formData.ChannelType === "ZALO") {
        const dataNoChange =
          dataFormDetail?.Data?.Lst_Mst_SubmissionFormMessage[0];
        const dataSave = {
          ...dataSaveForm,
          FlagActive: dataSaveForm.FlagActive === "true" ? "1" : "0",
          IDZNS: "",
          ...{
            strJsonMessage: JSON.stringify([
              {
                SubFormCode: dataSaveForm.SubFormCode,
                Message: formData.MessageZalo
                  ? formData.MessageZalo
                  : dataNoChange.Message,
              },
            ]),
          },
        };
        const resp = await api.MstSubmissionForm_Save(dataSave);
        if (resp.isSuccess) {
          setRefetchAtom(true);
          toast.success(t("Update Successfully"));
          await refetch();
          navigate(`/${auth.networkId}${"/admin/Content_Managent"}`);
          return true;
        }
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
        throw new Error(resp._strErrCode);
      }
      if (valueID === false && formData.ChannelType === "SMS") {
        if (!checkSpecial) {
          const dataNoChange =
            dataFormDetail?.Data?.Lst_Mst_SubmissionFormMessage[0];
          const dataSave = {
            ...dataSaveForm,
            IDZNS: "",
            FlagActive: dataSaveForm.FlagActive === "true" ? "1" : "0",
            ...{
              strJsonMessage: JSON.stringify([
                {
                  SubFormCode: dataSaveForm.SubFormCode,
                  Message: formData.MessageSMS
                    ? formData.MessageSMS
                    : dataNoChange.Message,
                },
              ]),
            },
          };
          const resp = await api.MstSubmissionForm_Save(dataSave);
          if (resp.isSuccess) {
            toast.success(t("Update Successfully"));
            await refetch();
            navigate(`/${auth.networkId}${"/admin/Content_Managent"}`);
            setRefetchAtom(true);
            return true;
          }
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
          throw new Error(resp._strErrCode);
        } else {
          toast.warning("Không được nhập các kí tự đặc biệt !@#$%^&*(),");
        }
      }
      if (valueID === false && formData.ChannelType === "EMAIL") {
        const dataNoChange =
          dataFormDetail?.Data?.Lst_Mst_SubmissionFormMessage[0];
        const dataSave = {
          ...dataSaveForm,
          IDZNS: "",
          FlagActive: dataSaveForm.FlagActive === "true" ? "1" : "0",
          ...{
            strJsonMessage: JSON.stringify([
              {
                SubFormCode: dataSaveForm.SubFormCode,
                SubTitle: formData.MessageTitleEmail
                  ? formData.MessageTitleEmail
                  : dataNoChange?.SubTitle,
                Message: formData.MessageEmail
                  ? formData.MessageEmail
                  : dataNoChange?.Message,
              },
            ]),
          },
        };

        const resp = await api.MstSubmissionForm_Save(dataSave);
        if (resp.isSuccess) {
          toast.success(t("Update Successfully"));
          await refetch();
          navigate(`/${auth.networkId}${"/admin/Content_Managent"}`);
          setRefetchAtom(true);
          return true;
        }
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
        throw new Error(resp._strErrCode);
      }
    }
  };
  const handleDelete = useCallback(async () => {
    const resp = await api.Mst_SubmissionForm_delete(
      dataFormDetail?.Data?.Lst_Mst_SubmissionForm[0]?.SubFormCode
    );
    if (resp.isSuccess) {
      setRefetchAtom(true);
      toast.success(t("Delete Successfully"));
      await refetch();
      navigate(`/${auth.networkId}${"/admin/Content_Managent"}`);
      return true;
    }
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
    throw new Error(resp._strErrCode);
  }, [dataFormDetail]);

  const customizeItem = useCallback(
    (item: any) => {
      if (["IDZNS"].includes(item.dataField)) {
        if (valueSelect === "ZALO") {
          item.visible = true;
        }
        if (
          dataFormDetail?.Data?.Lst_Mst_SubmissionForm[0].ChannelType === "ZALO"
        ) {
          item.visible = true;
        }
        // console.log(126, value);
      }
      if (item.dataField === "SubFormCode") {
        item.editorOptions.readOnly = true;
      }
      if (item.dataField === "FlagActive") {
        item.editorOptions.value =
          dataFormDetail?.Data?.Lst_Mst_SubmissionForm[0].FlagActive === "1"
            ? true
            : false;
      }
    },
    [valueSelect, dataFormDetail]
  );

  const handleFieldDataChanged = useCallback((changedData: any) => {
    // Handle the changed field data
    if (changedData.dataField === "ChannelType") {
      setValueSelect(changedData.value);
    }
    // if (changedData.dataField === "IDZNS") {
    //   setIdZNS(changedData.value);
    // }
  }, []);

  return (
    <AdminContentLayout className={"Content_Managent"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderNoSearchLayout>
          <PageHeaderNoSearchLayout.Slot name={"Before"}>
            <div className="flex gap-3 items-center">
              <div
                className="font-bold text-size dx-font-m hover:underline hover:text-green-600 cursor-pointer"
                onClick={() => navigate(-1)}
              >
                {t("Content Manager")}
              </div>
              <div className="">{">"}</div>
              <div className="font-bold text-size dx-font-m">
                {t("Content Edit")}
              </div>
            </div>
          </PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot
            name={"Center"}
          ></PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot name={"After"}>
            <PermissionContainer
              permission={"BTN_ADMIN_CONTENTTEM_UPDATE_SAVE"}
              children={
                <Button
                  stylingMode={"contained"}
                  type="default"
                  text={t("Save")}
                  onClick={handleSubmitPopup}
                />
              }
            />
            <PermissionContainer
              permission={"BTN_ADMIN_CONTENTTEM_UPDATE_DELETE"}
              children={
                <Button
                  stylingMode={"contained"}
                  type="default"
                  className="Delete_Post_Detail"
                  text={t("Delete")}
                  onClick={handleDelete}
                />
              }
            />
            <PermissionContainer
              permission={"BTN_ADMIN_CONTENTTEM_UPDATE_CANCEL"}
              children={
                <Button
                  stylingMode={"contained"}
                  type="default"
                  className="Cancel_Post_Detail"
                  text={t("Cancel")}
                  onClick={() => navigate(-1)}
                />
              }
            />
          </PageHeaderNoSearchLayout.Slot>
        </PageHeaderNoSearchLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div>
          <form action="" ref={formRef} onSubmit={handleSubmitPopup}>
            <div className="flex mx-5 my-2 gap-5">
              <div className="w-full">
                <Form
                  className="form_detail_post"
                  ref={validateRef}
                  validationGroup="PostData"
                  onInitialized={(e) => {
                    validateRef.current = e.component;
                  }}
                  readOnly={false}
                  formData={
                    dataFormDetail?.Data?.Lst_Mst_SubmissionForm[0] || {}
                  }
                  labelLocation="left"
                  customizeItem={customizeItem}
                  onFieldDataChanged={handleFieldDataChanged}
                >
                  {formSettings
                    .filter((item: any) => item.typeForm === "textForm")
                    .map((value: any, index: any) => {
                      return (
                        <GroupItem key={index} colCount={value.colCount}>
                          {value.items.map((items: any, index: any) => {
                            return (
                              <GroupItem key={index} colSpan={items.colSpan}>
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
              </div>
            </div>
            {outlet}
          </form>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
}
