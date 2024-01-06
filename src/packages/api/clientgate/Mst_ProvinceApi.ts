import { ApiResponse, Province, SearchParam } from "@/packages/types";
import { AxiosInstance } from "axios";
export interface ProvinceDto extends Omit<Province, "FlagActive"> {
  FlagActive: boolean | string;
}

export const useMst_Province_api = (apiBase: AxiosInstance) => {
  return {
    Mst_Province_Search: async (
      params: SearchParam
    ): Promise<ApiResponse<Province>> => {
      return await apiBase.post<SearchParam, ApiResponse<Province>>(
        "/MstProvince/Search",
        {
          ...params,
        }
      );
    },

    Mst_District_Search: async (
      params: SearchParam
    ): Promise<ApiResponse<Province>> => {
      return await apiBase.post<SearchParam, ApiResponse<Province>>(
        "/MstDistrict/Search",
        {
          ...params,
        }
      );
    },

    Mst_MstWard_Search: async (
      params: SearchParam
    ): Promise<ApiResponse<Province>> => {
      return await apiBase.post<SearchParam, ApiResponse<Province>>(
        "/MstWard/Search",
        {
          ...params,
        }
      );
    },

    Mst_Province_Create: async (
      province: Partial<ProvinceDto>
    ): Promise<ApiResponse<Province>> => {
      return await apiBase.post<Partial<Province>, ApiResponse<Province>>(
        "/MstProvince/Create",
        {
          strJson: JSON.stringify(province),
        }
      );
    },

    Mst_Province_GetAllActive: async () => {
      return await apiBase.post<Partial<Province>, ApiResponse<Province>>(
        "/MstProvince/GetAllActive"
      );
    },

    Mst_Province_Delete: async (provinceCode: string) => {
      return await apiBase.post<SearchParam, ApiResponse<Province>>(
        "/MstProvince/Delete",
        {
          ProvinceCode: provinceCode,
        }
      );
    },
    Mst_Province_DeleteMultiple: async (provinceCodes: string[]) => {
      return await apiBase.post<SearchParam, ApiResponse<Province>>(
        "/MstProvince/DeleteMultiple",
        {
          strJson: JSON.stringify(
            provinceCodes.map((item) => ({
              ProvinceCode: item,
            }))
          ),
        }
      );
    },

    Mst_Province_Update: async (
      key: string,
      province: Partial<ProvinceDto>
    ): Promise<ApiResponse<Province>> => {
      return await apiBase.post<Partial<Province>, ApiResponse<Province>>(
        "/MstProvince/Update",
        {
          strJson: JSON.stringify({
            ProvinceCode: key,
            ...province,
          }),
          ColsUpd: Object.keys(province),
        }
      );
    },

    Mst_Province_Import: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload

      return await apiBase.post<File, ApiResponse<any>>(
        "/MstProvince/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    Mst_Provice_ExportTemplate: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<Province>, ApiResponse<string>>(
        "/MstProvince/ExportTemplate",
        {}
      );
    },
    Mst_Province_ExportByListProvinceCode: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        return await apiBase.post<Partial<Province>, ApiResponse<string>>(
          "/MstProvince/ExportByListProvinceCode",
          {
            ListProvinceCode: keys.join(","),
          }
        );
      } else {
        return await apiBase.post<Partial<Province>, ApiResponse<string>>(
          "/MstProvince/Export",
          {
            KeyWord: keyword,
            FlagActive: "",
          }
        );
      }
    },
  };
};
