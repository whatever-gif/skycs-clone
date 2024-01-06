import { useClientgateApi } from "@/packages/api";
import { SelectboxField } from "@/pages/admin/custom-field/components/selectbox-field";
import { useQuery } from "@tanstack/react-query";
// import { customerType } from "./CustomerCodeSysERPField";

const CustomerCodeSysERPField = ({ field, readOnly = false, label }: any) => {
  const { onChange, ref, value, ...rest } = field;

  const api = useClientgateApi();

  const { data }: any = useQuery(["CustomerCodeSysERPField"], async () => {
    const resp: any = await api.Mst_Customer_Search({
      FlagActive: 1,
      Ft_PageIndex: 0,
      Ft_PageSize: 1000,
      CustomerType: "TOCHUC",
    });

    return resp?.DataList ?? [];
  });

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
          dataSource={data ?? []}
          valueExpr="CustomerCodeSys"
          displayExpr="CustomerName"
          acceptOnchange
          disabled={readOnly}
        />
      )}
    </>
  );
};

export default CustomerCodeSysERPField;
