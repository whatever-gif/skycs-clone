import {
  ApiResponse,
  Rpt_CpnCampaignStatisticCallData,
  Rpt_CpnCampaignStatisticCallSearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRpt_CpnCampaignStatisticCallApi = (apiBase: AxiosInstance) => {
  return {
    Rpt_CpnCampaignStatisticCall_Search: async (
      params: Rpt_CpnCampaignStatisticCallSearchParam
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Rpt_CpnCampaignStatisticCallSearchParam,
        ApiResponse<Rpt_CpnCampaignStatisticCallData>
      >("/RptCpnCampaignStatisticCall/Search", {
        ...params,
      });
    },
    Rpt_CpnCampaignStatisticCall_ExportExcel: async (
      data: any
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<Rpt_CpnCampaignStatisticCallData>,
        ApiResponse<string>
      >("/RptCpnCampaignStatisticCall/Export", {
        ...data,
      });
    },
  };
};
