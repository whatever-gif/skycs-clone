import { useClientgateApi } from "@/packages/api";
import { TagBoxField } from "@/pages/admin/custom-field/components/tagbox-field";
import { useQuery } from "@tanstack/react-query";
// import { customerType } from "./CustomerCodeSysERPField";

const CustomerGroupField = ({ field, readOnly = false, label }: any) => {
  const { onChange, ref, value, ...rest } = field;

  // const setCustomerTypeValue = useSetAtom(customerType);

  const api = useClientgateApi();

  const { data }: any = useQuery(
    ["CustomerGroupField"],
    api.Mst_CustomerGroup_GetAllActive
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
        <TagBoxField
          field={field}
          label={label}
          dataSource={data?.DataList ?? []}
          valueExpr="CustomerGrpCode"
          displayExpr="CustomerGrpName"
          readonly={readOnly}
        />
      )}
    </>
  );
};

export default CustomerGroupField;
