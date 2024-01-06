import { useClientgateApi } from "@/packages/api";
import { SelectBox } from "devextreme-react";
import CustomStore from "devextreme/data/custom_store";

const CustomerBox = () => {
  const api = useClientgateApi();

  const store = new CustomStore({
    key: "CustomerCode",
    load: async (loadOptions) => {
      if (!loadOptions.searchValue) {
        return [];
      }

      const resp: any = await api.Mst_Customer_Search({
        KeyWord: loadOptions?.searchValue,
      });
      return resp?.DataList ?? [];
    },
    byKey: async (key: any) => {
      if (!key) {
        return [];
      }

      const resp: any = await api.Mst_Customer_Search({
        KeyWord: key,
      });
      return resp?.DataList ?? [];
    },
  });

  return (
    <div className="flex gap-1 items-center">
      <label htmlFor="CustomerCode">CustomerCode</label>
      <div className="flex gap-3">
        <SelectBox
          placeholder="Nhập tên, SĐT, Email, Mã KH để tìm"
          dataSource={store}
          showClearButton
          className="flex-grow"
          itemRender={(e: any) => {
            return e.CustomerName;
          }}
          valueExpr="CustomerCode"
          displayExpr="CustomerName"
          onSelectionChanged={(e: any) => {}}
          searchEnabled
          searchTimeout={200}
          name="CustomerCode"
        ></SelectBox>
      </div>
    </div>
  );
};

export default CustomerBox;
