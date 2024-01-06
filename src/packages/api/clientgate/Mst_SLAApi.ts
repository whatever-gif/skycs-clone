import { ApiResponse, Mst_SLA, SearchSLAParams } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useMst_SLAApi = (apiBase: AxiosInstance) => {
  return {
    Mst_SLA_Search: async (
      params: Partial<SearchSLAParams>
    ): Promise<ApiResponse<Mst_SLA>> => {
      return await apiBase.post<Partial<SearchSLAParams>, ApiResponse<Mst_SLA>>(
        "/MstSLA/Search",
        {
          ...params,
        }
      );
    },
    Mst_SLA_GetBySLAID: async (
      SLAID: string
    ): Promise<ApiResponse<Mst_SLA>> => {
      return await apiBase.post<string, ApiResponse<Mst_SLA>>(
        "/MstSLA/GetBySLAID",
        {
          SLAID: SLAID,
        }
      );
    },
    Mst_SLA_Create: async (data: any): Promise<ApiResponse<Mst_SLA>> => {
      return await apiBase.post<string, ApiResponse<Mst_SLA>>(
        "/MstSLA/Create",
        {
          strJson: JSON.stringify(data),
        }
      );
    },
    Mst_SLA_Update: async (data: any): Promise<ApiResponse<Mst_SLA>> => {
      return await apiBase.post<string, ApiResponse<Mst_SLA>>(
        "/MstSLA/Update",
        {
          strJson: JSON.stringify(data),
        }
      );
    },
    Mst_SLA_Delete: async (data: any): Promise<ApiResponse<Mst_SLA>> => {
      return await apiBase.post<string, ApiResponse<Mst_SLA>>(
        "/MstSLA/Delete",
        {
          strJson: JSON.stringify(data),
        }
      );
    },
    Mst_SLA_DeleteMultiple: async (
      data: any
    ): Promise<ApiResponse<Mst_SLA>> => {
      return await apiBase.post<string, ApiResponse<Mst_SLA>>(
        "/MstSLA/DeleteMultiple",
        {
          strJson: JSON.stringify(data),
        }
      );
    },
    Mst_SLA_GetSLADefault: async (data: any) => {
      return await apiBase.post<any, any>("/MstSLA/GetSLADefault", {
        ...data,
      });
    },
  };
};
