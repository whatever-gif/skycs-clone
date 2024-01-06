import {CheckBox} from "devextreme-react";
interface CheckboxFieldProps {
  field: any;
  label: string;
  readonly?: boolean;
}
export const CheckboxField = ({label, field, readonly}: CheckboxFieldProps) => {
  const {onChange, ref, ...rest} = field
  return (
    <div className={'my-2'}>
      <CheckBox
        {...rest}
        className={'ml-[130px]'}
        readOnly={readonly}
        onValueChanged={async (e: any) => {
          await onChange({
            target: {
              name: rest.name,
              value: e.value
            }
          })
        }}
      />
      <label className={'ml-2'}>{label}</label>
    </div>
  )
}