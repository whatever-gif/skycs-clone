import {
  ApiResponse,
  Rpt_CpnCampaignResultCtmFeedbackData,
  Rpt_CpnCampaignResultCtmFeedbackSearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRpt_CpnCampaignResultCtmFeedbackApi = (
  apiBase: AxiosInstance
) => {
  return {
    Rpt_CpnCampaignResultCtmFeedback_Search: async (
      params: Rpt_CpnCampaignResultCtmFeedbackSearchParam
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Rpt_CpnCampaignResultCtmFeedbackSearchParam,
        ApiResponse<Rpt_CpnCampaignResultCtmFeedbackData>
      >("/RptCpnCampaignResultCtmFeedback/Search", {
        ...params,
      });
    },
    Rpt_CpnCampaignResultCtmFeedback_ExportExcel: async (
      data: any
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<Rpt_CpnCampaignResultCtmFeedbackData>,
        ApiResponse<string>
      >("/RptCpnCampaignResultCtmFeedback/Export", {
        ...data,
      });
    },
  };
};
