import { useI18n } from "@/i18n/useI18n";
import {
  RequiredField,
  requiredEmailType,
  requiredType,
} from "@/packages/common/Validation_Rules";
import UploadAvatar from "./UploadAvatar";

export const useFormSettings = ({
  data,
  dataListDepartment,
  dataListGroup,
  datalistOrgID,
}: any) => {
  const { t } = useI18n("User_Mananger");

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
              dataField: "OrgID",
              editorType: "dxSelectBox",
              label: {
                text: t("OrgID"),
              },
              caption: t("OrgID"),
              visible: true,
              validationRules: [requiredType],
              editorOptions: {
                dataSource: datalistOrgID,
                valueExpr: "OrgID",
                displayExpr: "NNTFullName",
                readOnly: false,
                placeholder: t("Input"),
              },
            },
            {
              dataField: "CustomerGrpCode",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("CustomerGrpCode"),
              },
              editorType: "dxTextBox",
              caption: t("CustomerGrpCode"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "CustomerGrpName",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("CustomerGrpName"),
              },
              editorType: "dxTextBox",
              caption: t("CustomerGrpName"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "CustomerGrpDesc",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("CustomerGrpDesc"),
              },
              editorType: "dxTextBox",
              caption: t("CustomerGrpDesc"),
              visible: true,
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
