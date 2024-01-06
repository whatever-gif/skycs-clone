import { ApiResponse, KB_PostData, SearchParam } from "@/packages/types";
import { AxiosInstance } from "axios";

interface Props {
  Url: string;
}

export const useKB_PostApi = (apiBase: AxiosInstance) => {
  return {
    KB_PostData_GetAllPostCode: async (): Promise<ApiResponse<KB_PostData>> => {
      return await apiBase.post<any, ApiResponse<KB_PostData>>(
        "/KBPost/GetAllPostCode",
        {}
      );
    },
    KB_PostData_GetByPostCode: async (
      code: any,
      orgID: any
    ): Promise<ApiResponse<KB_PostData>> => {
      return await apiBase.post<any, ApiResponse<KB_PostData>>(
        "/KBPost/GetByPostCode",
        { PostCode: code, OrgID: orgID }
      );
    },
    KB_PostData_GetByCategoryCode: async (
      code: any,
      orgID: any
    ): Promise<ApiResponse<KB_PostData>> => {
      return await apiBase.post<any, ApiResponse<KB_PostData>>(
        "/KBPost/GetByCategoryCode",
        { CategoryCode: code, OrgID: orgID }
      );
    },
    KB_Post_Search: async (params: SearchParam): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParam, ApiResponse<KB_PostData>>(
        "/KBPost/Search",
        {
          ...params,
        }
      );
    },
    KB_Post_UpdateFlagEdit: async (data: any): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParam, ApiResponse<KB_PostData>>(
        "/KBPost/UpdateFlagEdit",
        {
          strJson: JSON.stringify(data),
        }
      );
    },
    KB_Post_UpdateLastView: async (data: any): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParam, ApiResponse<KB_PostData>>(
        "/KBPost/UpdateLastView",
        {
          strJson: JSON.stringify(data),
        }
      );
    },
    Mst_Tag_GetAllActive: async (): Promise<ApiResponse<KB_PostData>> => {
      return await apiBase.post<string, ApiResponse<KB_PostData>>(
        "/MstTag/GetAllActive",
        {}
      );
    },
    Mst_Tag_Create: async (data: any): Promise<ApiResponse<KB_PostData>> => {
      return await apiBase.post<string, ApiResponse<KB_PostData>>(
        "/MstTag/Create",
        {
          strJson: JSON.stringify(data),
        }
      );
    },

    KB_PostData_Update: async (
      data: Partial<KB_PostData>
    ): Promise<ApiResponse<KB_PostData>> => {
      return await apiBase.post<Partial<KB_PostData>, ApiResponse<KB_PostData>>(
        "/KBPost/Update",
        {
          strJson: JSON.stringify(data),
        }
      );
    },

    KB_PostData_Create: async (
      data: any
    ): Promise<ApiResponse<KB_PostData>> => {
      return await apiBase.post<Partial<KB_PostData>, ApiResponse<KB_PostData>>(
        "/KBPost/Create",
        {
          strJson: JSON.stringify(data),
        }
      );
    },

    KB_PostData_Delete: async (data: any) => {
      return await apiBase.post<SearchParam, ApiResponse<KB_PostData>>(
        "/KBPost/Delete",
        { strJson: JSON.stringify(data) }
      );
    },

    KB_PostData_SearchMore: async () => {
      return await apiBase.post<SearchParam, ApiResponse<KB_PostData>>(
        "/KBPost/SearchMore",
        {}
      );
    },
    KB_PostData_SearchKeyWord: async (keyWord: string) => {
      return await apiBase.post<SearchParam, ApiResponse<KB_PostData>>(
        "/KBPost/SearchKeyword",
        {
          KeyWord: keyWord,
        }
      );
    },

    KB_PostData_ImportExcel: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload
      return await apiBase.post<File, ApiResponse<any>>(
        "/MstArea/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },

    KB_PostData_ExportTemplate: async (): Promise<ApiResponse<string>> => {
      return await apiBase.post<Partial<KB_PostData>, ApiResponse<any>>(
        "/MstArea/ExportTemplate",
        {}
      );
    },

    KB_PostData_ExportByListAreaCode: async (
      keys: string[]
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<KB_PostData>, ApiResponse<string>>(
        "/MstArea/ExportByListAreaCode",
        {
          ListAreaCode: keys.join(","),
        }
      );
    },

    KB_PostData_ExportExcel: async (
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<KB_PostData>, ApiResponse<string>>(
        "/MstArea/Export",
        {
          KeyWord: keyword,
        }
      );
    },
  };
};
