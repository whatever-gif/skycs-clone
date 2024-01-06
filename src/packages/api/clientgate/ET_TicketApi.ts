import { ApiResponse } from "@/packages/types";
import { AxiosInstance } from "axios";

export interface ETICKET_REPONSE {
  TicketID: string;
  OrgID: string;
  NetworkID: string;
  TicketStatus: string;
  CustomerCodeSys: string;
  TicketName: string;
  TicketDetail: string;
  AgentCode: string;
  DepartmentCode: string;
  TicketType: string;
  TicketDeadline: string;
  TicketPriority: null;
  ReceptionDTimeUTC: string;
  TicketCustomType: string;
  TicketSource: string;
  ReceptionChannel: string;
  ContactChannel: string;
  Tags: string;
  SLAID: string;
  TicketJsonInfo: string;
  RemindWork: string | null;
  TicketEvaluate: string;
  RemindDTimeUTC: string;
  CreateDTimeUTC: string;
  CreateBy: string | null;
  ProcessDTimeUTC: string | null;
  ProcessBy: string | null;
  CloseDTimeUTC: string | null;
  CloseBy: string;
  LogLUDTimeUTC: string;
  LogLUBy: string | null;
}

export interface SearchParamEticket {
  FlagOutOfDate: string;
  FlagNotRespondingSLA: string;
  DepartmentCode: string;
  AgentCode: string;
  TicketStatus: string;
  TicketPriority: string;
  TicketDeadline: string;
  TicketType: string;
  CustomerCodeSys: string;
  TicketDetail: string;
  TicketName: string;
  TicketID: string;
  CreateDTimeUTCFrom: string;
  CreateDTimeUTCTo: string;
  LogLUDTimeUTCFrom: string;
  LogLUDTimeUTCTo: string;
  TicketSourceFrom: string;
  TicketSourceTo: string;
  OrgID: string;
  NetworkID: string;
  Ft_PageIndex: number;
  Ft_PageSize: number;
}

export interface typeDownload {
  TicketID: string;
  Idx: string;
  FileName: string;
  FilePath: string;
  FileType: string;
}

