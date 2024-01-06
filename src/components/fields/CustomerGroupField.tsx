import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { TagBox } from "devextreme-react";
import { useEffect, useState } from "react";

const CustomerGroupField = ({ param, customOptions }: any) => {
  const { component, formData } = param;

  const api = useClientgateApi();

  const [value, setValue] = useState<any>([]);

  const { data }: any = useQuery(
    ["CustomerGroupField"],
    api.Mst_CustomerGroup_GetAllActive
  );

  useEffect(() => {
    if (formData["CustomerGrpCode"]) {
      setValue(formData["CustomerGrpCode"]);
    }
  }, []);

  const handleRenderTags = () => {
    const result =
      data?.DataList?.map((item: any) => {
        if (value?.find((c: any) => c == item?.CustomerGrpCode)) {
          return item?.CustomerGrpName;
        }
      }).filter((item: any) => item) ?? [];

    return (
      <div className="flex gap-2 flex-wrap">
        {result?.map((item: any) => {
          return (
            <div className="bg-[#EAF9F2] p-[5px] rounded-[5px] font-semibold">
              {item}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">{handleRenderTags() ?? ""}</div>
      ) : (
        <TagBox
          dataSource={data?.DataList ?? []}
          valueExpr="CustomerGrpCode"
          displayExpr="CustomerGrpName"
          onValueChanged={(e: any) => {
            component.updateData("CustomerGrpCode", e.value);
            setValue(e.value);
          }}
          value={value}
          readOnly={customOptions?.editType == "detail"}
          name="CustomerGrpCode"
          validationMessagePosition="bottom"
        ></TagBox>
      )}
    </>
  );
};

export default CustomerGroupField;
