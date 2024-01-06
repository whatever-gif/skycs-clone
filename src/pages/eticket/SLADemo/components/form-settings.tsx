import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@/packages/common/Validation_Rules";

export const useFormSettings = () => {
  const { t } = useI18n("SLA_Form");

  const formSettings: any = [
    {
      colCount: 2,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          caption: t("SLALevel"),
          dataField: "SLALevel",
          editorOptions: {
            placeholder: t("Input"),
          },
          label: {
            text: t("SLALevel"),
          },
          editorType: "dxTextBox",
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("FirstResTime"),
          dataField: "FirstResTime",
          editorOptions: {
            type: "time",
          },
          label: {
            text: t("FirstResTime"),
          },
          editorType: "dxDateBox",
          visible: true,
          format: "HH:mm",
        },
        {
          dataField: "SLADesc",
          editorOptions: {
            placeholder: t("Input"),
          },
          label: {
            text: t("SLADesc"),
          },
          editorType: "dxTextArea",
          caption: t("SLADesc"),
          visible: true,
          validationRules: [requiredType],
        },
        {
          caption: t("ResolutionTime"),
          dataField: "ResolutionTime",
          label: {
            text: t("ResolutionTime"),
          },
          editorOptions: {
            type: "time",
          },
          editorType: "dxDateBox",
          visible: true,
          format: "HH:mm",
        },
        {},
        {
          caption: t("SLAStatus"),
          label: {
            text: t("SLAStatus"),
          },
          dataField: "SLAStatus",
          editorOptions: {},
          editorType: "dxSwitch",
          visible: true,
        },
      ],
    },
  ];

  return formSettings;
};