export const useETTicket = (apiBase: AxiosInstance) => {
  return {
    ET_Ticket_Search: async (
      param: Partial<SearchParamEticket>
    ): Promise<ApiResponse<ETICKET_REPONSE[]>> => {
      return await apiBase.post<
        SearchParamEticket,
        ApiResponse<ETICKET_REPONSE[]>
      >("ETTicket/Search", {
        ...param,
      });
    },
    ETTicket_Create: async (data: any) => {
      return await apiBase.post("ETTicket/Create", {
        strJson: JSON.stringify(data),
      });
    },
    ETTicket_Update: async (data: any) => {
      return await apiBase.post("ETTicket/Update", {
        strJson: JSON.stringify(data),
      });
    },
    ET_Ticket_Merge: async (param: any): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicket/Merge",
        {
          strJson: JSON.stringify(param),
        }
      );
    },
    ET_Ticket_Close: async (param: any): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicket/Close",
        {
          strJson: JSON.stringify(param),
        }
      );
    },
    ET_Ticket_Delete: async (param: any): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicket/Delete",
        {
          strJson: JSON.stringify(param),
        }
      );
    },

    ET_Ticket_DeleteMultiple: async (param: any): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicket/DeleteMulti",
        {
          strJson: JSON.stringify(param),
        }
      );
    },

    ETTicketMessage_DeleteMulti: async (
      param: any
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicketMessage/DeleteMulti",
        {
          strJson: JSON.stringify(param),
        }
      );
    },

    ET_Ticket_CloseMultiple: async (param: any): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicket/CloseMulti",
        {
          strJson: JSON.stringify(param),
        }
      );
    },

    ET_Ticket_GetByTicketID: async (param: {
      TicketID: string;
      OrgID: string;
    }): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicket/GetByTicketID",
        {
          ...param,
        }
      );
    },

    ET_Ticket_Export: async (
      param: Partial<SearchParamEticket>
    ): Promise<ApiResponse<ETICKET_REPONSE[]>> => {
      return await apiBase.post<
        SearchParamEticket,
        ApiResponse<ETICKET_REPONSE[]>
      >("ETTicket/Export", {
        ...param,
      });
    },

    ET_Ticket_GetCallMessageByCallID: async (
      CallID: string
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<string, ApiResponse<any>>(
        "ETTicket/GetCallMessageByCallID",
        { CallID }
      );
    },

    ET_Ticket_AddRemark: async (param: {
      ActionType: string;
      TicketID: string;
      OrgID: string;
      Description: string;
    }): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicket/AddRemark",
        {
          ...param,
        }
      );
    },

    ET_Ticket_Split: async (param: any): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicket/Split",
        {
          strJson: JSON.stringify(param),
        }
      );
    },
    ET_Ticket_SendEmail: async (param: {
      ActionType: string;
      TicketID: string;
      CtmEmail: string;
      SubTitleSend: string;
      MessageSend: string;
    }): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicketSend/SendEmail",
        {
          ...param,
        }
      );
    },
    ET_Ticket_SendZaloMessage: async (param: {
      ActionType: string;
      TicketID: string;
      ZaloUserFollowerId: string;
      MessageSend: string;
    }): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicketSend/SendZaloMessage",
        {
          ...param,
        }
      );
    },

    ET_Ticket_SendZNS: async (param: {
      ActionType: string;
      TicketID: string;
      IDZNS: string;
      CtmPhoneNo: string;
      strJsonZNS: string;
    }): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicketSend/SendZNS",
        {
          ...param,
        }
      );
    },

    ET_Ticket_UpdateCustomer: async (param: any): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicket/UpdateCustomer",
        {
          ...param,
        }
      );
    },

    ET_Ticket_UpdateAgentCode: async (
      param: any
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicket/UpdateAgentCode",
        {
          ...param,
        }
      );
    },

    AddRemark: async (param: any): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicket/AddRemark",
        {
          strJson: JSON.stringify(param),
        }
      );
    },

    ET_Ticket_UpdatePin: async (param: {
      TicketID: string;
      OrgID: string;
      IsPin: string;
      AutoID: number;
    }) => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicket/UpdatePin",
        {
          ...param,
        }
      );
    },

    GetMessageByTicketID: async (TicketID: string) => {
      return await apiBase.post<string, ApiResponse<any>>(
        "ETTicket/GetMessageByTicketID",
        {
          TicketID: TicketID,
        }
      );
    },

    ETTicket_UpdateStatus: async (param: any) => {
      return await apiBase.post<string, ApiResponse<any>>(
        "ETTicket/UpdateStatus",
        {
          ...param,
        }
      );
    },

    ETTicket_UpdateDeadline: async (param: any) => {
      return await apiBase.post<string, ApiResponse<any>>(
        "ETTicket/UpdateDeadline",
        {
          ...param,
        }
      );
    },

    ETTicketAttachFile_DeleteMultiple: async (
      param: {
        TicketID: string;
        Idx: string;
      }[]
    ) => {
      return await apiBase.post<string, ApiResponse<any>>(
        "ETTicketAttachFile/DeleteMulti",
        {
          strJson: JSON.stringify(param),
        }
      );
    },

    ETTicketAttachFile_Download: async (param: typeDownload[]) => {
      return await apiBase.post<string, ApiResponse<any>>(
        "ETTicketAttachFile/DownLoad",
        {
          strJson: JSON.stringify(param),
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            AppAgent: "Web-SkyCS",
          },
        }
      );
    },

    AddCall: async (param: any): Promise<ApiResponse<any>> => {
      return await apiBase.post<SearchParamEticket, ApiResponse<any>>(
        "ETTicket/AddCall",
        {
          strJson: JSON.stringify(param),
        }
      );
    },
  };
};
