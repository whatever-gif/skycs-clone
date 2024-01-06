import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { SelectBox } from "devextreme-react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { countryContactAtom } from "./CountryContactField";

export const provinceContactAtom = atom<any>(undefined);

const ProvinceContactField = ({ param, customOptions, field }: any) => {
  const { component, formData } = param;

  const countryContact = useAtomValue(countryContactAtom);

  const setProvinceContact = useSetAtom(provinceContactAtom);

  const api = useClientgateApi();

  const [value, setValue] = useState<any>(undefined);

  console.log(countryContact);

  const { data }: any = useQuery(
    ["MstProvinceContact", countryContact],
    async () => {
      if (countryContact) {
        const resp: any = await api.Mst_Province_GetByCountryCode({
          CountryCode: countryContact,
        });

        return resp?.Data ?? [];
      } else {
        return [];
      }
    }
  );

  const { data: listAll }: any = useQuery(
    ["MstProvinceContactAll"],
    api.Mst_Province_GetAllActive
  );

  useEffect(() => {
    if (formData[field?.ColCodeSys]) {
      setValue(formData[field?.ColCodeSys]);
    } else {
      setValue(undefined);
      component.updateData(field?.ColCodeSys, undefined);
    }
  }, [formData["ProvinceCodeContact"], data]);

  const result: any = listAll?.DataList?.find(
    (item: any) => item?.ProvinceCode == value
  )?.ProvinceName;

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">{result ?? "---"}</div>
      ) : (
        <SelectBox
          items={data ?? []}
          valueExpr="ProvinceCode"
          displayExpr="ProvinceName"
          onValueChanged={(e: any) => {
            component.updateData(field?.ColCodeSys, e.value);
            setValue(e.value);
            setProvinceContact(e.value);
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

export default ProvinceContactField;
