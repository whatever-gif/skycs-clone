import { getDMY } from "@/utils/time";
import { format } from "date-fns";
import { DateBox } from "devextreme-react";
import { useEffect, useState } from "react";

const DateField = ({ param, customOptions, field, editType }: any) => {
  const { component, formData } = param;

  const [value, setValue] = useState<any>(undefined);

  console.log(formData[field?.ColCodeSys], value);

  useEffect(() => {
    if (formData[field?.ColCodeSys]) {
      setValue(formData[field?.ColCodeSys]);
    } else {
      if (customOptions?.editType != "detail") {
        setValue(new Date());
        component.updateData(field?.ColCodeSys, getDMY(new Date()));
      }
    }
  }, [formData[field?.ColCodeSys]]);

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">
          {value ? format(new Date(value), "yyyy-MM-dd").toString() : "---"}
        </div>
      ) : (
        <DateBox
          value={!value ? new Date() : new Date(value)}
          displayFormat="yyyy-MM-dd"
          name={field?.ColCodeSys}
          onValueChanged={(e: any) => {
            component.updateData(field?.ColCodeSys, getDMY(e.value));
          }}
          openOnFieldClick
          type="date"
          readOnly={editType == "detail"}
          placeholder="Select"
        />
      )}
    </>
  );
};

export default DateField;
