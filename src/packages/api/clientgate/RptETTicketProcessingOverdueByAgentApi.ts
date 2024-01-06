import {
  ApiResponse,
  RptCpnCampaignSummaryCampaignStatusData,
  RptCpnCampaignSummaryCampaignStatusSearchParam,
  RptETTicketProcessingOverdueByAgent,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRptETTicketProcessingOverdueByAgentApi = (
  apiBase: AxiosInstance
) => {
  return {
    RptETTicketProcessingOverdueByAgent_Search: async (
      params: RptETTicketProcessingOverdueByAgent
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        RptCpnCampaignSummaryCampaignStatusSearchParam,
        ApiResponse<RptCpnCampaignSummaryCampaignStatusData>
      >("/RptETTicketProcessingOverdueByAgent/Search", {
        ...params,
      });
    },
  };
};
