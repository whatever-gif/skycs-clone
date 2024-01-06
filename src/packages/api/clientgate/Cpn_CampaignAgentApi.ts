import {
  ApiResponse,
  Cpn_CampaignAgentData,
  Cpn_CampaignAgentParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useCpn_CampaignAgentApi = (apiBase: AxiosInstance) => {
  return {
    Cpn_CampaignAgent_Search: async (
      params: Partial<Cpn_CampaignAgentParam>
    ): Promise<ApiResponse<Cpn_CampaignAgentData | any>> => {
      return await apiBase.post<
        Cpn_CampaignAgentParam,
        ApiResponse<Cpn_CampaignAgentData>
      >("/CpnCampaignAgent/Search", {
        ...params,
      });
    },
    Cpn_CampaignAgent_GetActive: async (): Promise<
      ApiResponse<Cpn_CampaignAgentData | any>
    > => {
      return await apiBase.post<
        Cpn_CampaignAgentParam,
        ApiResponse<Cpn_CampaignAgentData>
      >("/CpnCampaign/GetAllCampaignCode", {});
    },
  };
};
