import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { usePermissions } from "@/packages/contexts/permission";
import { showErrorAtom } from "@/packages/store";
import { FlagActiveEnum } from "@/packages/types";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { ColumnOptions } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { isAfter, isBefore } from "date-fns";
import { Form, LoadPanel, TextBox } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { ForwardedRef, forwardRef, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CampaignTypeAtom,
  currentInfo,
  listCampaignAgentAtom,
} from "../../store";
import "./../../../style.scss";

const Cpn_Campaign_Info_Common = forwardRef(
  ({ listCustomerRef }: any, ref: ForwardedRef<any>) => {
    const { t } = useI18n("Cpn_Campaign_Info_Common");
    const formData = useAtomValue(currentInfo);
    const { auth } = useAuth();
    const api = useClientgateApi();
    const showError = useSetAtom(showErrorAtom);
    const campaignType = useAtomValue(CampaignTypeAtom);
    const setListCampaignAgent = useSetAtom(listCampaignAgentAtom);
    const currentCampaign = useAtomValue(currentInfo);

    const { data: listCampaignType, isLoading: isLoadingCapaignType } =
      useQuery({
        queryKey: ["listCampaginType"],
        queryFn: async () => {
          const response = await api.Mst_CampaignType_Search({
            CampaignTypeDesc: "",
            CampaignTypeName: "",
            Ft_PageIndex: 0,
            KeyWord: "",
            FlagActive: FlagActiveEnum.Active,
            Ft_PageSize: 999999,
          });

          if (response.isSuccess) {
            return response.DataList ?? [];
          } else {
            showError({
              message: response._strErrCode,
              _strErrCode: response._strErrCode,
              _strTId: response._strTId,
              _strAppTId: response._strAppTId,
              _objTTime: response._objTTime,
              _strType: response._strType,
              _dicDebug: response._dicDebug,
              _dicExcs: response._dicExcs,
            });
            return [];
          }
        },
      });

    const { data: listCampaignAgent, isLoading: isLoadingCapaignAgent } =
      useQuery({
        queryKey: ["listCampaginAgent"],
        queryFn: async () => {
          const response = await api.Sys_User_GetAllActive();
          if (response.isSuccess) {
            setListCampaignAgent(
              (response.DataList ?? []).filter((item) =>
                currentCampaign.CampaignAgent.includes(item.UserCode)
              )
            );
            return response.DataList;
          } else {
            showError({
              message: response._strErrCode,
              _strErrCode: response._strErrCode,
              _strTId: response._strTId,
              _strAppTId: response._strAppTId,
              _objTTime: response._objTTime,
              _strType: response._strType,
              _dicDebug: response._dicDebug,
              _dicExcs: response._dicExcs,
            });
          }
        },
      });

    const { data: listFeedBack, isLoading: isLoadingFeedBack } = useQuery({
      queryKey: ["listFeedBack", campaignType],
      queryFn: async () => {
        if (campaignType !== "") {
          const response = await api.Mst_CampaignType_GetByCode(
            campaignType,
            auth.orgData?.Id ?? ""
          );
          if (response.isSuccess) {
            return response.Data?.Lst_Mst_CustomerFeedBack;
          } else {
            showError({
              message: response._strErrCode,
              _strErrCode: response._strErrCode,
              _strTId: response._strTId,
              _strAppTId: response._strAppTId,
              _objTTime: response._objTTime,
              _strType: response._strType,
              _dicDebug: response._dicDebug,
              _dicExcs: response._dicExcs,
            });
          }
        } else {
          return [];
        }
      },
    });

    const showComponent = () => {
      if (
        isLoadingCapaignAgent ||
        isLoadingCapaignType ||
        !listCampaignType ||
        !listCampaignAgent
      ) {
        return <LoadPanel visible={true} />;
      } else {
        return (
          <FormInfoCommon
            ref={listCustomerRef}
            listCampaignType={listCampaignType ?? []}
            listCampaignAgent={listCampaignAgent ?? []}
            formData={formData}
            key="Mst_CustomerCampaign"
          />
        );
      }
    };

    return (
      <>
        {showComponent()}
        {!isLoadingFeedBack && listFeedBack?.length ? (
          <div className="mt-5">
            <p className="mb-2">{t("FeedBack of Customer")}</p>
            {listFeedBack.map((item, index: number) => {
              return (
                <TextBox
                  key={`feedback-${index}`}
                  style={{ width: "300px", marginBottom: "10px" }}
                  defaultValue={item.CusFBName}
                  disabled={true}
                ></TextBox>
              );
            })}
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
);

interface FormInfoCommonProps {
  formData: any;
  listCampaignType: any[];
  listCampaignAgent: any[];
  key: string;
}

const FormInfoCommon = forwardRef(
  (
    {
      formData,
      listCampaignType,
      listCampaignAgent,
      key = "Mst_CustomerCampaign",
    }: FormInfoCommonProps,
    ref: any
  ) => {
    console.log("formData ", formData);

    const param = useParams();
    const { t } = useI18n("Cpn_Campaign_Info_Common");
    const setCampaignTypeAtom = useSetAtom(CampaignTypeAtom);
    const setListCampaignAgent = useSetAtom(listCampaignAgentAtom);
    const { auth } = useAuth();
    const { hasButtonPermission } = usePermissions();
    const [isShow, setIsShow] = useState(formData?.CallRate === 1);
    const arrayStatus = [
      {
        item: t("PENDING"),
        value: "PENDING",
      },
      {
        item: t("APPROVE"),
        value: "APPROVE",
      },
      {
        item: t("STARTED"),
        value: "STARTED",
      },
      {
        item: t("PAUSED"),
        value: "PAUSED",
      },
      {
        item: t("CONTINUED"),
        value: "CONTINUED",
      },
      {
        item: t("FINISH"),
        value: "FINISH",
      },
    ];

    const columns: ColumnOptions[] = [
      {
        dataField: "CampaignCode", // mã chiến dịch
        caption: t("CampaignCode"),
        label: {
          text: t("CampaignCode"),
        },
        editorType: "dxTextBox",
        colSpan: 2,
        cssClass: "w-50",
        visible: !!param?.flag,
        editorOptions: {
          disabled: true,
        },
      },
      {
        dataField: "CampaignTypeCode", // Loại chiến dich
        caption: t("CampaignTypeCode"),
        label: {
          text: t("CampaignTypeCode"),
        },
        editorType: "dxSelectBox",
        colSpan: 2,
        cssClass: "w-50",
        editorOptions: {
          readOnly: param?.flag === "detail",
          placeholder: t("Input"),
          dataSource: listCampaignType,
          displayExpr: "CampaignTypeName",
          valueExpr: "CampaignTypeCode",
          onSelectionChanged: (newValue: any) => {
            setCampaignTypeAtom(newValue.selectedItem.CampaignTypeCode);
            localStorage.removeItem(`${auth.currentUser?.Email}_${key}`);
          },
        },
        validationRules: [requiredType],
      },
      {
        dataField: "CampaignName", // tên chiến dịch
        caption: t("CampaignName"),
        label: {
          text: t("CampaignName"),
        },
        editorType: "dxTextBox",
        editorOptions: {
          readOnly: param?.flag === "detail",
          placeholder: t("Input"),
        },
        colSpan: 2,
        validationRules: [requiredType],
      },
      {
        dataField: "CampaignDesc", // Mô tả
        caption: t("CampaignDesc"),
        label: {
          text: t("CampaignDesc"),
        },
        editorType: "dxTextBox",
        editorOptions: {
          readOnly: param?.flag === "detail",
          placeholder: t("Input"),
        },
        colSpan: 2,
      },
      {
        dataField: "uploadFiles", // file đính kèm
        caption: t("uploadFiles"),
        label: {
          text: t("uploadFiles"),
        },
        colSpan: 2,
        // label: {
        //   location: "left",
        //   text: "Upload files",
        // },
        editorOptions: {
          readOnly:
            param?.flag === "detail" &&
            hasButtonPermission("BTN_ADMIN_CAMPAIGN_CREATE_COMMON_SELECTFILES"),
        },
        render: (paramValue: any) => {
          const { component: formComponent, dataField } = paramValue;
          return (
            <UploadFilesField
              formInstance={formComponent}
              readonly={param?.flag === "detail"}
              controlFileInput={["DOCX", "PDF", "JPG", "PNG", "XLSX"]}
              onValueChanged={(files: any) => {
                // console.log("file ", files);
                formComponent.updateData(dataField, files);
              }}
            />
          );
        },
      },
      {
        dataField: "CampaignAgent", // Agent Phụ trách
        caption: t("CampaignAgent"),
        label: {
          text: t("CampaignAgent"),
        },
        editorType: "dxTagBox",
        colSpan: 2,
        editorOptions: {
          searchEnabled: true,
          searchExpr: ["UserCode", "UserName"],
          showSelectionControls: true,
          maxDisplayedTags: 3,
          readOnly: param?.flag === "detail",
          dataSource: listCampaignAgent,
          displayExpr: "UserName",
          valueExpr: "UserCode",
          // searchEnabled: true,
          onValueChanged: ({ value }: any) => {
            const selectedItems = listCampaignAgent?.filter((item: any) => {
              const found = value.filter(
                (item2: any) => item2 === item.UserCode
              );
              return found && found.length > 0;
            });
            setListCampaignAgent(selectedItems ?? []);
            ref.current.instance.repaint();
          },
        },
        validationRules: [requiredType],
      },
      {
        dataField: "DTimeStart", // Thời gian bắt đầu
        caption: t("DTimeStart"),
        label: {
          text: t("DTimeStart"),
        },
        editorType: "dxDateBox",
        colSpan: 1,
        editorOptions: {
          readOnly: param?.flag === "detail",
          type: "date",
          displayFormat: "yyyy-MM-dd",
        },
        validationRules: [
          requiredType,
          {
            type: "custom",
            ignoreEmptyValue: true,
            validationCallback: (e: any) => {
              if (formData.DTimeEnd) {
                return !isAfter(e.value, formData.DTimeEnd);
              }
              return true;
            },
            message: "DTimeStart must be before the DTimeEnd",
          },
        ],
      },
      {
        dataField: "CallRate", // Định mức gọi ra
        caption: t("CallRate"),
        label: {
          text: t("CallRate"),
        },
        colSpan: 1,
        editorType: "dxSelectBox",
        editorOptions: {
          readOnly: param?.flag === "detail",
          placeholder: t("Select"),
          dataSource: [
            {
              value: 1,
              label: t("All Agent"),
            },
            {
              value: 0,
              label: t("Select Single"),
            },
          ],
          displayExpr: "label",
          valueExpr: "value",
          onValueChanged: (newValue: any) => {
            setIsShow(newValue.value === 1);
          },
        },
      },
      {
        dataField: "DTimeEnd", // Thời gian kết thúc
        caption: t("DTimeEnd"),
        label: {
          text: t("DTimeEnd"),
        },
        editorType: "dxDateBox",
        colSpan: 1,
        editorOptions: {
          readOnly: param?.flag === "detail",
          type: "date",
          displayFormat: "yyyy-MM-dd",
        },
        validationRules: [
          requiredType,
          {
            type: "custom",
            ignoreEmptyValue: true,
            validationCallback: ({ value }: any) => {
              return !isBefore(value, formData.DTimeStart);
            },
            message: "DTimeEnd must be after the DTimeStart",
          },
        ],
      },
      {
        dataField: "MaxCall", // Số lần gọi tối đa
        caption: t("MaxCall"),
        label: {
          text: t("MaxCall"),
        },
        colSpan: 1,
        editorType: "dxNumberBox",
        editorOptions: {
          readOnly: param?.flag === "detail",
          placeholder: t("Input"),
        },
      },

      {
        dataField: "CampaignStatus", // Trạng thái
        caption: t("CampaignStatus"),
        label: {
          text: t("CampaignStatus"),
        },
        editorType: "dxSelectBox",
        colSpan: 1,
        visible: !!param?.flag,
        editorOptions: {
          readOnly: param?.flag === "detail",
          dataSource: arrayStatus,
          displayExpr: "item",
          placeholder: t("Select"),
          valueExpr: "value",
        },
      },
    ];

    const formRef = useRef(null);

    let newColumn = [
      ...columns,
      {
        dataField: "CustomerRate", // Số lần KH định mức
        caption: t("CustomerRate"),
        label: {
          text: t("CustomerRate"),
        },
        editorType: "dxNumberBox",
        colSpan: 1,
        visible: isShow,
        editorOptions: {
          readOnly: param?.flag === "detail" ? true : false,
          placeholder: t("Input"),
        },
      },
    ];

    return (
      <Form
        labelLocation="left"
        formData={formData}
        ref={formRef}
        validationGroup="campaignForm"
      >
        <GroupItem colCount={2} caption="">
          {newColumn.map((item: any, index: number) => {
            return <SimpleItem key={index} {...item} />;
          })}
        </GroupItem>
      </Form>
    );
  }
);

export default Cpn_Campaign_Info_Common;
