import { ApiResponse, SearchParam } from "@/packages/types";
import { AxiosInstance } from "axios";

export const use_SvImpAudioAnalysisApi = (apiBase: AxiosInstance) => {
  return {
    SvImpAudioAnalysis_Search: async (
      params: any
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<SearchParam, ApiResponse<any[]>>(
        "/SvImpAudioAnalysis/Search",
        {
          ...params,
        }
      );
    },
    SvImpAudioAnalysis_Save: async (data: any): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<SearchParam, ApiResponse<any[]>>(
        "/SvImpAudioAnalysis/Save",
        {
          strJson: JSON.stringify(data),
        }
      );
    },
    SvImpAudioAnalysis_Delete: async (
      data: any
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<SearchParam, ApiResponse<any[]>>(
        "/SvImpAudioAnalysis/Delete",
        {
          strJson: JSON.stringify(data),
        }
      );
    },
    SvImpAudioAnalysis_GetByAudioAnalysisCodeSys: async (
      code: string
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<SearchParam, ApiResponse<any[]>>(
        "/SvImpAudioAnalysis/GetByAudioAnalysisCodeSys",
        {
          AudioAnalysisCodeSys: code,
        }
      );
    },
    SvImpAudioAnalysis_GetAudioAnalysisCodeSys: async (): Promise<
      ApiResponse<any[]>
    > => {
      return await apiBase.post<SearchParam, ApiResponse<any[]>>(
        "/Seq/GetAudioAnalysisCodeSys",
        {}
      );
    },
    SvImpAudioAnalysisDtl_Process: async (
      data: any
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<SearchParam, ApiResponse<any[]>>(
        "/SvImpAudioAnalysisDtl/Process",
        {
          strJson: JSON.stringify(data),
        }
      );
    },
    MstAudioAnalysisType_GetAllActive: async (): Promise<
      ApiResponse<any[]>
    > => {
      return await apiBase.post<SearchParam, ApiResponse<any[]>>(
        "/MstAudioAnalysisType/GetAllActive",
        {}
      );
    },
    // Mst_CampaignType_Create: async (
    //   params: any
    // ): Promise<ApiResponse<Mst_CampaignTypeData>> => {
    //   return await apiBase.post<any, ApiResponse<Mst_CampaignTypeData>>(
    //     "/MstCampaignType/Create",
    //     {
    //       strJson: JSON.stringify(params),
    //     }
    //   );
    // },
    // Mst_CampaignType_Update: async (
    //   params: Mst_CampaignTypeSearchParam
    // ): Promise<ApiResponse<Mst_CampaignTypeData>> => {
    //   return await apiBase.post<SearchParam, ApiResponse<Mst_CampaignTypeData>>(
    //     "/MstCampaignType/Update",
    //     {
    //       strJson: JSON.stringify(params),
    //     }
    //   );
    // },
    // Mst_CampaignType_Delete: async (
    //   params: Mst_CampaignTypeSearchParam
    // ): Promise<ApiResponse<Mst_CampaignTypeData>> => {
    //   return await apiBase.post<SearchParam, ApiResponse<Mst_CampaignTypeData>>(
    //     "/MstCampaignType/Delete",
    //     {
    //       strJson: JSON.stringify(params),
    //     }
    //   );
    // },
    // Mst_CampaignType_DeleteMultiple: async (
    //   params: Mst_CampaignTypeSearchParam[]
    // ): Promise<ApiResponse<Mst_CampaignTypeData>> => {
    //   return await apiBase.post<
    //     Mst_CampaignTypeSearchParam[],
    //     ApiResponse<Mst_CampaignTypeData>
    //   >("/MstCampaignType/DeleteMulti", {
    //     strJson: JSON.stringify(params),
    //   });
    // },
    // Mst_CampaignType_GetByCode: async (
    //   CampaignTypeCode: string,
    //   OrgID: string
    // ): Promise<ApiResponse<Partial<Mst_CampaignTypeGetDate>>> => {
    //   return await apiBase.post<
    //     SearchParam,
    //     ApiResponse<Partial<Mst_CampaignTypeGetDate>>
    //   >("/MstCampaignType/GetByCampaignTypeCode", {
    //     CampaignTypeCode,
    //     OrgID,
    //   });
    // },
    // CpnCampaign_GetByCode: async (
    //   CampaignTypeCode: string
    // ): Promise<ApiResponse<Partial<Mst_CampaignTypeGetDate>>> => {
    //   return await apiBase.post<
    //     SearchParam,
    //     ApiResponse<Partial<Mst_CampaignTypeGetDate>>
    //   >("CpnCampaign/GetByCampaignTypeCode", {
    //     CampaignTypeCode,
    //   });
    // },
  };
};
