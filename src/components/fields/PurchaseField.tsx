import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { SelectBox } from "devextreme-react";
import { useEffect, useState } from "react";

const PurchaseField = ({ param, customOptions, field }: any) => {
  const { component, formData } = param;

  const api = useClientgateApi();

  const [value, setValue] = useState<any>(undefined);

  const { data }: any = useQuery(["PurchaseField"], async () => {
    const resp: any = await api.Mst_PaymentTermController_GetAllActive();

    return (
      resp?.DataList?.filter((item: any) => item?.PTType == "PURCHASE") ?? []
    );
  });

  useEffect(() => {
    if (formData[field?.ColCodeSys]) {
      setValue(formData[field?.ColCodeSys]);
    }
  }, [data]);

  const result: any = data?.find(
    (item: any) => item?.PaymentTermCode == value
  )?.PaymentTermName;

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">{result ?? ""}</div>
      ) : (
        <SelectBox
          dataSource={data ?? []}
          valueExpr="PaymentTermCode"
          displayExpr="PaymentTermName"
          onValueChanged={(e: any) => {
            component.updateData(field?.ColCodeSys, e.value);
            setValue(e.value);
          }}
          value={value}
          readOnly={customOptions?.editType == "detail"}
        ></SelectBox>
      )}
    </>
  );
};

export default PurchaseField;
