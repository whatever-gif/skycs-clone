import { TextBox } from "devextreme-react";
import dxForm from "devextreme/ui/form";
import React, { useState } from "react";
import { ValidationRule } from "devextreme-react/common";
import "./PasswordField.scss";

interface TextFieldProps {
  formInstance: dxForm;
  dataField: string;
  onValueChanged?: (e: any) => void;
  placeholder?: string;
  width?: any;
  readOnly?: boolean;
  validationRules?: ValidationRule[];
  validationGroup?: string;
  defaultValue?: string;
  showClearButton?: boolean;
}

export default function PasswordField({
  formInstance,
  dataField,
  width = 270,
  placeholder,
  validationRules,
  validationGroup,
  onValueChanged,
  readOnly = false,
  defaultValue,
  showClearButton = false,
}: TextFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleChanged = (e: any) => {
    if (!onValueChanged) {
      formInstance.updateData(dataField, e.value);
    } else {
      onValueChanged(e);
    }
  };
  return (
    <>
      <div className="relative text-field">
        <TextBox
          width={width}
          mode={isPasswordVisible ? "text" : "password"}
          onValueChanged={handleChanged}
          placeholder={placeholder}
          showClearButton={showClearButton}
          readOnly={readOnly}
          defaultValue={defaultValue}
          validationMessagePosition={"bottom"}
          validationMessageMode={"always"}
        />
        <div
          className="absolute top-[7px] right-[12px]"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? (
            <img
              src="https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/je5FEJkU1_K.png"
              alt=""
            />
          ) : (
            <img
              src="https://static.xx.fbcdn.net/rsrc.php/v3/yk/r/swFqSxKYa5M.png"
              alt=""
            />
          )}
        </div>
      </div>
    </>
  );
}
