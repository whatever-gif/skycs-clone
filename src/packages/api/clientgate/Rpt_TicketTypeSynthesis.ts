import {
  ApiResponse,
  RptCpnCampaignSummaryResultData,
  RptCpnCampaignSummaryResultSearchParam,
  RptTicketTypeSynthesisSearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRptTicketTypeSynthesisApi = (apiBase: AxiosInstance) => {
  return {
    RptTicketTypeSynthesis_Search: async (
      params: RptTicketTypeSynthesisSearchParam
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        RptTicketTypeSynthesisSearchParam,
        ApiResponse<RptCpnCampaignSummaryResultData>
      >("/RptTicketTypeSynthesis/Search", {
        ...params,
      });
    },
  };
};
