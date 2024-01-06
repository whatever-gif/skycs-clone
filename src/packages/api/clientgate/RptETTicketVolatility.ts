import {
  ApiResponse,
  RptCpnCampaignSummaryResultData,
  RptETTicketVolatilitySearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRptETTicketVolatilityApi = (apiBase: AxiosInstance) => {
  return {
    RptETTicketVolatility_Search: async (
      params: RptETTicketVolatilitySearchParam
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        RptETTicketVolatilitySearchParam,
        ApiResponse<RptCpnCampaignSummaryResultData>
      >("/RptETTicketVolatility/Search", {
        ...params,
      });
    },
  };
};
