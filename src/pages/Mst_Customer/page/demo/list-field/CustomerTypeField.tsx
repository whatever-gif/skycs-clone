import { useClientgateApi } from "@/packages/api";
import { SelectboxField } from "@/pages/admin/custom-field/components/selectbox-field";
import { useQuery } from "@tanstack/react-query";
// import { customerType } from "./CustomerCodeSysERPField";

const CustomerTypeField = ({ field, readOnly = false, label }: any) => {
  const { onChange, ref, value, ...rest } = field;

  console.log(field);

  // const setCustomerTypeValue = useSetAtom(customerType);

  const api = useClientgateApi();

  const { data }: any = useQuery(
    ["CustomerTypeField"],
    api.Mst_CustomerType_GetAllCustomerType
  );

  // useEffect(() => {
  //   if (formData["CustomerType"]) {
  //     setValue(formData["CustomerType"]);
  //     // setCustomerTypeValue(formData["CustomerType"]);
  //   } else {
  //     if (data?.Data?.Lst_Mst_CustomerType?.length > 0) {
  //       setValue("CANHAN");
  //       // setCustomerTypeValue("CANHAN");
  //       component.updateData("CustomerType", "CANHAN");
  //     }
  //   }
  // }, [data]);

  const result: any = data?.Data?.Lst_Mst_CustomerType?.find(
    (item: any) => item?.CustomerType == value
  )?.CustomerTypeName;

  return (
    <>
      {readOnly ? (
        <div className="font-semibold">{result ?? ""}</div>
      ) : (
        <SelectboxField
          field={field}
          label={label}
          dataSource={data?.Data?.Lst_Mst_CustomerType ?? []}
          valueExpr="CustomerType"
          displayExpr="CustomerTypeName"
          acceptOnchange
          disabled={readOnly}
        />
      )}
    </>
  );
};

export default CustomerTypeField;
