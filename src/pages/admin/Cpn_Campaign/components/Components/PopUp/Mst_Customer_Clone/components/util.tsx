import { RequiredField } from "@/packages/common/Validation_Rules";
import { MdMetaColGroupSpecDto } from "@/packages/types";
import { Switch } from "devextreme-react";
import { IItemProps } from "devextreme-react/form";
import { useMemo } from "react";
import { match } from "ts-pattern";
interface FormRenderContentProps {
  datasourceMapping: { [key: string]: any };
  customFields: any[];
}

export const mapEditorType = (dataType: string) => {
  return match(dataType)
    .with("SELECTMANY", () => "dxTagBox")
    .with("SELECTONE", () => "dxSelectBox")
    .with("DATE", () => "dxDateBox")
    .with("EMAIL", () => "dxTextBox")
    .with("FLAG", () => "dxSwitch")
    .with("MASTERDATA", () => "dxSelectBox")
    .otherwise(() => "dxTextBox");
};

export const mapEditorOption = (
  field: Partial<MdMetaColGroupSpecDto>,
  listDynamic?: any
) => {
  const commonOptions = {
    searchEnabled: true,
    validationMessageMode: "always",
  };
  return match(field.ColDataType)
    .with("DATE", () => {
      return {
        ...commonOptions,
        type: "date",
        displayFormat: "yyyy-MM-dd",
        openOnFieldClick: true,
      };
    })
    .with("DATETIME", () => {
      return {
        ...commonOptions,
        type: "datetime",
        openOnFieldClick: true,
      };
    })
    .with("EMAIL", () => {
      return {
        ...commonOptions,
      };
    })
    .with("FLAG", () => {
      return {
        ...commonOptions,
      };
    })
    .with("SELECTONE", () => {
      return {
        dataSource: JSON.parse(field.JsonListOption || "[]"),
        displayExpr: "Value",
        valueExpr: "Value",
      };
    })
    .with("SELECTMANY", () => {
      return {
        dataSource: JSON.parse(field.JsonListOption || "[]"),
        displayExpr: "Value",
        valueExpr: "Value",
      };
    })
    .with("MASTERDATA", () => {
      return {
        dataSource: listDynamic[`${field.ColCodeSys}`] ?? [],
        displayExpr: "Value",
        valueExpr: "Key",
      };
    })
    .otherwise(() => {
      return {
        ...commonOptions,
      };
    });
};

export const mapValidationRules = (field: Partial<MdMetaColGroupSpecDto>) => {
  const rules = [];
  if (field.ColDataType !== "FLAG" && field.FlagIsNotNull === "1") {
    rules.push(RequiredField(field.ColCaption!));
  }
  if (field.ColDataType === "EMAIL") {
    rules.push({
      type: "email",
      message: "Email is not valid",
    });
  }
  return rules;
};

export const flagFieldRender = (data: any) => {
  // console.log("data:", data);
  let valueChanged = (e: any) => {
    data.component.updateData(data.dataField, e.value ? "1" : "0");
  };

  return (
    <Switch
      defaultValue={data.editorOptions.value === "1"}
      onValueChanged={valueChanged}
    ></Switch>
  );
};

export const mapCustomOptions = (field: Partial<MdMetaColGroupSpecDto>) => {
  return match(field.ColDataType)
    .with("SELECTONE", () => ({
      validationMessagePosition: "top",
    }))
    .with("SELECTMANY", () => ({
      validationMessagePosition: "top",
    }))
    .with("FLAG", () => ({
      editorType: undefined,
      render: (data: any) => flagFieldRender(data),
    }))
    .otherwise(() => ({}));
};

export const FormRenderContent = ({
  datasourceMapping,
  customFields,
}: FormRenderContentProps) => {
  const mapValidationRules = (field: Partial<MdMetaColGroupSpecDto>) => {
    const rules = [];
    if (field.ColDataType !== "FLAG" && field.FlagIsNotNull === "1") {
      rules.push(RequiredField(field.ColCaption!));
    }
    if (field.ColDataType === "EMAIL") {
      rules.push({
        type: "email",
        message: "Email is not valid",
      });
    }
    return rules;
  };

  const formSettings = useMemo<IItemProps[]>(() => {
    const items: IItemProps[] = customFields.map<IItemProps>((field) => {
      return {
        dataField: field.ColCode,
        editorType: mapEditorType(field.ColDataType!),
        label: {
          text: field.ColCaption,
        },
        validationMessagePosition: "bottom",
        editorOptions: mapEditorOption(field),
        validationRules: mapValidationRules(field),
        ...mapCustomOptions(field),
      };
    });
    items.push({
      itemType: "button",
      buttonOptions: {
        text: "Submit",
        useSubmitBehavior: true,
      },
    });
    return items;
  }, []);

  return formSettings;
};
