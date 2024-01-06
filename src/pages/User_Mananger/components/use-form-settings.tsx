import { useI18n } from "@/i18n/useI18n";
import {
  RequiredField,
  requiredEmailType,
  requiredType,
} from "@/packages/common/Validation_Rules";
import { authAtom } from "@/packages/store";
import { useAtomValue } from "jotai";

export const useFormSettings = ({
  dataMST,
  dataListDepartment,
  dataListGroup,
}: any) => {
  const { t } = useI18n("User_Mananger");
  const auth = useAtomValue(authAtom);
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
              dataField: "EMail",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("EMail"),
              },
              editorType: "dxTextBox",
              caption: t("EMail"),
              visible: true,
              validationRules: [
                requiredEmailType,
                RequiredField(t("EmailIsRequired")),
              ],
            },
            {
              dataField: "UserName",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("UserName"),
              },
              editorType: "dxTextBox",
              caption: t("UserName"),
              visible: true,
              validationRules: [RequiredField(t("UserNameIsRequired"))],
            },
            {
              label: {
                text: t("PhoneNo"),
              },
              dataField: "PhoneNo",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("PhoneNo"),
              visible: true,
            },

            {
              label: {
                text: t("UserPassword"),
              },
              dataField: "UserPassword",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("UserPassword"),
              visible: true,
              validationRules: [RequiredField(t("UserPasswordIsRequired"))],
            },
            {
              dataField: "ReUserPassword",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              label: {
                text: t("Re-Enter the password"),
              },
              caption: t("ReUserPassword"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              label: {
                text: t("ACLanguage"),
              },
              dataField: "ACLanguage",
              editorOptions: {
                dataSource: [{ text: t("Tiếng Việt"), value: "vi" }],
                displayExpr: "text",
                valueExpr: "value",
                placeholder: t("Input"),
              },
              editorType: "dxSelectBox",
              caption: t("ACLanguage"),
              visible: true,
            },
            {
              label: {
                text: t("ACTimeZone"),
              },
              dataField: "ACTimeZone",
              editorOptions: {
                placeholder: t("Input"),
                dataSource: [{ text: t("UTC+7"), value: "7" }],
                displayExpr: "text",
                valueExpr: "value",
              },
              editorType: "dxSelectBox",
              caption: t("ACTimeZone"),
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
              dataField: "MST",
              editorOptions: {
                placeholder: t("Input"),
                dataSource: dataMST ?? [],
                displayExpr: "NNTFullName",
                valueExpr: "MST",
              },
              label: {
                text: t("Chi nhánh"),
              },
              editorType: "dxSelectBox",
              caption: t("MST"),
              visible: true,
              validationRules: [RequiredField(t("MSTisRequired"))],
            },
            {
              dataField: "DepartmentName",
              label: {
                text: t("DepartmentName"),
              },
              editorOptions: {
                placeholder: t("Select"),
                dataSource:
                  dataListDepartment?.filter(
                    (item: any) => item.OrgID === auth.orgId.toString()
                  ) ?? [],
                displayExpr: "DepartmentName",
                valueExpr: "DepartmentCode",
                searchEnabled: true,
              },
              editorType: "dxTagBox",
              caption: t("DepartmentName"),
              visible: true,
            },
            {
              label: {
                text: t("GroupName"),
              },
              dataField: "GroupName",
              editorOptions: {
                dataSource: dataListGroup ?? [],
                displayExpr: "GroupName",
                valueExpr: "GroupCode",
                placeholder: t("Select"),
                searchEnabled: true,
              },
              editorType: "dxTagBox",
              caption: t("GroupName"),
              visible: true,
            },
            {
              label: {
                text: t("FlagSysAdmin"),
              },
              dataField: "FlagSysAdmin",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxSwitch",
              caption: t("FlagSysAdmin"),
              visible: true,
            },
            {
              label: {
                text: t("FlagNNTAdmin"),
              },
              dataField: "FlagNNTAdmin",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxSwitch",
              caption: t("FlagNNTAdmin"),
              visible: true,
            },
            {
              label: {
                text: t("FlagActive"),
              },
              dataField: "FlagActive",
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

  const formSettingWhenSuccess: any = [
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
              dataField: "EMail",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("EMail"),
              },
              editorType: "dxTextBox",
              caption: t("EMail"),
              visible: true,
              validationRules: [
                requiredEmailType,
                RequiredField(t("EmailIsRequired")),
              ],
            },
            {
              label: {
                text: t("UserName"),
              },
              dataField: "UserName",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("UserName"),
              visible: true,
              validationRules: [RequiredField(t("UserNameIsRequired"))],
            },
            {
              label: {
                text: t("PhoneNo"),
              },
              dataField: "PhoneNo",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("PhoneNo"),
              visible: true,
            },
            {
              label: {
                text: t("ACId"),
              },
              dataField: "ACId",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxTextBox",
              caption: t("ACId"),
              visible: true,
            },
            {
              label: {
                text: t("ACLanguage"),
              },
              dataField: "ACLanguage",
              editorOptions: {
                dataSource: [{ text: t("Tiếng Việt"), value: "vi" }],
                displayExpr: "text",
                valueExpr: "value",
                placeholder: t("Input"),
              },
              editorType: "dxSelectBox",
              caption: t("ACLanguage"),
              visible: true,
            },
            {
              label: {
                text: t("ACTimeZone"),
              },
              dataField: "ACTimeZone",
              editorOptions: {
                placeholder: t("Input"),
                dataSource: [{ text: t("UTC+7"), value: "7" }],
                displayExpr: "text",
                valueExpr: "value",
              },
              editorType: "dxSelectBox",
              caption: t("ACTimeZone"),
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
              dataField: "MST",
              editorOptions: {
                placeholder: t("Input"),
                dataSource: dataMST ?? [],
                displayExpr: "NNTFullName",
                valueExpr: "MST",
              },
              label: {
                text: t("NNT"),
              },
              editorType: "dxSelectBox",
              caption: t("MST"),
              visible: true,
              validationRules: [RequiredField(t("MSTisRequired"))],
            },
            {
              label: {
                text: t("DepartmentName"),
              },
              dataField: "DepartmentName",
              editorOptions: {
                placeholder: t("Select"),
                dataSource:
                  dataListDepartment?.filter(
                    (item: any) => item.OrgID === auth.orgId.toString()
                  ) ?? [],
                displayExpr: "DepartmentName",
                valueExpr: "DepartmentCode",
                searchEnabled: true,
              },
              editorType: "dxTagBox",
              caption: t("DepartmentName"),
              visible: true,
            },
            {
              label: {
                text: t("GroupName"),
              },
              dataField: "GroupName",
              editorOptions: {
                dataSource: dataListGroup ?? [],
                displayExpr: "GroupName",
                valueExpr: "GroupCode",
                placeholder: t("Select"),
                searchEnabled: true,
              },
              editorType: "dxTagBox",
              caption: t("GroupName"),
              visible: true,
            },
            {
              label: {
                text: t("FlagSysAdmin"),
              },
              dataField: "FlagSysAdmin",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxSwitch",
              caption: t("FlagSysAdmin"),
              visible: true,
            },
            {
              label: {
                text: t("FlagNNTAdmin"),
              },
              dataField: "FlagNNTAdmin",
              editorOptions: {
                placeholder: t("Input"),
              },
              editorType: "dxSwitch",
              caption: t("FlagNNTAdmin"),
              visible: true,
            },
            {
              label: {
                text: t("FlagActive"),
              },
              dataField: "FlagActive",
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

  return {
    formSettings: formSettings,
    formSettingWhenSuccess: formSettingWhenSuccess,
  };
};
