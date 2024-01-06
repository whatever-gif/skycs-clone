import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { SelectBox } from "devextreme-react";
import CustomStore from "devextreme/data/custom_store";
import { useState } from "react";

const DemoAuto = ({}: any) => {
  const { t: validateMessage } = useI18n("Validate");

  const api = useClientgateApi();

  const store = new CustomStore({
    key: "CustomerCode",
    cacheRawData: true,
    loadMode: "processed",
    load: async (loadOptions) => {
      const resp: any = await api.Mst_Customer_Search({
        KeyWord: loadOptions?.searchValue,
      });

      return resp?.DataList ?? [];
    },
    byKey: async (key: any) => {
      const resp: any = await api.Mst_Customer_Search({
        KeyWord: key,
      });

      return resp?.DataList ?? [];
    },
  });

  const defaultValue = {
    CustomerCodeSys: "CTMCS.DAH.68104",
    CustomerCode: "CTMCS.DAH.68103",
  };

  const [value, setValue] = useState(defaultValue);

  return (
    <SelectBox
      width={300}
      style={{ margin: 10 }}
      showClearButton
      searchEnabled
      dataSource={store}
      displayExpr="CustomerName"
      displayValue="CustomerName"
      itemRender={(param: any) => {
        return (
          <div className="flex gap-1 items-center">
            <div>{param.CustomerName}</div>
          </div>
        );
      }}
      onValueChanged={(e: any) => {
        console.log(e);
        setValue(e?.value);
      }}
      value={value}

      // itemTemplate={(param: any) => {
      //   console.log(param);
      //   return <div>{param.CustomerName}</div>;
      // }}
    />
  );
};

export default DemoAuto;
