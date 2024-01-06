import {
  ApiResponse,
  RptCpnCampaignSummaryCampaignStatusData,
  RptCpnCampaignSummaryCampaignStatusSearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRptCpnCampaignSummaryCampaignStatusApi = (apiBase: AxiosInstance) => {
  return {
    RptCpnCampaignSummaryCampaignStatus_Search: async (
      params: RptCpnCampaignSummaryCampaignStatusSearchParam
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        RptCpnCampaignSummaryCampaignStatusSearchParam,
        ApiResponse<RptCpnCampaignSummaryCampaignStatusData>
      >("/RptCpnCampaignSummaryCampaignStatus/Search", {
        ...params,
      });
    },
    RptCpnCampaignSummaryCampaignStatus_ExportExcel: async (
      data: any
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<RptCpnCampaignSummaryCampaignStatusData>,
        ApiResponse<string>
      >("/RptCpnCampaignSummaryCampaignStatus/Export", {
        ...data,
      });
    },
  };
};
