import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { AutoComplete } from "antd";
import { useState } from "react";
import { Controller } from "react-hook-form";

const CustomerAutoComplete = ({ control, setValue }: any) => {
  const { t: validateMessage } = useI18n("Validate");

  const api = useClientgateApi();

  // const store = new CustomStore({
  //   key: "CustomerCode",
  //   cacheRawData: true,
  //   loadMode: "processed",
  //   load: async (loadOptions) => {
  //     const resp: any = await api.Mst_Customer_Search({
  //       KeyWord: loadOptions?.searchValue,
  //     });

  //     return resp?.DataList ?? [];
  //   },
  //   byKey: async (key: any) => {
  //     const resp: any = await api.Mst_Customer_Search({
  //       KeyWord: key,
  //     });

  //     return resp?.DataList ?? [];
  //   },
  // });

  const [value, setACValue] = useState("");
  const [options, setOptions] = useState<any[]>([]);

  const onSelect = (data: any) => {
    console.log("onSelect", data);
  };

  const onChange = (data: any) => {
    // setValue(data);
    console.log(data);
  };

  const onSearch = async (text: any) => {
    const resp: any = await api.Mst_Customer_Search({
      KeyWord: text,
    });

    const result = resp?.DataList?.map((item: any) => {
      return {
        label: item?.CustomerName,
        value: item?.CustomerCode,
      };
    });

    setOptions(result);
  };

  return (
    <Controller
      name={"CustomerCode"}
      control={control}
      render={({ field }) => {
        return (
          <div className="flex gap-2 w-full items-center">
            <AutoComplete
              options={options}
              style={{ width: 200 }}
              onSelect={onSelect}
              onSearch={onSearch}
              onChange={onChange}
              placeholder="input here"
            />
            {/* <SelectBox
              value={rest.value}
              dataSource={store}
              displayExpr={"CustomerName"}
              showClearButton={true}
              searchEnabled
              onValueChanged={async (e: any) => {
                setValue("isLoading", true);
                await onChange({
                  target: {
                    name: "CustomerCode",
                    value: e.value,
                  },
                });
                setValue("isLoading", false);
              }}
            ></SelectBox> */}
          </div>
        );
      }}
      rules={{
        required: {
          value: true,
          message: validateMessage("CustomerCode is required!"),
        },
      }}
    />
  );
};

export default CustomerAutoComplete;
