import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { SelectBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { customerType } from "./CustomerCodeSysERPField";

const CustomerTypeField = ({ param, customOptions }: any) => {
  const { component, formData } = param;

  const setCustomerTypeValue = useSetAtom(customerType);

  const api = useClientgateApi();

  const [value, setValue] = useState<any>(undefined);

  const { data }: any = useQuery(
    ["CustomerTypeField"],
    api.Mst_CustomerType_GetAllCustomerType
  );

  useEffect(() => {
    if (formData["CustomerType"]) {
      setValue(formData["CustomerType"]);
      setCustomerTypeValue(formData["CustomerType"]);
    } else {
      if (data?.Data?.Lst_Mst_CustomerType?.length > 0) {
        setValue("CANHAN");
        setCustomerTypeValue("CANHAN");
        component.updateData("CustomerType", "CANHAN");
      }
    }
  }, [data]);

  const result: any = data?.Data?.Lst_Mst_CustomerType?.find(
    (item: any) => item?.CustomerType == value
  )?.CustomerTypeName;

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">{result ?? ""}</div>
      ) : (
        <SelectBox
          dataSource={data?.Data?.Lst_Mst_CustomerType ?? []}
          valueExpr="CustomerType"
          displayExpr="CustomerTypeName"
          onValueChanged={(e: any) => {
            component.updateData("CustomerType", e.value);
            setValue(e.value);
            setCustomerTypeValue(e.value);
          }}
          value={value}
          readOnly={customOptions?.editType == "detail"}
        ></SelectBox>
      )}
    </>
  );
};

export default CustomerTypeField;
