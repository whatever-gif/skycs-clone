import dxForm from "devextreme/ui/form";
import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import { DateBox } from "devextreme-react";
import { isAfter, isBefore } from "date-fns";
import "./date-range-field.scss";

interface DateRangeFieldProps {
  formInstance: dxForm;
  onValueChanged: (files: any) => void;
  dataField?: string;
  className?: string;
  defaultValue?: any;
  allowEmpty?: boolean;
}

export const DateRangeField = forwardRef(
  (
    {
      formInstance,
      dataField,
      allowEmpty = false,
      onValueChanged,
      className = "",
      defaultValue,
    }: DateRangeFieldProps,
    ref: ForwardedRef<any>
  ) => {
    const fromRef = useRef<DateBox>(null);
    const toRef = useRef<DateBox>(null);
    useEffect(() => {
      // parse default value
      if (defaultValue && defaultValue.length) {
        // const fromValue = defaultValue[0]
        //   ? new Date(defaultValue[0])
        //   : undefined;
        // const toValue = defaultValue[1] ? new Date(defaultValue[1]) : undefined;
        fromRef.current?.instance.option("value", defaultValue[0]);
        toRef.current?.instance.option("value", defaultValue[1]);
      }
    }, [defaultValue]);
    const handleValueFromChanged = (e: any) => {
      const { value } = e;
      const toValue = toRef.current?.instance.option("value") as Date;
      if (toValue && isAfter(value, toValue)) {
        e.cancel = true;
        setError("DateFromIsInvalid");
      } else {
        setError("");
        onValueChanged({ value: [value, toValue] });
      }
    };
    const [error, setError] = useState("");
    const handleValueToChanged = (e: any) => {
      const { value } = e;
      const fromValue = fromRef.current?.instance.option("value") as Date;
      if (fromValue && isBefore(value, fromValue)) {
        e.cancel = true;
        setError("DateToIsInvalid");
      } else {
        setError("");
        onValueChanged({ value: [fromValue, value] });
      }
    };
    return (
      <div className={`date-range-field ${className}`}>
        <div className={"flex items-center"}>
          <div className={""}>
            <DateBox
              width={100}
              ref={fromRef}
              isValid={!error}
              openOnFieldClick={true}
              displayFormat={"yyyy-MM-dd"}
              showClearButton={allowEmpty}
              onValueChanged={handleValueFromChanged}
            />
          </div>
          <div className={"mx-0.5"}>-</div>
          <div className={""}>
            <DateBox
              ref={toRef}
              width={100}
              isValid={!error}
              openOnFieldClick={true}
              displayFormat={"yyyy-MM-dd"}
              showClearButton={allowEmpty}
              onValueChanged={handleValueToChanged}
            />
          </div>
        </div>
        {!!error && (
          <div className={"mt-1"}>
            <span className={"text-red-600 text-xs"}>{error}</span>
          </div>
        )}
      </div>
    );
  }
);
