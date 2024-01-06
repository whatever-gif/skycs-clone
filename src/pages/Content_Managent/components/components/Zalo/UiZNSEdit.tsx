import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { Form, SelectBox, TextBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { valueIDZNSAtom } from "../../store";
import { requiredType } from "@/packages/common/Validation_Rules";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { nanoid } from "nanoid";

export default function UiZNSEdit({
  item,
  listMstBulletinType,
  key,
  setLocalState,
  onChange,
}: any) {
  const { t } = useI18n("Content_Managent");
  const [valueSelect, setValueSelect] = useState(undefined);
  const validateRef = useRef<any>();
  const api = useClientgateApi();
  const { data: listSubmissionForm } = useQuery(["listSubmissionForm"], () =>
    api.Mst_SubmissionForm_GetAllActive()
  );

  const handleChangeValue = (value: any, name: any, valueSelect: any) => {
    const obj = {
      [name]: {
        SourceDataType: valueSelect ? valueSelect : item.SourceDataType,
        ParamSFCode: value ? value : item.ParamSFCode,
        ParamSFCodeZNS: name ? name : item.ParamSFCodeZNS,
      },
    };
    onChange(obj);
  };

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
              dataField: "ParamSFCodeZNS",
              editorOptions: {
                readOnly: true,
              },
              editorType: "dxTextBox",
              caption: t("ParamSFCodeZNS"),
              visible: true,
              validationRules: [requiredType],
            },
          ],
        },
      ],
    },
  ];
  const formSettingsA: any = [
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
              dataField: "SourceDataType",
              editorOptions: {
                dataSource: listMstBulletinType || [],
                displayExpr: "SourceDataTypeName",
                valueExpr: "SourceDataType",
                onValueChanged: (e: any) => setValueSelect(e.value),
              },
              editorType: "dxSelectBox",
              caption: t("BulletinType"),
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
              dataField:
                (item.SourceDataType === "INPUT"
                  ? "ParamValue"
                  : "ParamSFCode") ||
                (valueSelect === "INPUT" ? "ParamValue" : "ParamSFCode"),
              editorOptions: {
                placeholder:
                  valueSelect === undefined
                    ? t("Vui lòng chọn dữ liệu")
                    : valueSelect === "INPUT"
                    ? t("input")
                    : t("select"),
                dataSource: listSubmissionForm?.DataList || [],
                valueExpr: "ParamSFCode",
                displayExpr: "ParamSFName",
                readOnly: valueSelect === undefined ? true : false,
                onValueChanged: (e: any) =>
                  handleChangeValue(e.value, item.ParamSFCodeZNS, valueSelect),
              },
              editorType:
                item.SourceDataType === "INPUT" ? "dxTextBox" : "dxSelectBox",
              caption: t("ParamSFCode"),
              visible: true,
              validationRules: [requiredType],
            },
          ],
        },
      ],
    },
  ];

  const customizeItem = useCallback(
    (item: any) => {
      // if (["ParamSFCode"].includes(item.dataField)) {
      //   if (valueSelect === "INPUT") {
      //     item.editorOptions.value = "";
      //   }
      //   // console.log(126, value);
      // }
    },
    [valueSelect]
  );
  const handleFieldDataChanged = useCallback((changedData: any) => {
    // Handle the changed field data
    // if (changedData.dataField === "ParamSFCode") {
    //   console.log(137, changedData.value);
    // }
  }, []);
  return (
    <div className="flex gap-[40px] justify-between" key={nanoid()}>
      <div className="w-[30%] mb-[15px]">
        <Form
          key={nanoid()}
          className="form_detail_post"
          ref={validateRef}
          validationGroup="PostData"
          onInitialized={(e) => {
            validateRef.current = e.component;
          }}
          readOnly={false}
          formData={item}
          labelLocation="left"
          labelMode="hidden"
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
      <div className="w-[70%]">
        <Form
          key={nanoid()}
          className="form_detail"
          ref={validateRef}
          validationGroup="PostData"
          onInitialized={(e) => {
            validateRef.current = e.component;
          }}
          readOnly={false}
          formData={item}
          labelLocation="left"
          labelMode="hidden"
          // customizeItem={customizeItem}
          // onFieldDataChanged={handleFieldDataChanged}
        >
          {formSettingsA
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
  );
}
