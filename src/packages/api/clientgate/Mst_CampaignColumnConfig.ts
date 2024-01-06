import {
  ApiResponse,
  Mst_CampaignColumnConfig,
  SearchCustomerParam,
} from "@packages/types";
import { AxiosInstance } from "axios";

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

    Mst_CampaignColumnConfig_Create: async (
      data: Partial<Mst_CampaignColumnConfig>,
      ScrTplCodeSys: string
    ): Promise<ApiResponse<Partial<Mst_CampaignColumnConfig>>> => {
      return apiBase.post<Partial<any>, ApiResponse<Mst_CampaignColumnConfig>>(
        "/MstCampaignColumnConfig/Create",
        {
          strJson: JSON.stringify(data),
        }
      );
    },

    Mst_CampaignColumnConfig_Update: async (
      key: Partial<Mst_CampaignColumnConfig>,
      data: any[],
      ScrTplCodeSys: string
    ): Promise<ApiResponse<Mst_CampaignColumnConfig>> => {
      return await apiBase.post("/MstCampaignColumnConfig/Update", {
        strJson: JSON.stringify({}),
      });
    },
  };
};
