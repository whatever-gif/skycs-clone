import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { SelectBox } from "devextreme-react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { provinceContactAtom } from "./ProvinceContactField";

export const districtContactAtom = atom<any>(undefined);

const DistrictContactField = ({ param, customOptions, field }: any) => {
  const { component, formData } = param;

  const provinceContact = useAtomValue(provinceContactAtom);
  const setDistrictContact = useSetAtom(districtContactAtom);

  const api = useClientgateApi();

  const [value, setValue] = useState<any>(undefined);

  const { data }: any = useQuery(
    ["MstDistrictContact", provinceContact],
    async () => {
      if (provinceContact) {
        const resp: any = await api.Mst_District_GetByProvinceCode({
          ProvinceCode: provinceContact,
        });

        return resp?.Data ?? [];
      } else {
        return [];
      }
    }
  );

  const { data: listAll }: any = useQuery(
    ["MstDistrictContactAll"],
    api.Mst_District_GetAllActive
  );

  useEffect(() => {
    if (formData[field?.ColCodeSys]) {
      setValue(formData[field?.ColCodeSys]);
      setDistrictContact(formData[field?.ColCodeSys]);
    } else {
      setValue(undefined);
      component.updateData(field?.ColCodeSys, undefined);
    }
  }, [formData[field?.ColCodeSys], data]);

  const result: any = listAll?.DataList?.find(
    (item: any) => item?.DistrictCode == value
  )?.DistrictName;

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">{result ?? "---"}</div>
      ) : (
        <SelectBox
          dataSource={data ?? []}
          valueExpr="DistrictCode"
          displayExpr="DistrictName"
          onValueChanged={(e: any) => {
            component.updateData(field?.ColCodeSys, e.value);
            setValue(e.value);
            setDistrictContact(e.value);
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

export default DistrictContactField;
