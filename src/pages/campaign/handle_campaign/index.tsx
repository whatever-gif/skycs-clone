import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { EticketLayout } from "@/packages/layouts/eticket-layout";
import { showErrorAtom } from "@/packages/store";
import { useQuery } from "@tanstack/react-query";
import { Accordion, Button, Form } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useSetAtom } from "jotai";
import { useRef, useState } from "react";

const fakeData = {
  CustomerName: "Nguyễn Văn A",
  PositionCode: "Lead",
};

const HandleCampaign = () => {
  const { t } = useI18n("HandleCampaign");
  const [formValue, setFormValue] = useState(fakeData);
  const formRef = useRef(null);
  const { auth } = useAuth();
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);

  const { data: getDynamiceField, isLoading: isLoadingDynamicField } = useQuery(
    {
      queryKey: ["Mst_CampaignType_GetByCode"],
      queryFn: async () => {
        const response = await api.Mst_CampaignType_GetByCode(
          "D6J.001",
          auth.orgData?.Id ?? ""
        );

        if (response.isSuccess) {
          const listDynamic: any[] =
            response.Data?.Lst_Mst_CustomColumnCampaignType;
          if (listDynamic.length > 0) {
          }

          return response.Data?.Lst_Mst_CustomColumnCampaignType;
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
    }
  );

  return (
    <EticketLayout>
      <EticketLayout.Slot name={"Header"}>
        <div className="flex-1 flex justify-between align-items-center">
          <div className="left">
            <span>{t("Handle Campaign")}</span>
          </div>
          <div className="right">
            <div className="flex align-items-center">
              <Button
                stylingMode={"contained"}
                type="default"
                text={t("Save")}
                className="mr-1"
              />
              <Button
                stylingMode={"contained"}
                type="default"
                text={t("Re-call")}
                className="mr-1"
              />
              <Button
                stylingMode={"contained"}
                type="default"
                text={t("No Response")}
              />
            </div>
          </div>
        </div>
      </EticketLayout.Slot>
      <EticketLayout.Slot name={"Content"}>
        <Form formData={formValue} ref={formRef} colCount={4}>
          <GroupItem colSpan={1}>
            <SimpleItem dataField="1" />
          </GroupItem>
          <GroupItem colSpan={2}>
            <Form labelLocation={"left"} labelMode="outside">
              <SimpleItem dataField="2" />
              <GroupItem caption="thông tin liên hệ">
                <SimpleItem dataField="Nhu cầu liên hệ" />
                <SimpleItem dataField="Vin" />
                <SimpleItem dataField="Model" />
                <SimpleItem dataField="Câu hỏi khảo sát 1" />
                <SimpleItem dataField="Câu hỏi khảo sát 2" />
                <SimpleItem dataField="Câu hỏi khảo sát 3" />
              </GroupItem>
            </Form>
          </GroupItem>
          <GroupItem colSpan={1}>
            <SimpleItem
              render={() => (
                <Accordion
                  collapsible={true}
                  itemTitleRender={(item) => item.label}
                  multiple={true}
                  dataSource={[
                    {
                      label: "Thông tin khách hàng",
                    },
                  ]}
                  itemRender={() => (
                    <Form formData={formValue}>
                      <SimpleItem dataField="CustomerName" />
                      <SimpleItem dataField="PositionCode" />
                      <SimpleItem dataField="Doanh nghiệp" />
                      <SimpleItem dataField="Địa chỉ" />
                      <SimpleItem dataField="Tài khoản quản lý khách hàng" />
                    </Form>
                  )}
                />
              )}
            ></SimpleItem>

            <GroupItem caption="Thông Chiến dịch">
              <Form labelLocation={"left"} labelMode="outside">
                <SimpleItem dataField="Chiến dịch" />
                <SimpleItem dataField="Khách hàng" />
                <SimpleItem dataField="Vin" />
                <SimpleItem dataField="Số điện thoại" />
                <SimpleItem dataField="Thời điểm gọi ra" />
                <SimpleItem dataField="Số lần gọi" />
                <SimpleItem dataField="Agent Phụ trách" />
              </Form>
            </GroupItem>
          </GroupItem>
        </Form>
      </EticketLayout.Slot>
    </EticketLayout>
  );
};

export default HandleCampaign;
