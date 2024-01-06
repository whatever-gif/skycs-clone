import { ApiResponse, Mst_DealerType, SearchParam } from "@packages/types";
import { AxiosInstance } from "axios";

export const useMst_DealerType = (apiBase: AxiosInstance) => {
  return {
    Mst_DealerType_Search: async (
      param: SearchParam
    ): Promise<ApiResponse<Mst_DealerType>> => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_DealerType>>(
        "/MstDealerType/Search",
        {
          ...param,
        }
      );
    },

    Mst_DealerType_Delete: async (
      key: string
    ): Promise<ApiResponse<Mst_DealerType>> => {
      return await apiBase.post<string, ApiResponse<Mst_DealerType>>(
        "/MstDealerType/Delete",
        {
          DealerType: key,
        }
      );
    },

    Mst_DealerType_DeleteMultiple: async (
      data: string[]
    ): Promise<ApiResponse<Mst_DealerType>> => {
      return await apiBase.post<string, ApiResponse<Mst_DealerType>>(
        "/MstDealerType/DeleteMultiple",
        {
          strJson: JSON.stringify(
            data.map((item) => {
              return {
                DealerType: item,
              };
            })
          ),
        }
      );
    },

    Mst_DealerType_Create: async (
      data: Partial<Mst_DealerType>
    ): Promise<ApiResponse<Partial<Mst_DealerType>>> => {
      return apiBase.post<Partial<Mst_DealerType>, ApiResponse<Mst_DealerType>>(
        "/MstDealerType/Create",
        {
          strJson: JSON.stringify(data),
        }
      );
    },

    Mst_DealerType_Update: async (
      key: string,
      data: Partial<Mst_DealerType>
    ): Promise<ApiResponse<Mst_DealerType>> => {
      return await apiBase.post("/MstDealerType/Update", {
        strJson: JSON.stringify({
          ...data,
          DealerType: key,
        }),
        ColsUpd: Object.keys(data).join(","),
      });
    },

    Mst_DealerType_ExportExcel: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        return await apiBase.post<Partial<Mst_DealerType>, ApiResponse<string>>(
          "/MstDealerType/Export",
          {
            KeyWord: keyword,
            FlagActive: "",
          }
        );
      }
      return await apiBase.post<Partial<Mst_DealerType>, ApiResponse<string>>(
        "/MstDealerType/Export",
        {
          KeyWord: keyword,
          FlagActive: "",
        }
      );
    },

    Mst_DealerType_ExportExcel_Template: async (): Promise<
      ApiResponse<any>
    > => {
      return await apiBase.post<Partial<Mst_DealerType>, ApiResponse<string>>(
        "/MstDealerType/ExportTemplate"
      );
    },

    Mst_DealerType_Upload: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload

      return await apiBase.post<File, ApiResponse<any>>(
        "/MstDealerType/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
  };
};
