import {
  ApiResponse,
  MstTicketColumnConfig,
  MstTicketColumnConfigDtoParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";
import { match } from "ts-pattern";

export interface Response_TicketColumnConfig {
  Lst_Mst_TicketColumnConfig: MstTicketColumnConfig[];
}

export interface Delete_Param {
  TicketColCfgCodeSys: string;
  OrgID: string;
}

export const use_MstTicketColumnConfigApi = (apiBase: AxiosInstance) => {
  return {
    Mst_TicketColumnConfig_GetListOption: async (
      TicketColCfgCodeSys: (string | undefined)[],
      OrgID: string
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<{}, ApiResponse<any[]>>(
        "MstTicketColumnConfig/GetListOption",
        {
          TicketColCfgCodeSys: TicketColCfgCodeSys.join(","),
          OrgID: OrgID,
        }
      );
    },
    Mst_TicketColumnConfig_UpdateTicketColCfgIdx: async (
      param: any[]
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<{}, ApiResponse<any[]>>(
        "MstTicketColumnConfig/UpdateTicketColCfgIdx",
        {
          strJson: JSON.stringify({ Lst_Mst_TicketColumnConfig: param }),
        }
      );
    },
    Seq_GetTicketColCfgCodeSys: async (): Promise<ApiResponse<string>> => {
      return await apiBase.post<{}, ApiResponse<string>>(
        "Seq/GetTicketColCfgCodeSys",
        {}
      );
    },
    Mst_TicketColumnConfig_GetAll: async (): Promise<
      ApiResponse<Response_TicketColumnConfig>
    > => {
      return await apiBase.post<any, ApiResponse<Response_TicketColumnConfig>>(
        "/MstTicketColumnConfig/GetAll",
        {}
      );
    },
    Mst_TicketColumnConfig_GetAllActive: async (): Promise<
      ApiResponse<any>
    > => {
      return await apiBase.post<{}, ApiResponse<any>>(
        "MstTicketColumnConfig/GetAllActive",
        {}
      );
    },
    Mst_TicketColumnConfig_Create: async (
      param: MstTicketColumnConfigDtoParam
    ): Promise<ApiResponse<Response_TicketColumnConfig>> => {
      const listOption = match(param.TicketColCfgDataType)
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
      if (param.TicketColCfgDataType === "MASTERDATA") {
        outParam.JsonListOption = JSON.stringify([{ Value: param.DataSource }]);
      }
      if (param.TicketColCfgDataType === "MASTERDATASELECTMULTIPLE") {
        outParam.JsonListOption = JSON.stringify([{ Value: param.DataSource }]);
      }
      let pushParam = {
        Lst_Mst_TicketColumnConfig: [outParam],
      };
      // console.log("outParam: ", outParam);
      return await apiBase.post<
        Response_TicketColumnConfig,
        ApiResponse<Response_TicketColumnConfig>
      >("MstTicketColumnConfig/Create", {
        strJson: JSON.stringify(pushParam),
      });
    },
    Mst_TicketColumnConfig_Update: async (
      param: MstTicketColumnConfigDtoParam
    ): Promise<ApiResponse<Response_TicketColumnConfig>> => {
      const listOption = match(param.TicketColCfgDataType)
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
      if (param.TicketColCfgDataType === "MASTERDATA") {
        outParam.JsonListOption = JSON.stringify([{ Value: param.DataSource }]);
      }
      if (param.TicketColCfgDataType === "MASTERDATASELECTMULTIPLE") {
        outParam.JsonListOption = JSON.stringify([{ Value: param.DataSource }]);
      }
      let pushParam = {
        Lst_Mst_TicketColumnConfig: [outParam],
      };
      return await apiBase.post<
        Response_TicketColumnConfig,
        ApiResponse<Response_TicketColumnConfig>
      >("MstTicketColumnConfig/Update", {
        strJson: JSON.stringify(pushParam),
      });
    },
    Mst_TicketColumnConfig_Delete: async (
      param: Delete_Param[]
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<string, ApiResponse<any>>(
        "MstTicketColumnConfig/Delete",
        {
          strJson: JSON.stringify({
            Lst_Mst_TicketColumnConfig: param,
          }),
        }
      );
    },
  };
};
