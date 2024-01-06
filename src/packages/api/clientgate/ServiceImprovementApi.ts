import { ApiResponse, SearchParam } from "@/packages/types";
import { AxiosInstance } from "axios";

export const use_ServiceImprovementApi = (apiBase: AxiosInstance) => {
  return {
    SvImpSvImprv_Search: async (params: any): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<SearchParam, ApiResponse<any[]>>(
        "/SvImpSvImprv/Search",
        {
          ...params,
        }
      );
    },
    MstSvImprvItemType_GetAllActive: async (): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<SearchParam, ApiResponse<any[]>>(
        "/MstSvImprvItemType/GetAllActive",
        {}
      );
    },
    SvImpSvImprv_Save: async (param: any): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<SearchParam, ApiResponse<any[]>>(
        "/SvImpSvImprv/Save",
        {
          strJson: JSON.stringify(param),
        }
      );
    },
    Seq_GetSvImprvCodeSys: async (): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<SearchParam, ApiResponse<any[]>>(
        "/Seq/GetSvImprvCodeSys",
        {}
      );
    },
    SvImpSvImprv_GetBySvImprvCodeSys: async (
      code: any
    ): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<SearchParam, ApiResponse<any[]>>(
        "/SvImpSvImprv/GetBySvImprvCodeSys",
        {
          SvImprvCodeSys: code,
        }
      );
    },
    SvImpSvImprv_Delete: async (param: any): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<SearchParam, ApiResponse<any[]>>(
        "/SvImpSvImprv/Delete",
        {
          strJson: JSON.stringify(param),
        }
      );
    },
    SvImpSvImprv_GetAllActive: async (): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<SearchParam, ApiResponse<any[]>>(
        "/SvImpSvImprv/GetAllActive",
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
