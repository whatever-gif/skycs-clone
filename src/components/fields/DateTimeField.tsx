import { getFullTime } from "@/utils/time";
import { DateBox } from "devextreme-react";

const DateTimeField = ({ param, customOptions, field, editType }: any) => {
  const { component, formData } = param;

  const date: any = new Date(formData[field?.ColCodeSys]);

  return (
    <DateBox
      defaultValue={isNaN(date) ? new Date() : date}
      displayFormat="yyyy-MM-dd HH:mm:ss"
      name={field?.ColCodeSys}
      onValueChanged={(e: any) => {
        component.updateData(field?.ColCodeSys, getFullTime(e.value));
      }}
      type="datetime"
      openOnFieldClick
      readOnly={editType == "detail"}
    />
  );
};

export default DateTimeField;
