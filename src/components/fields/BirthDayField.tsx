import { getDMY } from "@/utils/time";
import { format, isValid } from "date-fns";
import { DateBox, Validator } from "devextreme-react";
import { RequiredRule } from "devextreme-react/form";
import React, { useEffect, useMemo, useState } from "react";

const BirthDayField = ({ param, customOptions, field, editType }: any) => {
  const { component, formData } = param;

  const validatorRef: any = React.useRef(null);

  const [value, setValue] = useState<any>(undefined);

  useEffect(() => {
    if (formData[field?.ColCodeSys]) {
      setValue(formData[field?.ColCodeSys]);
    }
  }, []);

  const render = useMemo(() => {
    return (
      <DateBox
        value={
          isValid(new Date(value)) && value != null && value != undefined
            ? new Date(value)
            : undefined
        }
        displayFormat="yyyy-MM-dd"
        name={field?.ColCodeSys}
        onValueChanged={(e: any) => {
          if (e.value == null) {
            component.updateData(field?.ColCodeSys, getDMY(e.value));
            setValue(undefined);
          } else {
            component.updateData(field?.ColCodeSys, getDMY(e.value));
            setValue(e.value);
          }
        }}
        openOnFieldClick
        type="date"
        readOnly={editType == "detail"}
        validationMessageMode={"always"}
        validationMessagePosition="bottom"
      >
        <Validator ref={validatorRef}>
          <RequiredRule message="Vui lòng nhập Ngày sinh!" />
        </Validator>
      </DateBox>
    );
  }, [value]);

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">
          {value ? format(new Date(value), "yyyy-MM-dd").toString() : "---"}
        </div>
      ) : (
        render
      )}
    </>
  );
};

export default BirthDayField;
