import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";

import { Button, Form } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../list/Content_Managent.scss";

import PermissionContainer from "@/components/PermissionContainer";
import { useConfiguration } from "@/packages/hooks";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { authAtom, showErrorAtom } from "@/packages/store";
import { FlagActiveEnum } from "@/packages/types";
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

export default function Content_Edit() {
  const { t } = useI18n("Content_Managent-edit");
  const navigate = useNavigate();
  const validateRef = useRef<any>();
  const formRef = useRef<any>();
  const [formData, setFormData] = useState({});
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const [valueSelect, setValueSelect] = useState("");
  const [valueID, setValueID] = useAtom(valueIDAtom);
  const setcheckUIZNS = useSetAtom(checkUIZNSAtom);
  const [saveFormType, setSaveFormType] = useState("");
  const setRefetchAtom = useSetAtom(refetchAtom);
  const setZaloTemplateAtom = useSetAtom(zaloTemplatetom);
  const setidZNS = useSetAtom(idZNSAtom);
  const zaloTemplate = useAtomValue(zaloTemplatetom);
  const config = useConfiguration();
  const dataTabChanel = [
    {
      id: "ZALO",
      component: <Zalo_Parent formRef={validateRef} />,
    },
    {
      id: "SMS",
      component: <Content_SMS formRef={validateRef} />,
    },
    {
      id: "EMAIL",
      component: <Content_Email formRef={validateRef} />,
    },
  ];
  const [listZNS, setListZNS] = useState<any>();
  const outlet = dataTabChanel?.filter((item: any) => {
    if (item?.id === valueSelect) {
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

  // useEffect(() => {
  //   if (listMstBulletinType) {
  //     setChannelType([
  //       { ChannelTypeName: "All", ChannelType: "" },
  //       ...listMstChannelType?.DataList,
  //     ]);
  //   }
  // }, [listMstBulletinType]);

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
              editorOptions: {
                placeholder: t("Select"),
                dataSource: listMstChannelType?.DataList || [],
                displayExpr: "ChannelTypeName",
                valueExpr: "ChannelType",
                onValueChanged: (e: any) => setSaveFormType(e.value),
              },
              editorType: "dxSelectBox",
              caption: t("ChannelType"),
              label: {
                text: t("ChannelType"),
              },
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "IDZNS",
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
                      setValueID(true);
                      setcheckUIZNS(false);
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
              label: {
                text: t("IDZNS"),
              },
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
              editorType: "dxTextBox",
              caption: t("SubFormName"),
              visible: true,
              validationRules: [requiredType],
              label: {
                text: t("SubFormName"),
              },
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
    const invalidate = validateRef.current.instance.validate();
    const dataForm = new FormData(formRef.current);
    const dataSaveForm: any = Object.fromEntries(dataForm.entries());
    const formData = validateRef.current.instance.option("formData");
    const checkSpecial = checkCharSpecial(
      formData?.MessageSMS?.replace(/\$\{\{.*?\}\}/g, "").replace(/<.*?>/g, "")
    );
    const listFormGetAllActive = await api.Mst_SubmissionForm_Search({
      FlagActive: FlagActiveEnum.All,
      Ft_PageIndex: 0,
      Ft_PageSize: config.MAX_PAGE_ITEMS,
      KeyWord: "",
    });
    const check =
      listFormGetAllActive?.DataList?.filter(
        (val: any) =>
          val.SubFormCode.toUpperCase() ===
          dataSaveForm.SubFormCode.toUpperCase()
      ).length === 0; /// check trùng dữ liệu

    if (
      formData.BulletinType !== "" &&
      formData.ChannelType !== "" &&
      formData.SubFormCode !== "" &&
      formData.SubFormName !== "" &&
      invalidate.isValid === true
    ) {
      if (check === true) {
        if (valueID === true && saveFormType === "ZALO") {
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
            ...{ strJsonZNS: JSON.stringify(newData) },
          };
          if (zaloTemplate?.listParams?.length === newData?.length) {
            const resp = await api.MstSubmissionForm_Save(dataSave);
            if (resp.isSuccess) {
              setRefetchAtom(true);
              toast.success(t("Create Successfully"));
              navigate(`/${auth.networkId}/admin/Content_Managent`);
              // await refetch();
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
        if (valueID === false && saveFormType === "ZALO") {
          const dataSave = {
            ...dataSaveForm,
            FlagActive: dataSaveForm.FlagActive === "true" ? "1" : "0",
            IDZNS: "",
            ...{
              strJsonMessage: JSON.stringify([
                {
                  SubFormCode: dataSaveForm.SubFormCode,
                  Message: formData.MessageZalo ?? "",
                },
              ]),
            },
          };
          // console.log(266, formData.MessageZalo);
          const resp = await api.MstSubmissionForm_Save(dataSave);
          if (resp.isSuccess) {
            setRefetchAtom(true);
            toast.success(t("Create Successfully"));
            navigate(`/${auth.networkId}/admin/Content_Managent`);
            // await refetch();
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
        if (valueID === false && saveFormType === "SMS") {
          if (!checkSpecial) {
            const dataSave = {
              ...dataSaveForm,
              IDZNS: "",
              FlagActive: dataSaveForm.FlagActive === "true" ? "1" : "0",
              ...{
                strJsonMessage: JSON.stringify([
                  {
                    SubFormCode: dataSaveForm.SubFormCode,
                    Message: formData.MessageSMS ?? "",
                  },
                ]),
              },
            };
            const resp = await api.MstSubmissionForm_Save(dataSave);
            if (resp.isSuccess) {
              setRefetchAtom(true);
              toast.success(t("Create Successfully"));
              navigate(`/${auth.networkId}/admin/Content_Managent`);
              // await refetch();
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
        if (valueID === false && saveFormType === "EMAIL") {
          const dataSave = {
            ...dataSaveForm,
            IDZNS: "",
            FlagActive: dataSaveForm.FlagActive === "true" ? "1" : "0",
            ...{
              strJsonMessage: JSON.stringify([
                {
                  SubFormCode: dataSaveForm.SubFormCode,
                  SubTitle: formData.MessageTitleEmail ?? "",
                  Message: formData.MessageEmail ?? "",
                },
              ]),
            },
          };

          const resp = await api.MstSubmissionForm_Save(dataSave);
          if (resp.isSuccess) {
            setRefetchAtom(true);
            toast.success(t("Create Successfully"));
            navigate(`/${auth.networkId}/admin/Content_Managent`);
            // await refetch();
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
      } else {
        toast.warning("SubFormCode đã bị trùng");
      }
    }
  };

  const customizeItem = useCallback(
    (item: any) => {
      if (["IDZNS"].includes(item.dataField)) {
        if (valueSelect === "ZALO") {
          item.visible = true;
        }
        // console.log(126, value);
      }
      if (item.dataField === "FlagActive") {
        item.editorOptions.value = true;
      }
      if (item.dataField === "BulletinType") {
        item.editorOptions.value =
          listMstBulletinType?.DataList[0].BulletinType;
      }
    },
    [valueSelect, listMstChannelType]
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
  const auth = useAtomValue(authAtom);

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
              <div className="font-bold dx-font-m text-size">
                {t("Content Add new")}
              </div>
            </div>
          </PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot
            name={"Center"}
          ></PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot name={"After"}>
            <PermissionContainer
              permission={"BTN_ADMIN_CONTENTTEM_CREATE_SAVE"}
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
              permission={"BTN_ADMIN_CONTENTTEM_CREATE_CANCEL"}
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
                  formData={formData}
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
