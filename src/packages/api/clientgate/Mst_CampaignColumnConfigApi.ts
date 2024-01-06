import {
  ApiResponse,
  Mst_CampaignColumnConfig,
  Mst_CampaignColumnConfig_GetCampaignColCfgCodeSys,
  SearchCustomerParam,
} from "@packages/types";
import { AxiosInstance } from "axios";
import { match } from "ts-pattern";

export const useMst_CampaignColumnConfig = (apiBase: AxiosInstance) => {
  return {
    Mst_CampaignColumnConfig_Search: async (): Promise<
      ApiResponse<Mst_CampaignColumnConfig[]>
    > => {
      return await apiBase.post<
        SearchCustomerParam,
        ApiResponse<Mst_CampaignColumnConfig[]>
      >("/MstCampaignColumnConfig/GetAll", {});
    },

    Mst_CampaignColumnConfig_GetAllActive: async (): Promise<
      ApiResponse<Mst_CampaignColumnConfig[]>
    > => {
      return await apiBase.post<
        SearchCustomerParam,
        ApiResponse<Mst_CampaignColumnConfig[]>
      >("/MstCampaignColumnConfig/GetAllActive", {});
    },

    Mst_CampaignColumnConfig_GetCampaignColCfgCodeSys: async (): Promise<
      ApiResponse<Mst_CampaignColumnConfig_GetCampaignColCfgCodeSys>
    > => {
      return await apiBase.post<
        any,
        ApiResponse<Mst_CampaignColumnConfig_GetCampaignColCfgCodeSys>
      >("/Seq/GetCampaignColCfgCodeSys", {});
    },

    Mst_CampaignColumnConfig_GetListOption: async (
      CampaignColCfgCodeSys: string[]
    ): Promise<
      ApiResponse<Mst_CampaignColumnConfig_GetCampaignColCfgCodeSys>
    > => {
      return await apiBase.post<
        any,
        ApiResponse<Mst_CampaignColumnConfig_GetCampaignColCfgCodeSys>
      >("/MstCampaignColumnConfig/GetListOption", {
        CampaignColCfgCodeSys: CampaignColCfgCodeSys.join(","),
      });
    },

    Mst_CampaignColumnConfig_Create: async (
      param: any
    ): Promise<ApiResponse<Partial<Mst_CampaignColumnConfig>>> => {
      const listOption = match(param.CampaignColCfgDataType)
        .with("SELECTONE", () =>
          param.ListOption?.map((item: any, index: number) => {
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
        CampaignColCfgDataType: param.CampaignColCfgDataType || "EQUAL",
        CampaignColCfgCode: param.CampaignColCfgCode,
        FlagActive: param.FlagActive ? "1" : "0",
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
      if (
        param.CampaignColCfgDataType === "MASTERDATA" ||
        param.CampaignColCfgDataType === "MASTERDATASELECTMULTIPLE"
      ) {
        outParam.JsonListOption = JSON.stringify([{ Value: param.DataSource }]);
      }

      return apiBase.post<Partial<any>, ApiResponse<Mst_CampaignColumnConfig>>(
        "/MstCampaignColumnConfig/Create",
        {
          strJson: JSON.stringify({
            Lst_Mst_CampaignColumnConfig: [outParam],
          }),
        }
      );
    },

    Mst_CampaignColumnConfig_Update: async (
      param: Partial<Mst_CampaignColumnConfig>
    ): Promise<ApiResponse<Mst_CampaignColumnConfig>> => {
      const listOption = match(param.CampaignColCfgDataType)
        .with("SELECTONE", () =>
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

      const outParam: any = {
        ...param,
        CampaignColCfgDataType: param.CampaignColCfgDataType || "EQUAL",
        CampaignColCfgCode: param.CampaignColCfgCode,
        FlagActive: param.FlagActive ? "1" : "0",
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

      delete outParam.ListOption;
      if (
        param.CampaignColCfgDataType === "MASTERDATA" ||
        param.CampaignColCfgDataType === "MASTERDATASELECTMULTIPLE"
      ) {
        outParam.JsonListOption = JSON.stringify([{ Value: param.DataSource }]);
      }

      return await apiBase.post("/MstCampaignColumnConfig/Update", {
        strJson: JSON.stringify({
          Lst_Mst_CampaignColumnConfig: [outParam],
        }),
      });
    },

    Mst_CampaignColumnConfig_Delete: async (param: any) => {
      return await apiBase.post<any, ApiResponse<any>>(
        "/MstCampaignColumnConfig/Delete",
        {
          strJson: JSON.stringify(param),
        }
      );
    },
  };
};
