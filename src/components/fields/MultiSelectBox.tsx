import { CheckBox } from "devextreme-react";
import { nanoid } from "nanoid";
import { useState } from "react";

const MultiSelectBox = ({
  component,
  formData,
  field,
  editType,
  listOption,
}: any) => {
  const [options, setOptions] = useState<any>(listOption);

  return (
    <div className={"flex w-full"}>
      <div className={"flex flex-col gap-3"}>
        <div className={"flex-col"}>
          <div className={"flex gap-3"}>
            {options.map((opt: any) => {
              return (
                <CheckBox
                  key={nanoid()}
                  name={`${field.ColCodeSys}`}
                  text={opt.Value}
                  defaultValue={opt.IsSelected}
                  onValueChanged={(e: any) => {
                    const value = e.value;
                    const formData = component.option("formData");
                    const data = formData[field.ColCodeSys!] || [];
                    // checked
                    if (value) {
                      data.push(opt.Value);
                    } else {
                      const index = data.findIndex(
                        (item: any) => item === opt.Value
                      );
                      if (index > -1) {
                        data.splice(index, 1);
                      }
                    }
                    component.updateData(field.ColCodeSys, data);
                  }}
                  readOnly={editType == "detail"}
                ></CheckBox>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiSelectBox;
