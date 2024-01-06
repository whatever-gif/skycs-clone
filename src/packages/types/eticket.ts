import { number } from "ts-pattern/dist/patterns";

export interface Customer {
  //Id: string;
  Name: string;
  Image: string | null;
  Email: string | null;
  Phone: string | null;
}

export interface UploadFile {
  Id?: string;
  Url: string;
  Type?: string; // docx,doc,...
  Name?: string;
  Size?: number;
}

export interface Email {
  Type: string | null; //In/Out
  From: string | null;
  To: string | null;
  Subject: string | null;
  Detail: string | null;
}

export interface Call {
  FromNumber: string;
  ToNumber: string;
  Type: string; // Out/In/Missed/NoAnswer
}

export interface EticketMessage {
  //Id: string;
  Type: string; //Email/Call/Note/Zalo/Event
  AuthorName: string | null;
  AuthorImage: string | null;

  IsPinned: boolean | null;
  Detail: string | null;
  Attachments?: UploadFile[];

  Call?: Call;
  Email?: Email;
  CreateDtime: string | null;
}
export interface Eticket {
  Id: string;
  Name: string;
  Status: string;
  Type: string | null;
  PreferredReplyChannel: string | null;
  UpdateDtime: string | null;

  Deadline: string | null;
  Agent: string | null;
  Tags: string | null;
  Customer: Customer;

  MessageList: EticketMessage[] | null;
}

export interface EticketT {
  Lst_ET_Ticket: any;
  Lst_ET_TicketAttachFile: any;
  Lst_ET_TicketCustomer: any;
  Lst_ET_TicketFollower: any;
  Lst_ET_TicketFollowerHO: any;
  Lst_ET_TicketHO: any;
  Lst_ET_TicketMessage: any;
  Lst_ET_TicketMessageNotPin: any;
  Lst_ET_TicketMessagePin: any;
  Lst_ET_TicketHO: any[];
}

export interface Phone {
  phoneCode: string | null;
  phoneNumber: string | null;
}

export interface ET_TicketMessage {
  AutoId: number;
  TicketID: string | null;
  OrgID: string | null;
  NetworkID: string | null;
  ConvMessageType: string | null;
  dataPin?: any[];
  ObjectId: string | null;
  ObjectParentId: string | null;
  PageId: string | null;
  ObjectSenderId: string | null;
  ObjectReceiveId: string | null;
  UserId: string | null;
  //ChannelId: number;
  ChannelId: string | null;
  //SubTitleSend: string | null;
  //MessageSend: string | null;
  Description: string;
  Detail: string | null;
  //IsIncoming: number;
  IsIncoming: string | null;
  Status: string | null;
  MsgDTime: string | null;
  checkPin?: boolean;
  AttachmentDetails: [] | null;
  IsPin: string;
  CreateDTimeUTC: string | null;
  CreateBy: string | null;
  LogLUDTimeUTC: string | null;
  LogLUBy: string | null;
}

export interface Eticket_AddRemark {
  ActionType: string | null;
  TicketID: string | null;
  OrgID: string | null;
  Description: string | null;
}

export interface Eticket_ActionType {
  ActionTypeCode: string | null;
  ActionTypeName: string | null;
}
