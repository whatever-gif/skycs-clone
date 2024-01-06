import dxForm from "devextreme/ui/form";
import {ForwardedRef, forwardRef, useRef, useState} from "react";
import {NumberBox} from "devextreme-react";

interface NumberRangeFieldProps {
  formInstance: dxForm;
  onValueChanged: (files: any) => void;
  dataField?: string;
  className?: string;
}

export const NumberRangeField = forwardRef(({
                                              formInstance,
                                              dataField,
                                              onValueChanged,
                                              className = 'ml-2'
                                            }: NumberRangeFieldProps, ref: ForwardedRef<any>) => {
  const fromRef = useRef<NumberBox>(null)
  const toRef = useRef<NumberBox>(null)
  const handleValueFromChanged = (e: any) => {
    const {value} = e;
    const toValue = toRef.current?.instance.option("value")
    if (toValue && toValue < value) {
      e.cancel = true
      setError("ValueFromIsInvalid")
    } else {
      setError("")
      const val = {from: value, to: toValue}
      onValueChanged(val)
    }
  }
  const [error, setError] = useState("")
  const handleValueToChanged = (e: any) => {
    const {value} = e;
    const fromValue = fromRef.current?.instance.option("value")
    if (fromValue && value < fromValue) {
      e.cancel = true;
      setError("ValueToIsInvalid")
    } else {
      setError("")
      const val = {from: fromValue, to: value}
      onValueChanged(val)
    }
  }
  return (
    <div className={className}>
      <div className={'flex items-center'}>
        <div className={""}>
          <NumberBox width={120}
                     ref={fromRef}
                     inputAttr={{
                       style: 'text-align: right;'
                     }}
                     isValid={!error}
                     onValueChanged={handleValueFromChanged}
          />
        </div>
        <div className={'mx-1'}>-</div>
        <div className={""}>
          <NumberBox
            ref={toRef}
            inputAttr={{
              style: 'text-align: right;'
            }}
            width={120}
            isValid={!error}
            onValueChanged={handleValueToChanged}
          />
        </div>
      </div>
      {!!error && (
        <div className={"mt-1"}>
          <span className={"text-red-600 text-xs"}>
          {error}
          </span>
        </div>
      )}
    </div>
  )
})
