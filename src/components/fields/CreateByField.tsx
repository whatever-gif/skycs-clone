import { useAuth } from "@/packages/contexts/auth";
import { TextBox } from "devextreme-react";
import { useEffect, useState } from "react";

const CreateByField = ({ param, customOptions }: any) => {
  const { auth } = useAuth();

  const { component, formData } = param;

  const [value, setValue] = useState<any>(undefined);

  useEffect(() => {
    if (formData["CreateBy"]) {
      setValue(formData["CreateBy"]);
    } else {
      component.updateData("CreateBy", auth?.currentUser?.Email);
      setValue(auth?.currentUser?.Email);
    }
  }, [auth]);

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">{value ?? ""}</div>
      ) : (
        <TextBox readOnly value={value}></TextBox>
      )}
    </>
  );
};

export default CreateByField;
