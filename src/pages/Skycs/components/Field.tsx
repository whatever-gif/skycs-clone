import React from "react";
import TextBox from "devextreme-react/text-box";
import { nanoid } from "nanoid";
import { CheckBox } from "devextreme-react";
import "./FieldStyle.scss";

export default function Field(data: any) {
  console.log("data 123", data);
  return (
    <div className="custom-item">
      <TextBox className="product-name" defaultValue={123} readOnly={true} />
    </div>
  );
}

export const CheckBoxRender = (data: any, checked: string) => {
  // console.log("dataa ", data);
  var d = document.createElement("div");
  d.className = "d-flex align-center";
  d.innerHTML = `<input type="checkbox"/> <p class="ml-2">${data.SpecCode}</p>`;
  return d;
};
