import { Switch } from "devextreme-react";

const ToggleActive = ({ field, readOnly }: any) => {
  const { onChange, ref, ...rest } = field;

  return (
    <Switch
      defaultValue={rest.value == "1"}
      readOnly={readOnly}
      onValueChanged={async (e: any) => {
        await onChange({
          target: {
            name: rest.name,
            value: e.value,
          },
        });
      }}
    />
  );
};

export default ToggleActive;
