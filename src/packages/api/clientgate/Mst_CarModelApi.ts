import { ApiResponse, Mst_CarModel, SearchParam } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useMst_CarModelApi = (apiBase: AxiosInstance) => {
  return {
    Mst_CarModel_Search: async (
      params: SearchParam
    ): Promise<ApiResponse<Mst_CarModel>> => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_CarModel>>(
        "/MstCarModel/Search",
        {
          ...params,
        }
      );
    },

    Mst_CarModel_GetAllActive: async () => {
      return await apiBase.post<
        Partial<Mst_CarModel>,
        ApiResponse<Mst_CarModel>
      >("/MstCarModel/GetAllActive");
    },

    Mst_CarModel_GetByCode: async (
      ModelCode: string
    ): Promise<ApiResponse<Mst_CarModel>> => {
      return await apiBase.post<string, ApiResponse<Mst_CarModel>>(
        "/MstCarModel/GetByCode",
        {
          ModelCode: ModelCode,
        }
      );
    },

    Mst_CarModel_Update: async (
      key: any,
      data: Partial<Mst_CarModel>
    ): Promise<ApiResponse<Mst_CarModel>> => {
      return await apiBase.post<
        Partial<Mst_CarModel>,
        ApiResponse<Mst_CarModel>
      >("/MstCarModel/Update", {
        strJson: JSON.stringify({
          ...key,
          ...data,
        }),
        ColsUpd: Object.keys(data).join(","),
      });
    },

    Mst_CarModel_Create: async (
      CarModel: Partial<Mst_CarModel>
    ): Promise<ApiResponse<Mst_CarModel>> => {
      return await apiBase.post<
        Partial<Mst_CarModel>,
        ApiResponse<Mst_CarModel>
      >("/MstCarModel/Create", {
        strJson: JSON.stringify(CarModel),
      });
    },

    Mst_CarModel_Delete: async (CarModel: any) => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_CarModel>>(
        "/MstCarModel/Delete",
        { ...CarModel }
      );
    },

    Mst_CarModel_DeleteMultiple: async (listCarModel: any[]) => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_CarModel>>(
        "/MstCarModel/DeleteMultiple",
        {
          strJson: JSON.stringify(listCarModel),
        }
      );
    },

    Mst_CarModel_ImportExcel: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload

      return await apiBase.post<File, ApiResponse<any>>(
        "/MstCarModel/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },

    Mst_CarModel_ExportTemplate: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<Mst_CarModel>, ApiResponse<string>>(
        "/MstCarModel/ExportTemplate",
        {}
      );
    },

    Mst_CarModel_ExportExcel: async (
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      {
        return await apiBase.post<Partial<Mst_CarModel>, ApiResponse<string>>(
          "/MstCarModel/Export",
          {
            KeyWord: keyword,
            FlagActive: "",
          }
        );
      }
    },

    Mst_CarModel_ExportByListCode: async (
      keys: string[]
    ): Promise<ApiResponse<any>> => {
      {
        return await apiBase.post<Partial<Mst_CarModel>, ApiResponse<string>>(
          "/MstCarModel/ExportByListCode",
          {
            ListModelCode: keys.join(","),
          }
        );
      }
    },
  };
};
