export interface CcOrg {
  Id?: number;
  Name?: string;

  IsNetwork: boolean;
}

export interface CcAgent {
  OrgId?: number;
  UserId?: number;
  Name?: string;
  AgentId?: number;
  Email?: string;

  PhoneNumber?: string;
  ExtId?: number;
  Extension?: string;
  Alias?: string;
  UseIphone?: boolean;
  OnlineStatus?: string;
  DeviceState?: string;
  AgentStatus?: string;
  LastCallDTime?: string;

  IsActive?: boolean;
  AllowCallout?: boolean;
}

export interface CcOrgInfo {
  OrgList: CcOrg[];
  AgentList: CcAgent[];
  Numbers: string[];
}

export interface CcCallingInfo {
  ExtId?: string;
  ExtDomain?: string;
  ExtSecret?: string;
  Protocol?: string;
  Server?: string;
  OrgId?: string;
  Alias?: string;
  AgentStatus?: string;
  Password?: string;
  CalloutNumber?: string;
  CalloutNumbers?: string[];
  OnlineStatus?: string;
  OrgInfo?: CcOrgInfo;
  UseIpPhone?: boolean;
  Token?: string,
}

export interface CcCall {
  Id?: number;

  Type?: string; // incoming/outgoing/internal : đến, đi, nội bộ

  Status?: string;

  CustomerName?: string;

  FromNumber?: string; //số gọi đến

  ToNumber?: string; //số nhận

  RemoteNumber?: string; // sđt khách (là số gọi đến khi type= incoming, số nhận khi type=outgoing, số của angen mình goi khi type== internal)

  AgentNumber?: string; //số máy agent

  QueueNumber?: string; // hàng đợi gọi đến

  Description?: string;

  AgentDesc?: string;

  CustomerDesc?: string;
  Extension?: string;

  Date?: string;
  Time?: string;

  CreateDTime?: Date; // thời điểm gọi

  TalkTime?: number; // số giây cuộc gọi

  RecFilePath?: string; // file ghi âm

  CustomerId?: string;
}

export interface RptCallLog {
  ExtId?: number;
  AgentId?: number;
  Number?: string;
  Name?: string; //ten agent
  RingDTime?: string;
  TalkDTime?: string;
  InitDTime?: string;
  EndDTime?: string;
  HoldTime?: number;
  RingTime?: number;
  TalkTime?: number;

  EndReason?: string;
  IsConnected?: boolean;
}

export interface RptCall {
  Id?: number;

  OrgId?: number;

  HostId?: number;

  QueueId?: number;

  CallType?: string; //loại cuộc gọi

  ExtId?: number; // extension Id xử lý cuộc gọi ( ko có nghĩa khi gọi nội bộ)

  AgentUserId?: number; // User Id xử lý cuộc gọi ( ko có nghĩa khi gọi nội bộ)

  RemoteNumber?: string; // sđt khách  ( ko có nghĩa khi gọi nội bộ)

  CCNumber?: string; //số tổng đài

  FromExtId?: number; //extension gọi

  ToExtId?: number; //extension nhận

  FromNumber?: string; // số gọi

  ToNumber?: string; // số nhận

  FirstExtId?: number; //extension gọi

  LastExtId?: number; //extension nhận

  FirstAgentd?: number; //agent đầu tiên

  LastAgentId?: number; //agent cuối cùng

  FirstExt?: string; //extension đầu tiên

  LastExt?: string; //extension cuối cùng

  FirstAgent?: string; //agent đầu tiên

  LastAgent?: string; //agent cuối cùng

  HoldTime?: number; // thời gian giữ máy (secs)

  WaitTime?: number; // thời gian chờ (secs)

  RingTime?: number; // thời gian đổ chuông (secs)

  TalkTime?: number; // thời gian nói chuyện (secs)

  TotalTime?: number; // tổng thời gian cuộc gọi

  TalkDTime?: string; // thời điểm nói chuyện

  RingDTime?: string; // thời điểm đổ chuông

  StartDTime?: string; // thời điểm bắt đầu

  EndDTime?: string; // thời điểm kết thúc

  Status?: string; // trạng thái cuộc gọi

  RecFilePath?: string; // file ghi âm

  AgentDesc?: string;

  CustomerDesc?: string;

  Remark?: string;

  Tag?: string;

  Logs?: RptCallLog[];
}

export interface RptCallCountByTime {
  Time?: string;
  Count?: number;
}

export interface RptCallSummary {
  Total?: number;
  Incoming?: number;
  Incoming_Succeed?: number;
  Incoming_Missed?: number;
  Outgoing?: number;
  Outgoing_Succeed?: number;
  Outgoing_Missed?: number;

  TalkTime?: string;
  TalkTime_Incomming?: string;
  TalkTime_Outgoing?: string;
  TalkTime_Average?: string;
  HoldTime_Average?: string;
  WaitTime_Average?: string;

  DataList?: RptCallCountByTime[];
}

export interface BlacklistNumber {
  Number?: string;
  Enabled?: boolean;
  Remark?: string;
}
