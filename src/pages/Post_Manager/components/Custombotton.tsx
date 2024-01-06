import { SelectBox, TextBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import React, { memo, useState } from "react";

export default function Custombotton({ dataSelect, data, formRef }: any) {
  const [check, setCheck] = useState("");
  const [valueTags, setValueTags] = useState(undefined);
  // const setDataBotton = useSetAtom(dataBotton);
  const DataABC = [
    { text: "tagnhe", value: "tagcode" },
    { text: "tagko", value: "tagcodeABC" },
  ];

  return (
    <div>
      <div className={"flex items-center"}>
        {check === "abc" ? (
          <TextBox
            // width={290}
            placeholder="Input"
            onValueChanged={(e: any) => {
              setValueTags(e.value);
              // console.log(e.value);
              formRef.instance().updateData("Tag", e.value);
            }}
          ></TextBox>
        ) : (
          <SelectBox
            // width={290}
            dataSource={DataABC}
            displayExpr="text"
            valueExpr="value"
            placeholder="Select"
            onValueChanged={(e: any) => {
              setValueTags(e.value);
              formRef.instance().updateData("Tag", e.value);
            }}
          ></SelectBox>
        )}
        -
        <SelectBox
          // width={100}
          dataSource={dataSelect}
          displayExpr="text"
          valueExpr="value"
          onValueChanged={(e: any) => {
            setCheck(e.value);
          }}
          defaultValue={dataSelect[1].value}
        ></SelectBox>
      </div>
      <div>{valueTags}</div>
    </div>
  );
}
