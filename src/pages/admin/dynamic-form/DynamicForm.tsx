import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { getController } from "@/pages/eticket/add-demo/components/useCustomForm";
import { useQuery } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";

const DynamicFormEticket = ({
  control,
  errors,
}: {
  control: any;
  errors: any;
}) => {
  const { register } = useFormContext();

  const { t: validateMessage } = useI18n("Validate");

  const { auth } = useAuth();

  const api = useClientgateApi();

  const { data: listDynamicField } = useQuery(
    ["listDynamicFieldDemo"],
    async () => {
      const resp: any = await api.Mst_TicketColumnConfig_GetAllActive();

      const result = resp?.Data?.Lst_Mst_TicketColumnConfig;

      const listMasterData =
        result?.filter(
          (item: any) =>
            item?.TicketColCfgDataType == "MASTERDATA" ||
            item?.TicketColCfgDataType == "MASTERDATASELECTMULTIPLE"
        ) ?? [];

      const getMasterData: any = await api.Mst_TicketColumnConfig_GetListOption(
        listMasterData?.map((item: any) => item?.TicketColCfgCodeSys),
        auth?.orgData?.Id ?? ""
      );

      const listGetMasterData =
        getMasterData?.Data?.Lst_Mst_TicketColumnConfig ?? [];

      const newResult = result.map((item: any) => {
        const find = listGetMasterData?.find(
          (c: any) => c?.TicketColCfgCodeSys == item?.TicketColCfgCodeSys
        );

        const parsedList = JSON.parse(item?.JsonListOption ?? "[]");

        return {
          ...item,
          DataSource: find
            ? find?.Lst_MD_OptionValue
              ? find?.Lst_MD_OptionValue
              : []
            : parsedList,
        };
      });

      return newResult ?? [];
    }
  );

  function convertDotToUnderscore(str: string) {
    return str.replace(/\./g, "_");
  }

  const listFieldOdd = listDynamicField?.filter(
    (item: any, index: any) => index % 2 == 0
  );
  const listFieldEven = listDynamicField?.filter(
    (item: any, index: any) => index % 2 != 0
  );

  // console.log(errors.dynamic as any, Object.keys(errors.dynamic as any));

  const renderOdd = listFieldOdd?.map((item: any) => {
    const key = convertDotToUnderscore(String(item?.TicketColCfgCodeSys));

    const er = errors.dynamic
      ? Object.keys(errors?.dynamic)?.find((c: any) => c == key)
      : null;

    return (
      <Controller
        control={control}
        name={`dynamic.${key}`}
        render={({ field }) => {
          const t = <input {...register(`dynamic.${key}` as const)}></input>;

          return getController({
            currentField: item,
            controllerField: field,
            label: item?.TicketColCfgName,
            currentError: er ? errors?.dynamic?.[er] : null,
          });
        }}
        rules={
          item?.FlagCheckRequire == "1"
            ? {
                required: {
                  value: true,
                  message: validateMessage(
                    `${item?.TicketColCfgName} is required!`
                  ),
                },
              }
            : {}
        }
      ></Controller>
    );
  });

  const renderEven = listFieldEven?.map((item: any) => {
    const key = convertDotToUnderscore(String(item?.TicketColCfgCodeSys));

    const er = errors.dynamic
      ? Object.keys(errors?.dynamic)?.find((c: any) => c == key)
      : null;

    return (
      <Controller
        control={control}
        name={`dynamic.${key}`}
        render={({ field }) => {
          const t = <input {...register(`dynamic.${key}` as const)}></input>;
          return getController({
            currentField: item,
            controllerField: field,
            label: item?.TicketColCfgName,
            currentError: er ? errors?.dynamic?.[er] : null,
          });
        }}
        rules={
          item?.FlagCheckRequire == "1"
            ? {
                required: {
                  value: true,
                  message: validateMessage(
                    `${item?.TicketColCfgName} is required!`
                  ),
                },
              }
            : {}
        }
      ></Controller>
    );
  });

  return (
    <div className="flex flex-grow justify-start items-stretch basis-0 w-auto h-auto gap-5">
      <div className="flex flex-col" style={{ flex: "1 1 0px" }}>
        {renderOdd}
      </div>
      <div className="flex flex-col" style={{ flex: "1 1 0px" }}>
        {renderEven}
      </div>
    </div>
  );
};

export default DynamicFormEticket;
