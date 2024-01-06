import { DateField } from "@/pages/admin/custom-field/components/date-field";
import { ListSelectBoxField } from "@/pages/admin/custom-field/components/list-select-box-field";
import { NumberBoxField } from "@/pages/admin/custom-field/components/numberbox-field";
import { RadioBoxField } from "@/pages/admin/custom-field/components/radiobox-field";
import { SelectboxField } from "@/pages/admin/custom-field/components/selectbox-field";
import { TagBoxField } from "@/pages/admin/custom-field/components/tagbox-field";
import { TextareaField } from "@/pages/admin/custom-field/components/textarea-field";
import { TextboxField } from "@/pages/admin/custom-field/components/textbox-field";
import { match } from "ts-pattern";

export const getController = ({
  currentField,
  controllerField,
  label,
  currentError,
}: any) => {
  const result = match(currentField?.TicketColCfgDataType)
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
      return (
        <RadioBoxField
          field={controllerField}
          label={label}
          dataSource={currentField?.DataSource}
          required={currentField?.FlagCheckRequire == "1"}
          error={currentError}
          displayExpr={"Value"}
          valueExpr={"Value"}
          showClearButton={true}
          defaultValue={
            currentField?.DataSource?.find((item: any) => item?.IsSelected)
              ?.Value ?? currentField?.DataSource?.[0]?.Value
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
