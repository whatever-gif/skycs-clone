import { ApiResponse, KB_CategoryData, SearchParam } from "@packages/types";
import { AxiosInstance } from "axios";

export const useKB_CategoryApi = (apiBase: AxiosInstance) => {
  return {
    KB_Category_GetAllActive: async (): Promise<
      ApiResponse<KB_CategoryData>
    > => {
      return await apiBase.post<File, ApiResponse<any>>(
        "/KBCategory/GetAllActive",
        {}
      );
    },
    KB_Category_Search: async (
      params: SearchParam
    ): Promise<ApiResponse<KB_CategoryData>> => {
      return await apiBase.post<File, ApiResponse<any>>("/KBCategory/Search", {
        ...params,
      });
    },
    KB_Category_Create: async (
      data: any
    ): Promise<ApiResponse<KB_CategoryData>> => {
      return await apiBase.post<File, ApiResponse<any>>("/KBCategory/Create", {
        strJson: JSON.stringify(data),
      });
    },
    KB_Category_Delete: async (
      dataDelete: any
    ): Promise<ApiResponse<KB_CategoryData>> => {
      return await apiBase.post<File, ApiResponse<any>>("/KBCategory/Delete", {
        strJson: JSON.stringify(dataDelete),
      });
    },
    KB_Category_GetByCategoryCode: async (
      CategoryCode: any,
      OrgID: any
    ): Promise<ApiResponse<KB_CategoryData>> => {
      return await apiBase.post<File, ApiResponse<any>>(
        "/KBCategory/GetByCategoryCode",
        {
          CategoryCode: CategoryCode,
          OrgID: OrgID,
        }
      );
    },
    KB_Category_update: async (
      data: any
    ): Promise<ApiResponse<KB_CategoryData>> => {
      return await apiBase.post<File, ApiResponse<any>>("/KBCategory/Update", {
        strJson: JSON.stringify(data),
        ColsUpd: [
          "CategoryName",
          "CategoryParentCode",
          "CategoryDesc",
          "FlagActive",
        ].join(","),
      });
    },
  };
};
