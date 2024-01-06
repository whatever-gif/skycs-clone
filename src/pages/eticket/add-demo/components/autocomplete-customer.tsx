import { defaultAvatar } from "@/components/fields/AvatarField";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { SelectBox, Validator } from "devextreme-react";
import { RequiredRule } from "devextreme-react/form";
import CustomStore from "devextreme/data/custom_store";

const AutocompleteCustomer = ({ field, errors }: any) => {
  const { t } = useI18n("Ticket_Add");

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
      return resp?.DataList.filter((i: any) => i.CustomerCode === key) ?? [];
    },
  });

  return (
    <div
      className={`relative flex w-full items-center my-[6px]  required  ${
        errors && "mb-2"
      }`}
    >
      <label className={"w-[160px] min-w-[160px] pr-[10px]"}>
        {t("CustomerCode")}
      </label>
      <SelectBox
        showClearButton
        searchEnabled
        dataSource={store}
        displayExpr="CustomerName"
        displayValue="CustomerName"
        itemRender={(param: any) => {
          return (
            <div className="flex gap-1 items-center">
              <img
                src={param.CustomerAvatarPath ?? defaultAvatar}
                alt=""
                className="w-[24px] h-[24px] rounded-[50%]"
              />
              <div>{param.CustomerName}</div>
              <div>
                {param?.mcerp_CustomerName && `- ${param?.mcerp_CustomerName}`}
              </div>
            </div>
          );
        }}
        onValueChanged={async (e: any) => {
          await field.onChange({
            target: {
              name: field.name,
              value: e.value,
            },
          });
        }}
        value={field?.value}
        className="w-full"
        isValid={!errors}
        validationError={errors}
        validationMessagePosition={"bottom"}
        validationMessageMode={"always"}
      >
        <Validator>
          <RequiredRule message={"This field is required"} />
        </Validator>
      </SelectBox>
    </div>
  );
};

export default AutocompleteCustomer;
