import {
  ApiResponse,
  Mst_CampaignTypeSearchParam,
  Mst_CampaignTypeData,
  SearchParam,
  Mst_CampaignTypeGetDate,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const use_MstCampaignTypeApi = (apiBase: AxiosInstance) => {
  return {
    Mst_CampaignType_Search: async (
      params: Mst_CampaignTypeSearchParam
    ): Promise<ApiResponse<Mst_CampaignTypeData[]>> => {
      return await apiBase.post<
        SearchParam,
        ApiResponse<Mst_CampaignTypeData[]>
      >("/MstCampaignType/Search", {
        ...params,
      });
    },
    Mst_CampaignType_Create: async (
      params: any
    ): Promise<ApiResponse<Mst_CampaignTypeData>> => {
      return await apiBase.post<any, ApiResponse<Mst_CampaignTypeData>>(
        "/MstCampaignType/Create",
        {
          strJson: JSON.stringify(params),
        }
      );
    },
    Mst_CampaignType_Update: async (
      params: Mst_CampaignTypeSearchParam
    ): Promise<ApiResponse<Mst_CampaignTypeData>> => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_CampaignTypeData>>(
        "/MstCampaignType/Update",
        {
          strJson: JSON.stringify(params),
        }
      );
    },
    Mst_CampaignType_Delete: async (
      params: Mst_CampaignTypeSearchParam
    ): Promise<ApiResponse<Mst_CampaignTypeData>> => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_CampaignTypeData>>(
        "/MstCampaignType/Delete",
        {
          strJson: JSON.stringify(params),
        }
      );
    },
    Mst_CampaignType_DeleteMultiple: async (
      params: Mst_CampaignTypeSearchParam[]
    ): Promise<ApiResponse<Mst_CampaignTypeData>> => {
      return await apiBase.post<
        Mst_CampaignTypeSearchParam[],
        ApiResponse<Mst_CampaignTypeData>
      >("/MstCampaignType/DeleteMulti", {
        strJson: JSON.stringify(params),
      });
    },
    Mst_CampaignType_GetByCode: async (
      CampaignTypeCode: string,
      OrgID: string
    ): Promise<ApiResponse<Partial<Mst_CampaignTypeGetDate>>> => {
      return await apiBase.post<
        SearchParam,
        ApiResponse<Partial<Mst_CampaignTypeGetDate>>
      >("/MstCampaignType/GetByCampaignTypeCode", {
        CampaignTypeCode,
        OrgID,
      });
    },
    CpnCampaign_GetByCode: async (
      CampaignTypeCode: string
    ): Promise<ApiResponse<Partial<Mst_CampaignTypeGetDate>>> => {
      return await apiBase.post<
        SearchParam,
        ApiResponse<Partial<Mst_CampaignTypeGetDate>>
      >("CpnCampaign/GetByCampaignTypeCode", {
        CampaignTypeCode,
      });
    },
  };
};
