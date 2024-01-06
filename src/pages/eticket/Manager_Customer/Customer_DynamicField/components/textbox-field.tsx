import TextBox from "devextreme-react/text-box";

interface TextboxFieldProps {
  field: any;
  label: string;
  error?: any;
  required?: boolean;
  disabled?: boolean;
}

export const TextboxField = ({
  field,
  label,
  required = false,
  error,
  disabled,
}: TextboxFieldProps) => {
  const { onChange, ref, ...rest } = field;
  return (
    <div
      className={`my-2 flex items-center ${required ? "required" : ""} ${
        !!error ? "mb-4" : ""
      }`}
    >
      <label className={"w-[250px]"}>{label}</label>
      <TextBox
        disabled={disabled ? true : false}
        {...rest}
        className={"w-full"}
        defaultValue={rest.value}
        isValid={!error}
        validationError={error}
        validationMessagePosition={"bottom"}
        validationMessageMode={"always"}
        onValueChanged={async (e: any) => {
          await onChange({
            target: {
              name: rest.name,
              value: e.value,
            },
          });
        }}
      />
    </div>
  );
};
