import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@/packages/common/Validation_Rules";
import { Form } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  item: any;
  listMstBulletinType: any[];
  listSubmissionForm: any;
}

const PartReplyFormItem = ({
  item: itemValue,
  listSubmissionForm,
  listMstBulletinType,
}: Props) => {
  const formValue: any = {
    ...itemValue,
    ParamSFName:
      itemValue.SourceDataType === "INPUT" ? "INPUT" : itemValue.ParamSFName,
  };

  const [valueSelect, setValueSelect] = useState();
  const { t } = useI18n("Eticket_Detail_ZALO_Form");
  const formRef: any = useRef();
  // console.log("itemValue", listMstBulletinType);
  const formSettings: any = [
    {
      colCount: 4,
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
              dataField: "ParamSFCodeZNS",
              editorType: "dxTextBox",
              editorOptions: {
                readOnly: true,
              },
              caption: t("ParamSFCodeZNS"),
              visible: true,
              validationRules: [requiredType],
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
              dataField: "SourceDataType",
              disabed: true,
              editorOptions: {
                dataSource: listMstBulletinType || [],
                displayExpr: "SourceDataTypeName",
                valueExpr: "SourceDataType",
                readOnly: true,
              },
              editorType: "dxSelectBox",
              caption: t("SourceDataType"),
              visible: true,
              validationRules: [requiredType],
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
              dataField: "ParamSFName",
              editorType: "dxTextBox",
              caption: t("ParamSFName"),
              visible: true,
              validationRules: [requiredType],
              disabed: itemValue.SourceDataType === "INPUT",
              // editorOptions: {
              // dataSource: listSubmissionForm,
              // valueExpr: "ParamSFName",

              // }
              editorOptions: {
                readOnly: true,
              },
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
              dataField: "ParamValue",
              editorType: "dxTextBox",
              caption: t("ParamValue"),
              visible: true,
              editorOption: {
                // readOnly: itemValue.SourceDataType !== "INPUT",
                readOnly: true,
              },
            },
          ],
        },
      ],
    },
  ];

  return (
    <Form
      className="form-zalo-eticket"
      style={{ marginTop: 8, marginBottom: 8 }}
      formData={formValue}
      labelMode="hidden"
      ref={formRef}
      validationGroup="Part-reply-zalo-Form"
    >
      {formSettings.map((value: any, index: any) => {
        return (
          <GroupItem colSpan={4} key={index} colCount={value.colCount}>
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
  );
};

export default PartReplyFormItem;
