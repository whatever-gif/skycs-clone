import { TextBox } from "devextreme-react";
import { useEffect, useState } from "react";

const CustomerCodeSys = ({ param, customOptions }: any) => {
  const { component, formData } = param;

  const [value, setValue] = useState(formData["CustomerCode"]);

  useEffect(() => {
    if (formData["CustomerCode"]) {
      setValue(formData["CustomerCode"]);
    }
  }, [formData["CustomerCode"]]);

  const handleChange = (e: any) => {
    setValue(e.value);
    component.updateData("CustomerCode", e.value);
  };

  return (
    <TextBox
      value={value}
      onValueChanged={handleChange}
      readOnly={customOptions?.editType != "add"}
    />
  );
};

export default CustomerCodeSys;
