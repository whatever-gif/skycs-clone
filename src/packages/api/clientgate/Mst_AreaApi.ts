import { ApiResponse, Mst_Area, SearchParam } from "@/packages/types";
import { AxiosInstance } from "axios";

interface Props {
  Url: string;
}

export const useMst_AreaApi = (apiBase: AxiosInstance) => {
  return {
    Mst_Area_GetAllActive: async (): Promise<ApiResponse<Mst_Area>> => {
      return await apiBase.post<any, ApiResponse<Mst_Area>>(
        "/MstArea/GetAllActive",
        {}
      );
    },
    Mst_Area_Search: async (params: SearchParam): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_Area>>(
        "/MstArea/Search",
        {
          ...params,
        }
      );
    },
    Mst_Area_GetByAreaCode: async (
      areaCode: string
    ): Promise<ApiResponse<Mst_Area>> => {
      return await apiBase.post<string, ApiResponse<Mst_Area>>(
        "/MstArea/GetAreaByCode",
        {
          AreaCode: areaCode,
        }
      );
    },

    Mst_Area_Update: async (
      data: Partial<Mst_Area>
    ): Promise<ApiResponse<Mst_Area>> => {
      return await apiBase.post<Partial<Mst_Area>, ApiResponse<Mst_Area>>(
        "/MstArea/Update",
        {
          strJson: JSON.stringify(data),
          ColsUpd: "AreaName,AreaDesc,FlagActive",
        }
      );
    },

    Mst_Area_Create: async (
      area: Partial<Mst_Area>
    ): Promise<ApiResponse<Mst_Area>> => {
      return await apiBase.post<Partial<Mst_Area>, ApiResponse<Mst_Area>>(
        "/MstArea/Create",
        {
          strJson: JSON.stringify(area),
        }
      );
    },

    Mst_Area_Delete: async (AreaCode: any) => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_Area>>(
        "/MstArea/Delete",
        { strJson: JSON.stringify(AreaCode) }
      );
    },

    Mst_Area_DeleteMultiple: async (data: any) => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_Area>>(
        "/MstArea/DeleteMultiple",
        {
          strJson: JSON.stringify(data),
        }
      );
    },

    Mst_Area_ImportExcel: async (file: File): Promise<ApiResponse<any>> => {
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

    Mst_Area_ExportTemplate: async (): Promise<ApiResponse<string>> => {
      return await apiBase.post<Partial<Mst_Area>, ApiResponse<any>>(
        "/MstArea/ExportTemplate",
        {}
      );
    },

    Mst_Area_ExportByListAreaCode: async (
      keys: string[]
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<Mst_Area>, ApiResponse<string>>(
        "/MstArea/ExportByListAreaCode",
        {
          ListAreaCode: keys.join(","),
        }
      );
    },

    Mst_Area_ExportExcel: async (
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<Mst_Area>, ApiResponse<string>>(
        "/MstArea/Export",
        {
          KeyWord: keyword,
        }
      );
    },
  };
};
