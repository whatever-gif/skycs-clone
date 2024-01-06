import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { SelectBox } from "devextreme-react";
import { atom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

export const countryInvoiceAtom = atom<any>(undefined);

const CountryInvoiceField = ({ param, customOptions, field }: any) => {
  const { component, formData } = param;

  const api = useClientgateApi();

  const [value, setValue] = useState<any>(undefined);

  const setCountryInvoice = useSetAtom(countryInvoiceAtom);

  const { data }: any = useQuery(["MstCountryGetAll"], async () => {
    const resp: any = await api.Mst_Country_GetAllActive();

    return resp?.DataList ?? [];
  });

  useEffect(() => {
    if (formData[field?.ColCodeSys]) {
      setValue(formData[field?.ColCodeSys]);
      setCountryInvoice(formData[field?.ColCodeSys]);
    }
  }, [formData[field?.ColCodeSys], data]);

  useEffect(() => {
    if (!formData[field?.ColCodeSys] && customOptions?.editType == "add") {
      setValue("VN");
      component.updateData(field?.ColCodeSys, "VN");
    }
  }, []);

  const result: any = data?.find(
    (item: any) => item?.CountryCode == value
  )?.CountryName;

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">{result ?? "---"}</div>
      ) : (
        <SelectBox
          dataSource={data ?? []}
          valueExpr="CountryCode"
          displayExpr="CountryName"
          onValueChanged={(e: any) => {
            component.updateData(field?.ColCodeSys, e.value);
            setValue(e.value);
            setCountryInvoice(e.value);
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

export default CountryInvoiceField;
