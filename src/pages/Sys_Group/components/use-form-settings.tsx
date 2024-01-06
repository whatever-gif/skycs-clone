import { useI18n } from "@/i18n/useI18n";
import { uniqueFilterByDataField } from "@/packages/common";
import {
  RequiredField,
  requiredType,
} from "@/packages/common/Validation_Rules";
import { SysUserData, Sys_GroupController } from "@/packages/types";
import { showPopupUser } from "@/pages/User_Mananger/components/store";
import { useAtomValue, useSetAtom } from "jotai";
import { dataEticketAtom, showInfoObjAtom } from "./store";
import { CheckBox } from "devextreme-react";
import { useMemo } from "react";

interface Mst_DepartmentControlColumnsProps {
  data: any;
}

export const useFormSettings = ({
  data,
}: Mst_DepartmentControlColumnsProps) => {
  const { t } = useI18n("Sys_Group-forms");
  const setPopup = useSetAtom(showPopupUser);
  const setShowInfoObj = useSetAtom(showInfoObjAtom);
  const viewRow = (data: any) => {
    setShowInfoObj(false);
    setPopup(true);
    // setShowDetail(true);
  };

  const formSettings = [
    {
      colCount: 1,
      labelLocation: "left",
      typeForm: "textForm",
      items: [
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 2,
          cssClass: "",
          items: [
            {
              dataField: "GroupCode",
              editorType: "dxTextBox",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("GroupCode"),
              },
              caption: t("GroupCode"),
              validationRules: [RequiredField(t("GroupCodeIsRequired"))],
              visible: true,
            },
            {
              label: {
                text: t("GroupName"),
              },
              dataField: "GroupName",
              editorType: "dxTextBox",
              editorOptions: {
                placeholder: t("Input"),
              },
              caption: t("GroupName"),
              validationRules: [RequiredField(t("GroupNameIsRequired"))],
              visible: true,
            },
            {
              label: {
                text: t("GroupDesc"),
              },
              dataField: "GroupDesc",
              editorType: "dxTextArea",
              editorOptions: {
                placeholder: t("Input"),
                height: 45,
              },
              caption: t("GroupDesc"),
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
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 2,
          cssClass: "",
          items: [],
        },
      ],
    },
    {
      labelLocation: "left",
      colCount: 1,
      typeForm: "EticketForm",
      items: [
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 4,
          cssClass: "",
          items: [
            {
              dataField: "FlagViewUserAction", // ticket quá hạn
              caption: t("FlagViewUserAction"),
              visible: true,
              label: {
                text: t("FlagViewUserAction"),
              },
              colSpan: 1,
              cssClass:
                "flex align-items-center labeltop w-full flex-direction-row-reverse justify-space-flex-end",
              editorType: "dxCheckBox",
              editorOptions: {
                readOnly: true,
                value: true,
              },
            },
            {
              dataField: "FlagViewDepartment", // ticket quá hạn
              caption: t("FlagViewDepartment"),
              visible: true,
              label: {
                text: t("FlagViewDepartment"),
              },
              colSpan: 1,
              cssClass:
                "flex align-items-center labeltop flex-direction-row-reverse justify-space-flex-end",
              editorType: "dxCheckBox",
              editorOptions: {
                defaultValue: false,
              },
            },
            {
              dataField: "FlagViewCompany", // ticket quá hạn
              caption: t("FlagViewCompany"),
              visible: true,
              label: {
                text: t("FlagViewCompany"),
              },
              colSpan: 2,
              cssClass:
                "flex align-items-center labeltop flex-direction-row-reverse justify-space-flex-end",
              editorType: "dxCheckBox",
              editorOptions: {
                defaultValue: false,
              },
            },
            {
              dataField: "FlagViewAll", // ticket quá hạn
              caption: t("FlagViewAll"),
              visible: true,
              label: {
                text: t("FlagViewAll"),
              },
              colSpan: 2,
              cssClass:
                "flex align-items-center labeltop flex-direction-row-reverse justify-space-flex-end",
              editorType: "dxCheckBox",
              editorOptions: {
                defaultValue: false,
              },
            },
          ],
        },
      ],
    },
    {
      typeForm: "TableForm",
      items: [
        {
          dataField: "Idx",
          label: {
            text: t("Idx"),
          },
          caption: t("STT"),
          alignment: "center",
          columnIndex: 1,
          visible: true,
          cellRender: ({ data, rowIndex, value }: any) => {
            return <div>{rowIndex + 1}</div>;
          },
          width: 85,
        },
        {
          dataField: "EMail",
          label: {
            text: t("EMail"),
          },
          editorOptions: {
            placeholder: t("Input"),
          },
          editorType: "dxTextBox",
          caption: t("EMail"),
          visible: true,
        },
        {
          dataField: "UserName",
          editorOptions: {
            readOnly: true,
            placeholder: t("Input"),
          },
          label: {
            text: t("UserName"),
          },
          editorType: "dxTextBox",
          caption: t("UserName"),
          visible: true,
        },
        {
          dataField: "PhoneNo",
          editorOptions: {
            readOnly: true,
            placeholder: t("Input"),
          },
          label: {
            text: t("PhoneNo"),
          },
          editorType: "dxTextBox",
          caption: t("PhoneNo"),
          visible: true,
        },
      ],
      hidden: false,
    },
  ];

  return formSettings;
};
