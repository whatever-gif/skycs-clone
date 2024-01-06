import {
  ApiResponse,
  MdMetaColGroup,
  MdMetaColGroupSpec,
  MdMetaColGroupSpecDto,
  MdMetaColGroupSpecListOption,
  MdMetaColGroupSpecSearchParam,
  MdMetaColumnDataType,
  MdOptionValue,
} from "@/packages/types";
import { AxiosInstance } from "axios";
import { match } from "ts-pattern";
export const useCustomFieldApi = (apiBase: AxiosInstance) => {
  return {
    MDMetaColGroupSpec_GetListOption: async (
      colCodes: (string | undefined)[]
    ): Promise<ApiResponse<MdMetaColGroupSpecListOption[]>> => {
      return await apiBase.post<
        {},
        ApiResponse<MdMetaColGroupSpecListOption[]>
      >(
        "MDMetaColGroupSpec/GetListOption",
        {
          ColCodeSys: colCodes.join(","),
          ScrTplCodeSys: "ScrTplCodeSys.2023",
          // FlagActive: "1",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    Seq_GetColCodeSys: async (): Promise<ApiResponse<string>> => {
      return await apiBase.post<{}, ApiResponse<string>>(
        "Seq/GetColCodeSys",
        {}
      );
    },
    MdMetaColGroupSpec_Delete: async (
      param: Partial<MdMetaColGroupSpec>
    ): Promise<ApiResponse<MdMetaColGroupSpec[]>> => {
      return await apiBase.post<
        MdMetaColGroupSpecSearchParam,
        ApiResponse<MdMetaColGroupSpec[]>
      >("/MDMetaColGroupSpec/Delete", {
        strJson: JSON.stringify(param),
      });
    },
    MdMetaColGroupSpec_Search: async (
      param: any,
      ScrTplCodeSys?: string
    ): Promise<ApiResponse<MdMetaColGroupSpec[]>> => {
      return await apiBase.post<
        MdMetaColGroupSpecSearchParam,
        ApiResponse<MdMetaColGroupSpec[]>
      >("/MDMetaColGroupSpec/Search", {
        ...param,
        Ft_PageSize: 1000,
        ScrTplCodeSys: ScrTplCodeSys ?? "ScrTplCodeSys.2023",
      });
    },
    MDMetaColumnOperatorType_GetAllActive: async (): Promise<
      ApiResponse<MdOptionValue>
    > => {
      return await apiBase.post<{}, ApiResponse<MdOptionValue>>(
        "MDMetaColumnOperatorType/GetAllActive",
        {}
      );
    },
    MDOptionValue_GetAllMasterDataTable: async (): Promise<
      ApiResponse<MdOptionValue>
    > => {
      return await apiBase.post<{}, ApiResponse<MdOptionValue>>(
        "MDOptionValue/GetAllMasterDataTable",
        {}
      );
    },
    MDMetaColumnDataType_GetAllActive: async (): Promise<
      ApiResponse<MdMetaColumnDataType[]>
    > => {
      return await apiBase.post<{}, ApiResponse<MdMetaColumnDataType[]>>(
        "MDMetaColumnDataType/GetAllActive",
        {}
      );
    },
    // MdMetaColGroupApi_Search: async (param: Partial<MdMetaColGroupSpecSearchParam>): Promise<ApiResponse<MdMetaColGroup>> => {
    //   return await apiBase.post<MdMetaColGroupSpecSearchParam, ApiResponse<MdMetaColGroup>>(
    //     "/MDMetaColGroup/Search",
    //     {
    //       ...param,
    //       ScrTplCodeSys: "ScrTplCodeSys.2023"
    //     }
    //   );
    // },
    MdMetaColGroupApi_Search: async (
      param: Partial<any>
    ): Promise<ApiResponse<MdMetaColGroup[]>> => {
      return await apiBase.post<any, ApiResponse<MdMetaColGroup[]>>(
        "/MDMetaColGroup/Search",
        {
          ...param,
        }
      );
    },

    MDMetaColGroupSpec_Create: async (
      param: Partial<MdMetaColGroupSpecDto>
    ): Promise<ApiResponse<MdMetaColGroupSpec>> => {
      const listOption = match(param.ColDataType)
        .with("SELECTONERADIO", () =>
          param.ListOption?.map((item, index) => {
            return {
              ...item,
              IsSelected: param.DefaultIndex === index.toString(),
            };
          })
        )
        .with("SELECTONEDROPBOX", () =>
          param.ListOption?.map((item, index) => {
            return {
              ...item,
              IsSelected: param.DefaultIndex === index.toString(),
            };
          })
        )
        .otherwise(() => {
          return param.ListOption;
        });

      const outParam = {
        ...param,
        ColOperatorType: param.ColOperatorType || "EQUAL",
        ColCodeSys: param.ColCode,
        FlagIsNotNull: param.IsRequired ? "1" : "0",
        FlagIsCheckDuplicate: param.IsUnique ? "1" : "0",
        FlagIsQuery: param.IsSearchable ? "1" : "0",
        FlagActive: param.Enabled ? "1" : "0",
        JsonListOption: listOption
          ? JSON.stringify(
              listOption.map((item, index) => {
                return {
                  ...item,
                  OrderIdx: index,
                };
              })
            )
          : "[]",
      };
      if (param.ColDataType === "MASTERDATA") {
        outParam.JsonListOption = JSON.stringify([{ Value: param.DataSource }]);
      }
      if (param.ColDataType === "MASTERDATASELECTMULTIPLE") {
        outParam.JsonListOption = JSON.stringify([{ Value: param.DataSource }]);
      }
      return await apiBase.post<
        MdMetaColGroupSpecDto,
        ApiResponse<MdMetaColGroupSpec>
      >("MDMetaColGroupSpec/Create", {
        strJson: JSON.stringify(outParam),
      });
    },

    MDMetaColGroupSpec_Create_MapByExcel: async (
      param: Partial<MdMetaColGroupSpecDto>
    ): Promise<ApiResponse<MdMetaColGroupSpec>> => {
      return await apiBase.post<
        MdMetaColGroupSpecDto,
        ApiResponse<MdMetaColGroupSpec>
      >("MDMetaColGroupSpec/Create", {
        strJson: JSON.stringify(param),
      });
    },

    MDMetaColGroupSpec_Update: async (
      param: Partial<MdMetaColGroupSpecDto>
    ): Promise<ApiResponse<MdMetaColGroupSpec>> => {
      const listOption = match(param.ColDataType)
        .with("SELECTONERADIO", () =>
          param.ListOption?.map((item, index) => {
            return {
              ...item,
              IsSelected: param.DefaultIndex === index.toString(),
            };
          })
        )
        .with("SELECTONEDROPBOX", () =>
          param.ListOption?.map((item, index) => {
            return {
              ...item,
              IsSelected: param.DefaultIndex === index.toString(),
            };
          })
        )
        .otherwise(() => {
          return param.ListOption;
        });
      const outParam = {
        ...param,
        ColOperatorType: param.ColOperatorType || "EQUAL",
        FlagIsNotNull: param.IsRequired ? "1" : "0",
        FlagIsCheckDuplicate: param.IsUnique ? "1" : "0",
        FlagIsQuery: param.IsSearchable ? "1" : "0",
        FlagActive: param.Enabled ? "1" : "0",
        JsonListOption: listOption
          ? JSON.stringify(
              listOption.map((item, index) => {
                return {
                  ...item,
                  OrderIdx: index,
                };
              })
            )
          : "[]",
      };
      if (param.ColDataType === "MASTERDATA") {
        outParam.JsonListOption = JSON.stringify([{ Value: param.DataSource }]);
      }
      if (param.ColDataType === "MASTERDATASELECTMULTIPLE") {
        outParam.JsonListOption = JSON.stringify([{ Value: param.DataSource }]);
      }
      delete outParam.Enabled;
      delete outParam.IsRequired;
      delete outParam.IsUnique;
      delete outParam.IsSearchable;
      delete outParam.ListOption;
      delete outParam.DefaultIndex;

      return await apiBase.post<
        MdMetaColGroupSpecDto,
        ApiResponse<MdMetaColGroupSpec>
      >("MDMetaColGroupSpec/Update", {
        strJson: JSON.stringify(outParam),
        ColsUpd:
          "ColDataType,ColCaption,ColOperatorType,OrderIdx,JsonListOption,FlagIsNotNull,FlagIsCheckDuplicate,FlagIsQuery,FlagActive",
      });
    },

    MDMetaColGroupSpec_Delete: async (
      param: Partial<MdMetaColGroupSpecDto>
    ): Promise<ApiResponse<MdMetaColGroupSpec>> => {
      const outParam = {
        ...param,
        ColOperatorType: param.ColOperatorType || "EQUAL",
        // ColCodeSys: param.ColCode,
        FlagIsNotNull: param.IsRequired ? "1" : "0",
        FlagIsCheckDuplicate: param.IsUnique ? "1" : "0",
        FlagIsQuery: param.IsSearchable ? "1" : "0",
        FlagActive: param.Enabled ? "1" : "0",
        JsonListOption: "[]",
      };
      if (param.ColDataType === "MASTERDATA") {
        outParam.JsonListOption = JSON.stringify([{ Value: param.DataSource }]);
      }
      return await apiBase.post<
        MdMetaColGroupSpecDto,
        ApiResponse<MdMetaColGroupSpec>
      >("MDMetaColGroupSpec/Delete", {
        strJson: JSON.stringify(outParam),
      });
    },
    MDMetaColGroupSpec_UpdateOrderIdx: async (
      columns: MdMetaColGroupSpecDto[]
    ) => {
      return await apiBase.post<
        MdMetaColGroupSpecDto[],
        ApiResponse<MdMetaColGroupSpec[]>
      >("MDMetaColGroupSpec/UpdateOrderIdx", {
        strJson: JSON.stringify(columns),
      });
    },

    MDMetaColGroupSpec_Save: async ({ screen, data }: any) => {
      return await apiBase.post<any[], ApiResponse<any[]>>(
        "MDMetaColGroupSpec/Save",
        {
          ScrTplCodeSys: screen,
          strJson: JSON.stringify(data),
        }
      );
    },
  };
};
