import { useI18n } from "@/i18n/useI18n";
import {
  RequiredField,
  requiredEmailType,
} from "@/packages/common/Validation_Rules";

export const useFormSettings = ({ data }: any) => {
  const { t } = useI18n("Category_Manager-colums");

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
              dataField: "CategoryName",
              editorOptions: {
                placeholder: t("Input"),
                maxLength: 200,
              },
              label: {
                text: t("CategoryName"),
              },
              editorType: "dxTextBox",
              caption: t("CategoryName"),
              visible: true,
              validationRules: [RequiredField(t("CategoryNameIsRequired"))],
            },
            {
              dataField: "CategoryDesc",
              editorOptions: {
                placeholder: t("Input"),
                maxLength: 500,
                height: 60,
              },
              label: {
                text: t("CategoryDesc"),
              },
              editorType: "dxTextArea",
              caption: t("CategoryDesc"),
              visible: true,
            },
            {
              dataField: "CategoryParentCode",
              label: {
                text: t("CategoryParentCode"),
              },
              editorOptions: {
                placeholder: t("Select"),
                dataSource: data ?? [],
                valueExpr: "CategoryCode",
                displayExpr: "CategoryName",
              },
              editorType: "dxSelectBox",
              caption: t("CategoryParentCode"),
              visible: true,
            },
            {
              dataField: "FlagActive",
              label: {
                text: t("FlagActive"),
              },
              editorOptions: {
                placeholder: t("Input"),
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
