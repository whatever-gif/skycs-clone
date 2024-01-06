import {
  ApiResponse,
  Rpt_CpnCampaignResultCallData,
  Rpt_CpnCampaignResultCallSearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRpt_CpnCampaignResultCallApi = (apiBase: AxiosInstance) => {
  return {
    Rpt_CpnCampaignResultCall_Search: async (
      params: Rpt_CpnCampaignResultCallSearchParam
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Rpt_CpnCampaignResultCallSearchParam,
        ApiResponse<Rpt_CpnCampaignResultCallData>
      >("/RptCpnCampaignResultCall/Search", {
        ...params,
      });
    },
    Rpt_CpnCampaignResultCall_ExportExcel: async (
      data: any
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<Rpt_CpnCampaignResultCallData>,
        ApiResponse<string>
      >("/RptCpnCampaignResultCall/Export", {
        ...data,
      });
    },
  };
};
