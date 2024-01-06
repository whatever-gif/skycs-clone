import { DateField } from "@/pages/admin/custom-field/components/date-field";
import { ListSelectBoxField } from "@/pages/admin/custom-field/components/list-select-box-field";
import { NumberBoxField } from "@/pages/admin/custom-field/components/numberbox-field";
import { RadioBoxField } from "@/pages/admin/custom-field/components/radiobox-field";
import { SelectboxField } from "@/pages/admin/custom-field/components/selectbox-field";
import { TagBoxField } from "@/pages/admin/custom-field/components/tagbox-field";
import { TextareaField } from "@/pages/admin/custom-field/components/textarea-field";
import { TextboxField } from "@/pages/admin/custom-field/components/textbox-field";
import { match } from "ts-pattern";
import CustomerCodeSysERPField from "./list-field/CustomerCodeSysERPField";
import CustomerGroupField from "./list-field/CustomerGroupField";
import CustomerTypeField from "./list-field/CustomerTypeField";
import { EmailField } from "./list-field/EmailField";
import { GovIDField } from "./list-field/GovIDField";
import PartnerTypeField from "./list-field/PartnerTypeField";
import { PhoneField } from "./list-field/PhoneField";

export const getController = ({
  dataType,
  currentField,
  controllerField,
  label,
  currentError,
}: any) => {
  const result = match(dataType)
    .with("TEXT", () => {
      return (
        <TextboxField
          field={controllerField}
          label={label}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
        />
      );
    })

    .with("MASTERDATA", () => {
      return (
        <SelectboxField
          field={controllerField}
          label={label}
          dataSource={currentField?.DataSource}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
          displayExpr={"Value"}
          valueExpr={"Key"}
          showClearButton={true}
        />
      );
    })

    .with("MASTERDATASELECTMULTIPLE", () => {
      return (
        <TagBoxField
          field={controllerField}
          label={label}
          dataSource={currentField?.DataSource}
          displayExpr={"Value"}
          valueExpr={"Key"}
          showClearButton={true}
        />
      );
    })

    .with("PASSWORD", () => {
      return (
        <TextboxField
          field={controllerField}
          label={label}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
          props={{
            mode: "password",
          }}
        />
      );
    })

    .with("PERCENT", () => {
      return (
        <NumberBoxField
          field={controllerField}
          label={label}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
          props={{
            format: "#0.00 '%'",
          }}
        />
      );
    })

    .with("DECIMAL", () => {
      return (
        <NumberBoxField
          field={controllerField}
          label={label}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
        />
      );
    })

    .with("INT", () => {
      return (
        <NumberBoxField
          field={controllerField}
          label={label}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
          props={{
            format: "#",
          }}
        />
      );
    })

    .with("DATE", () => {
      return (
        <DateField
          field={controllerField}
          label={label}
          displayFormat="yyyy-MM-dd"
          showClearButton={true}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
        />
      );
    })

    .with("DATETIME", () => {
      return (
        <DateField
          field={controllerField}
          label={label}
          displayFormat="yyyy-MM-dd HH:mm:ss"
          showClearButton={true}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
        />
      );
    })

    .with("SELECTMULTIPLEDROPDOWN", () => {
      return (
        <TagBoxField
          field={controllerField}
          label={label}
          dataSource={currentField?.DataSource}
          displayExpr={"Value"}
          valueExpr={"Value"}
          showClearButton={true}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
        />
      );
    })

    .with("SELECTMULTIPLESELECTBOX", () => {
      return (
        <ListSelectBoxField
          field={controllerField}
          label={label}
          dataSource={currentField?.DataSource}
          displayExpr={"Value"}
          valueExpr={"Value"}
          showClearButton={true}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
        />
      );
    })

    .with("SELECTONEDROPDOWN", () => {
      return (
        <SelectboxField
          field={controllerField}
          label={label}
          dataSource={currentField?.DataSource}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
          displayExpr={"Value"}
          valueExpr={"Value"}
          showClearButton={true}
        />
      );
    })

    .with("SELECTONERADIO", () => {
      const dataSource = currentField?.DataSource
        ? currentField.DataSource
        : currentField?.editorOptions?.items;

      return (
        <RadioBoxField
          field={controllerField}
          label={label}
          dataSource={dataSource}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
          displayExpr={"Value"}
          valueExpr={"Value"}
          showClearButton={true}
          defaultValue={
            dataSource?.find((item: any) => item?.IsSelected)?.Value ??
            dataSource?.[0]?.Value
          }
        />
      );
    })

    .with("TEXTAREA", () => {
      return (
        <TextareaField
          field={controllerField}
          label={label}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
        />
      );
    })

    .with("CUSTOMERTYPE", () => {
      return <CustomerTypeField field={controllerField} label={label} />;
    })

    .with("PARTNERTYPE", () => {
      return <PartnerTypeField field={controllerField} label={label} />;
    })

    .with("CUSTOMERCODESYSERP", () => {
      return <CustomerCodeSysERPField field={controllerField} label={label} />;
    })

    .with("BIRTHDAY", () => {
      return (
        <DateField
          field={controllerField}
          label={label}
          displayFormat="yyyy-MM-dd"
          showClearButton={true}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
        />
      );
    })

    .with("CUSTOMERGROUP", () => {
      return <CustomerGroupField field={controllerField} label={label} />;
    })

    .with("GOVID", () => {
      return <GovIDField field={controllerField} label={label} />;
    })

    .with("PHONE", () => {
      return <PhoneField field={controllerField} label={label} />;
    })

    .with("EMAIL", () => {
      return <EmailField field={controllerField} label={label} />;
    })

    .otherwise(() => (
      <TextboxField
        field={controllerField}
        label={label}
        required={currentField?.FlagCheckRequire == "1"}
        error={currentError}
      />
    ));

  return result;
};
