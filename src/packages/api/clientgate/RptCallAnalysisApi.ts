import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useRpt_CallAnalysisApi = (apiBase: AxiosInstance) => {
  return {
    RptCallAnalysis_RptCallAnalysisByWaitTime: async (
      param: any
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/RptCallAnalysis/RptCallAnalysisByWaitTime",
        {
          strJson: JSON.stringify(param),
        }
      );
    },

    RptCallAnalysis_RptCallAnalysisByTalkTime: async (
      param: any
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/RptCallAnalysis/RptCallAnalysisByTalkTime",
        {
          strJson: JSON.stringify(param),
        }
      );
    },
    RptCallAnalysis_RptCallAnalysisByCallTime: async (
      param: any
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/RptCallAnalysis/RptCallAnalysisByCallTime",
        {
          strJson: JSON.stringify(param),
        }
      );
    },

    RptCallAnalysis_RptCallAnalysisBySoundValueVolume: async (
      param: any
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/RptCallAnalysis/RptCallAnalysisBySoundValueVolume",
        {
          strJson: JSON.stringify(param),
        }
      );
    },

    RptCallAnalysis_RptCallAnalysisByContent: async (
      param: any
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/RptCallAnalysis/RptCallAnalysisByContent",
        {
          strJson: JSON.stringify(param),
        }
      );
    },
    RptCallAnalysis_RptCallAnalysisBySoundValueFreq: async (
      param: any
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/RptCallAnalysis/RptCallAnalysisBySoundValueFreq",
        {
          strJson: JSON.stringify(param),
        }
      );
    },
    RptCallAnalysis_Save: async (param: any): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/RptCallAnalysis/Save",
        {
          strJson: JSON.stringify(param),
        }
      );
    },
  };
};
