import {
  ApiResponse,
  RptCpnCampaignSummaryCampaignStatusData,
  RptCpnCampaignSummaryCampaignStatusSearchParam,
  RptETTicketProcessingOverdueByAgent,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRptETTicketProcessingOverdueApi = (apiBase: AxiosInstance) => {
  return {
    Rpt_ETTicketProcessingOverdue_Search: async (
      params: RptETTicketProcessingOverdueByAgent
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        RptCpnCampaignSummaryCampaignStatusSearchParam,
        ApiResponse<RptCpnCampaignSummaryCampaignStatusData>
      >("/RptETTicketProcessingOverdue/Search", {
        ...params,
      });
    },
  };
};
