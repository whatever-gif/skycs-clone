import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useMst_CountryApi = (apiBase: AxiosInstance) => {
  return {
    Mst_Country_Search: async (params: any): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>("/MstCountry/Search", {
        ...params,
      });
    },

    Mst_Province_Search: async (params: any): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstProvince/Search",
        {
          ...params,
        }
      );
    },

    Mst_District_Search: async (params: any): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstDistrict/Search",
        {
          ...params,
        }
      );
    },

    Mst_Ward_Search: async (params: any): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>("/MstWard/Search", {
        ...params,
      });
    },

    Mst_Country_GetAllActive: async (): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstCountry/GetAllActive",
        {}
      );
    },

    Mst_Province_GetByCountryCode: async ({
      CountryCode,
    }: {
      CountryCode: string;
    }): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstProvince/GetByCountryCode",
        {
          CountryCode: CountryCode,
        }
      );
    },

    Mst_Province_GetAllActive: async (): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstProvince/GetAllActive",
        {}
      );
    },

    Mst_District_GetByProvinceCode: async ({
      ProvinceCode,
    }: {
      ProvinceCode: string;
    }): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstDistrict/GetByProvinceCode",
        {
          ProvinceCode: ProvinceCode,
        }
      );
    },

    Mst_District_GetAllActive: async (): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstDistrict/GetAllActive",
        {}
      );
    },

    Mst_Ward_GetByProvinceCode: async ({
      ProvinceCode,
      DistrictCode,
    }: {
      ProvinceCode: string;
      DistrictCode: string;
    }): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstWard/GetByProvinceCode",
        {
          ProvinceCode: ProvinceCode,
          DistrictCode: DistrictCode,
        }
      );
    },

    Mst_Ward_GetByWardCode: async ({
      WardCode,
    }: {
      WardCode: string;
    }): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstWard/GetByWardCode",
        {
          WardCode: WardCode,
        }
      );
    },

    Mst_Ward_GetAllActive: async (): Promise<ApiResponse<any[]>> => {
      return await apiBase.post<any, ApiResponse<any[]>>(
        "/MstWard/GetAllActive",
        {}
      );
    },
  };
};
