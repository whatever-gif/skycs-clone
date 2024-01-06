import {
  ApiResponse,
  RptCpnCampaignSummaryResultData,
  RptCpnCampaignSummaryResultSearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRptCpnCampaignSummaryResultApi = (apiBase: AxiosInstance) => {
  return {
    RptCpnCampaignSummaryResult_Search: async (
      params: RptCpnCampaignSummaryResultSearchParam
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        RptCpnCampaignSummaryResultSearchParam,
        ApiResponse<RptCpnCampaignSummaryResultData>
      >("/RptCpnCampaignSummaryResult/Search", {
        ...params,
      });
    },
    RptCpnCampaignSummaryResult_ExportExcel: async (
      data: any
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<RptCpnCampaignSummaryResultData>,
        ApiResponse<string>
      >("/RptCpnCampaignSummaryResult/Export", {
        ...data,
      });
    },
  };
};
