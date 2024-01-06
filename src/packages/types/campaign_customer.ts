export interface Cpn_CampaignCustomerData {
  Idx: number; // 0,
  CampaignCode?: string; // CPNCODE.D6R.00043,
  OrgID?: string; // 7206207001,
  AgentCode?: string; // 0317844394,
  CpnCustomerSaveType?: string; // Type
  JsonCustomerInfo?: string; // Test,
  CustomerCodeSys?: string; // CTMCS.D6P.10119,
  LogLUDTimeUTC?: string; // 2023-07-14 04:13:59,
  LogLUBy?: string; // 0317844394@INOS.VN,
  CallID?: string; // null
  CustomerName?: string; // Phương Ánh Tạo Anh Khang Sửa,
  CustomerPhoneNo1?: string; // 0192837465,
  CustomerPhoneNo2?: string; // 035891521,
  CustomerEmail?: string; // KhangTH@GMAIL.COM,
  CustomerAddress?: string; // Hạ Lôi,
  CustomerCompany?: string; // IdocNet,
  CustomerPhoneNo?: string; // null,
  CallOutDTimeUTC?: string; // 2023-07-14 11:00:00,
  CallTime?: string; // null,
  QtyCall: number; // 1,
  CampaignCustomerCallStatus?: string; // null,
  CustomerFeedBack?: string; // 0,
  Remark?: string; // null,
  AgentName?: string; // null,
  CampaignName?: string; // Campaign Name,
  CampaignStatus?: string; // PENDING,
  CampaignTypeName?: string; // Testing,
  cc_CreateDTimeUTC?: string; // 2023-06-27 09:15:14,
  cc_CreateBy?: string; // 0317844394@INOS.VN,
  CampaignTypeCode?: string; // D6J.001,
  CustomerAvatarName?: string; // null,
  CustomerAvatarPath?: string; // null
}

export interface DynamicField_Campaign {
  CampaignColCfgCodeSys: string;
  CampaignColCfgDataType: string;
  CampaignColCfgName: string;
  CampaignTypeCode: string;
  ColDataTypeDesc: string;
  FlagActive: string;
  FlagRequired: string;
  Idx: number;
  JsonListOption: string;
  LogLUBy: string;
  LogLUDTimeUTC: string;
  NetworkID: string;
  OrgID: string;
}

export interface Cpn_CampaignCustomerCallHistData {
  CallOutDTimeUTC?: string; //2023-07-14 11:00:00,
  OrgID?: string; //7206207001,
  AgentCode?: string; //0317844394,
  CustomerPhoneNo?: string; //0192837465,
  CampaignCode?: string; //CPNCODE.D6R.00043,
  NetworkID?: string; //7206207001,
  RecordFileName?: string; //record1,
  RecordFilePath?: string; //http:\\lemanhdung.com.vn\record1.awm,
  CallTime?: string; //160,
  CampaignCustomerCallStatus?: string; //DONE,
  CustomerFeedBack?: string; //0,
  CustomerCallJsonInfo?: string; //Test,
  Remark?: string; //Khang Test,
  LogLUDTimeUTC?: string; //2023-07-14 04:13:59,
  LogLUBy?: string; //0317844394@INOS.VN
}
