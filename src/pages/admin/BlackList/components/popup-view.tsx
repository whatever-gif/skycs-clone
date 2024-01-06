import { useAtomValue } from "jotai";
import React, { useRef } from "react";
import { flagAtom, formValueAtom, visiblePopupAtom } from "./store";
import { Button, Form, Popup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import { useI18n } from "@/i18n/useI18n";
import { ColumnOptions } from "@/types";
import { SimpleItem } from "devextreme-react/form";
import "./style.scss";
import {
  RequiredField,
  requiredPhoneType,
} from "@/packages/common/Validation_Rules";
import { nanoid } from "nanoid";
interface Props {
  onEdit: any;
  title: string;
  oncancel: any;
}

const PopupView = ({ onEdit, title, oncancel }: Props) => {
  const visiblePopUp = useAtomValue(visiblePopupAtom);
  const formValue = useAtomValue(formValueAtom);
  const flag = useAtomValue(flagAtom);
  const formRef: any = useRef();
  const { t } = useI18n("BlackList");
  const handleEdit = () => {
    const formData = formRef?.current.instance.option("formData");
    const valid = formRef?.current.instance.validate();
    const { isValid } = valid;
    if (isValid) {
      onEdit(formData, flag);
    } else {
    }
  };

  const formList: ColumnOptions[] = [
    {
      dataField: "Number",
      label: {
        text: t("Number"),
      },
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: flag === "Add" ? false : true,
      },
      validationRules: [RequiredField(t("Number is Required"))],
    },
    {
      dataField: "Remark",
      label: {
        text: t("Remark"),
      },
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: flag !== "Detail" ? false : true,
      },
      validationRules: [RequiredField(t("Remark is Required"))],
    },
    {
      dataField: "Enabled",
      label: {
        text: t("Enabled"),
      },
      editorType: "dxSwitch",
      editorOptions: {
        disabled: flag !== "Detail" ? false : true,
      },
    },
  ];

  return (
    <Popup
      position={"center"}
      showCloseButton={true}
      onHiding={oncancel}
      title={t(flag + " " + title)}
      visible={visiblePopUp}
      height={350}
      width={600}
    >
      <div className="black-list black-list-popup">
        <Form formData={formValue} ref={formRef}>
          {formList.map((value: any, index: number) => {
            return <SimpleItem key={nanoid()} {...value} />;
          })}
        </Form>
      </div>

      <ToolbarItem toolbar={"bottom"} location={"after"}>
        <Button
          text={t("Save")}
          type={"default"}
          visible={flag !== "Detail"}
          stylingMode={"contained"}
          onClick={handleEdit}
          className={" w-[100px]"}
        />
        <Button
          text={t("Cancel")}
          stylingMode={"outlined"}
          type={"normal"}
          onClick={oncancel}
          className={" w-[100px]"}
        />
      </ToolbarItem>
    </Popup>
  );
};

export default PopupView;
