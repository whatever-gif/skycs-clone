import { ApiResponse, MstChanelData } from "@/packages/types";
import { AxiosInstance } from "axios";
export const useMst_Channel = (apiBase: AxiosInstance) => {
  return {
    Mst_Channel_GetByOrgID: async (id: any): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<MstChanelData>>(
        "/MstChannel/GetByOrgID",
        { OrgID: id }
      );
    },
    Mst_Channel_Save: async (
      dataZalo: any,
      dataEmail: any
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<any, ApiResponse<MstChanelData>>(
        "/MstChannel/Save",
        {
          strJsonZalo: JSON.stringify(dataZalo),
          strJsonEmail: JSON.stringify(dataEmail),
          strJsonSMS: JSON.stringify([
            {
              SMSBrandName: "idocnet",
            },
          ]),
        }
      );
    },
  };
};
