import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { SelectBox } from "devextreme-react";
import { atom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export const customerType = atom<any>(null);

const CustomerCodeSysERPField = ({ param, customOptions }: any) => {
  const { component, formData } = param;

  const api = useClientgateApi();

  const [value, setValue] = useState<any>(undefined);

  const customerTypeValue = useAtomValue(customerType);

  const { data }: any = useQuery(
    ["CustomerCodeSysERPField", customerTypeValue],
    async () => {
      const resp: any = await api.Mst_Customer_Search({
        FlagActive: 1,
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
        CustomerType: "TOCHUC",
      });

      return resp?.DataList ?? [];
    }
  );

  useEffect(() => {
    if (
      formData["CustomerCodeSysERP"] &&
      data?.some(
        (item: any) => item?.CustomerCodeSys == formData["CustomerCodeSysERP"]
      )
    ) {
      setValue(formData["CustomerCodeSysERP"]);
    }
  }, [formData["CustomerCodeSysERP"], data]);

  const result: any = data?.find(
    (item: any) => item?.CustomerCodeSys == value
  )?.CustomerName;

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">{result ?? "---"}</div>
      ) : (
        <SelectBox
          dataSource={data ?? []}
          valueExpr="CustomerCodeSys"
          displayExpr="CustomerName"
          onValueChanged={(e: any) => {
            component.updateData("CustomerCodeSysERP", e.value);
            setValue(e.value);
          }}
          value={value}
          readOnly={customOptions?.editType == "detail"}
        ></SelectBox>
      )}
    </>
  );
};

export default CustomerCodeSysERPField;
