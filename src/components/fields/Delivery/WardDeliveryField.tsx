import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { SelectBox } from "devextreme-react";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { districtDeliveryAtom } from "./DistrictDeliveryField";
import { provinceDeliveryAtom } from "./ProvinceDeliveryField";

const WardDeliveryField = ({ param, customOptions, field }: any) => {
  const { component, formData } = param;

  const api = useClientgateApi();

  const [value, setValue] = useState<any>(undefined);

  const districtContract = useAtomValue(districtDeliveryAtom);
  const provinceContract = useAtomValue(provinceDeliveryAtom);

  const { data }: any = useQuery(
    ["MstWardDelivery", provinceContract, districtContract],
    async () => {
      if (districtContract && provinceContract) {
        const resp: any = await api.Mst_Ward_GetByProvinceCode({
          DistrictCode: districtContract,
          ProvinceCode: provinceContract,
        });

        return resp?.Data ?? [];
      } else {
        return [];
      }
    }
  );

  const { data: currentWard } = useQuery(
    ["currentWardDelivery", value],
    async () => {
      if (!value) {
        return undefined;
      }

      const resp: any = await api.Mst_Ward_GetByWardCode({
        WardCode: value,
      });

      return resp?.Data?.WardName ?? undefined;
    }
  );

  useEffect(() => {
    if (formData[field?.ColCodeSys]) {
      setValue(formData[field?.ColCodeSys]);
    } else {
      setValue(undefined);
      component.updateData(field?.ColCodeSys, undefined);
    }
  }, [formData[field?.ColCodeSys], data]);

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">{currentWard ?? "---"}</div>
      ) : (
        <SelectBox
          dataSource={data ?? []}
          valueExpr="WardCode"
          displayExpr="WardName"
          onValueChanged={(e: any) => {
            component.updateData(field?.ColCodeSys, e.value);
            setValue(e.value);
          }}
          value={value}
          readOnly={customOptions?.editType == "detail"}
          searchEnabled
          showClearButton
        ></SelectBox>
      )}
    </>
  );
};

export default WardDeliveryField;
