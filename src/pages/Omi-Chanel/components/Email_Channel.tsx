import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@/packages/common/Validation_Rules";
import { CheckBox } from "devextreme-react";
import Form, { GroupItem, SimpleItem } from "devextreme-react/form";
import React, { useRef } from "react";

export default function Email_Channel({ data, setFlagEmail }: any) {
  const { t } = useI18n("Omi_Chanel-email");
  const validateRef = useRef<any>();
  const formSettings: any = [
    {
      colCount: 1,
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
              dataField: "SolutionCodeSendMail",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("SolutionCodeSendMail"),
              },
              editorType: "dxTextBox",
              visible: true,
              render: () => {
                return <span className="font-bold">SKYCS</span>;
              },
            },
            {
              dataField: "DisplayNameMailFrom",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("DisplayNameMailFrom"),
              },
              editorType: "dxTextBox",
              visible: true,
              render: () => {
                return <span className="font-bold">SKYCS</span>;
              },
            },
            {
              dataField: "MailFrom",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("MailFrom"),
              },
              editorType: "dxTextBox",
              visible: true,
              render: () => {
                return (
                  <span className="font-bold">eticket@mg.qinvoice.vn</span>
                );
              },
            },

            {
              dataField: "MailTo",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("MailTo"),
              },
              editorType: "dxTextBox",
              visible: true,
              render: () => {
                return (
                  <span className="font-bold">eticket@mg.qinvoice.vn</span>
                );
              },
            },
            // {
            //   dataField: "APIsSendMail",
            //   editorOptions: {
            //     placeholder: t("Input"),
            //   },
            //   label: {
            //     text: t("APIsSendMail:"),
            //   },
            //   editorType: "dxTextBox",
            //   visible: true,
            // },
            // {
            //   dataField: "ApiKeySendMail",
            //   editorOptions: {
            //     placeholder: t("Input"),
            //   },
            //   label: {
            //     text: t("ApiKeySendMail:"),
            //   },
            //   editorType: "dxTextBox",
            //   visible: true,
            // },
            {
              dataField: "FlagIsCreateET",
              editorOptions: {
                placeholder: t("Input"),
              },
              cssClass: "FlagIsCreateET",
              editorType: "dxCheckBox",
              visible: true,
              render: (param: any, e: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <div className="flex items-center gap-3">
                    <CheckBox
                      onValueChanged={(e: any) => {
                        formComponent.updateData(
                          "FlagIsCreateET",
                          e.value ? "1" : "0"
                        );
                      }}
                      defaultValue={
                        param.editorOptions.value === "0" ? false : true
                      }
                    />
                    <div>{t("Tự động tạo eTicket khi nhận được email")}</div>
                  </div>
                );
              },
            },
          ],
        },
      ],
    },
  ];
  return (
    <form>
      <Form
        className="form_detail_post"
        ref={setFlagEmail}
        validationGroup="PostData"
        onInitialized={(e) => {
          setFlagEmail.current = e.component;
        }}
        readOnly={false}
        formData={data}
        labelLocation="left"
        // customizeItem={customizeItem}
        // onFieldDataChanged={handleFieldDataChanged}
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
                          <SimpleItem key={valueFrom.caption} {...valueFrom} />
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
  );
}
