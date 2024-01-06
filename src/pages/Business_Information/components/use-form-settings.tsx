import { useI18n } from "@/i18n/useI18n";
import {
  ExcludeSpecialCharactersType,
  RequiredField,
} from "@/packages/common/Validation_Rules";
import { SelectBox } from "devextreme-react";
import { useEffect, useState } from "react";

import DataSource from "devextreme/data/data_source";

export const useFormSettings = ({ dataNNT, dataProvince, dataOrgID }: any) => {
  const { t } = useI18n("Business_Information-forms");
  const productsDataSource = new DataSource({
    store: {
      data: dataNNT,
      type: "array",
      key: "OrgID",
    },
  });
  const customItemCreatingORG = (args: any) => {
    if (!args.text) {
      args.customItem = null;
      return;
    }
    const newItem = {
      Id: args.text,
    };

    args.customItem = productsDataSource
      .store()
      .insert(newItem)
      .then(() => productsDataSource.load())
      .then(() => newItem)
      .catch((error) => {
        throw error;
      });
  };

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
          colSpan: 2,
          cssClass: "",
          items: [
            {
              dataField: "OrgID",
              editorOptions: {
                placeholder: t("Select"),
                dataSource: dataOrgID?.map((item: any) => {
                  return {
                    ...item,
                    OrgID: item.Id.toString(),
                    Id: item.Id.toString(),
                  };
                }),
                searchEnabled: true,
                displayExpr: "OrgID",
                valueExpr: "Id",
                // acceptCustomValue: true,
                // onCustomItemCreating: customItemCreatingORG,
              },
              editorType: "dxSelectBox",
              caption: t("OrgID"),
              visible: true,
            },
            {
              dataField: "NNTFullName",
              editorOptions: {
                readOnly: false,
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("NNTFullName"),
              label: {
                text: t("NNTFullName"),
              },
              visible: true,
              validationRules: [RequiredField(t("NNTFullNameIsRequired"))],
            },
            {
              dataField: "MST",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("MST"),
              },
              editorType: "dxTextBox",
              caption: t("MST"),
              visible: true,
              validationRules: [RequiredField(t("MSTIsRequired"))],
            },
            {
              dataField: "NNTShortName",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("NNTShortName"),
              },
              editorType: "dxTextBox",
              caption: t("NNTShortName"),
              visible: true,
            },
            {
              dataField: "PresentBy",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("PresentBy"),
              visible: true,
              label: {
                text: t("PresentBy"),
              },
            },
            {
              dataField: "NNTPosition",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("NNTPosition"),
              visible: true,
              label: {
                text: t("NNTPosition"),
              },
            },
            {
              dataField: "Website",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("Website"),
              visible: true,
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
              dataField: "ProvinceCode",
              editorOptions: {
                placeholder: t("Select"),
                dataSource: dataProvince,
                displayExpr: "ProvinceName",
                valueExpr: "ProvinceCode",
              },
              editorType: "dxSelectBox",
              caption: t("ProvinceName"),
              visible: true,
              label: {
                text: t("ProvinceName"),
              },
            },
            {
              dataField: "NNTAddress",
              editorOptions: {
                readOnly: false,
                placeholder: t("Input"),
                height: 70,
                maxLength: 200,
              },
              editorType: "dxTextArea",
              caption: t("NNTAddress"),
              label: {
                text: t("NNTAddress"),
              },
              visible: true,
              validationRules: [RequiredField(t("NNTAddressIsRequired"))],
            },
            {
              dataField: "ContactName",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("ContactName"),
              },
              editorType: "dxTextBox",
              caption: t("ContactName"),
              visible: true,
              validationRules: [RequiredField(t("ContactNameIsRequired"))],
            },
            {
              dataField: "ContactPhone",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("ContactPhone"),
              },
              editorType: "dxTextBox",
              caption: t("ContactPhone"),
              visible: true,
            },
            {
              dataField: "ContactEmail",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("ContactEmail"),
              },
              editorType: "dxTextBox",
              caption: t("ContactEmail"),
              visible: true,
              validationRules: [RequiredField(t("ContactEmailIsRequired"))],
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
    {
      typeForm: "TableForm",
      items: [],
      hidden: true,
    },
  ];

  return formSettings;
};
