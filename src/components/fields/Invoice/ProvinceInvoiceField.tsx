import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { SelectBox } from "devextreme-react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { countryInvoiceAtom } from "./CountryInvoiceField";

export const provinceInvoiceAtom = atom<any>(undefined);

const ProvinceInvoiceField = ({ param, customOptions, field }: any) => {
  const { component, formData } = param;

  const countryInvoice = useAtomValue(countryInvoiceAtom);

  const setProvinceInvoice = useSetAtom(provinceInvoiceAtom);

  const api = useClientgateApi();

  const [value, setValue] = useState<any>(undefined);

  const { data }: any = useQuery(
    ["MstProvinceInvoice", countryInvoice],
    async () => {
      if (countryInvoice) {
        const resp: any = await api.Mst_Province_GetByCountryCode({
          CountryCode: countryInvoice,
        });

        return resp?.Data ?? [];
      } else {
        return [];
      }
    }
  );

  const { data: listAll }: any = useQuery(
    ["MstProvinceInvoiceAll"],
    api.Mst_Province_GetAllActive
  );

  useEffect(() => {
    if (formData[field?.ColCodeSys]) {
      setValue(formData[field?.ColCodeSys]);
    } else {
      setValue(undefined);
      component.updateData(field?.ColCodeSys, undefined);
    }
  }, [formData["ProvinceCodeInvoice"], data]);

  const result: any = listAll?.DataList?.find(
    (item: any) => item?.ProvinceCode == value
  )?.ProvinceName;

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">{result ?? "---"}</div>
      ) : (
        <SelectBox
          dataSource={data ?? []}
          valueExpr="ProvinceCode"
          displayExpr="ProvinceName"
          onValueChanged={(e: any) => {
            component.updateData(field?.ColCodeSys, e.value);
            setValue(e.value);
            setProvinceInvoice(e.value);
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

export default ProvinceInvoiceField;
