import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { TagBox } from "devextreme-react";
import { useEffect, useState } from "react";

const PartnerTypeField = ({ param, customOptions }: any) => {
  const { component, formData } = param;

  const { t: validate } = useI18n("Validate");

  const api = useClientgateApi();

  const [value, setValue] = useState<any[]>([]);

  const { data }: any = useQuery(
    ["PartnerTypeField"],
    api.Mst_PartnerType_GetAllActive
  );

  useEffect(() => {
    if (formData["PartnerType"]) {
      setValue(formData["PartnerType"]);
    } else {
      if (data?.DataList?.length > 0) {
        setValue(["CUSTOMER"]);
        component.updateData("PartnerType", ["CUSTOMER"]);
      }
    }
  }, [data]);

  const handleRenderTags = () => {
    const result =
      data?.DataList?.map((item: any) => {
        if (value?.find((c: any) => c == item?.PartnerType)) {
          return item?.PartnerTypeName;
        }
      }).filter((item: any) => item) ?? [];

    return (
      <div className="flex gap-2 flex-wrap">
        {result?.map((item: any) => {
          return (
            <div className="bg-[#EAF9F2] p-[5px] rounded-[5px]">{item}</div>
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
          valueExpr="PartnerType"
          displayExpr="PartnerTypeName"
          onValueChanged={(e: any) => {
            component.updateData("PartnerType", e.value);
            setValue(e.value);
          }}
          value={value}
          isValid={value.length > 0}
          validationErrors={[
            {
              type: "required",
              message: validate("Required"),
            },
          ]}
          validationMessagePosition={"bottom"}
          validationMessageMode={"always"}
          className="mb-2"
          searchEnabled
        ></TagBox>
      )}
    </>
  );
};

export default PartnerTypeField;
