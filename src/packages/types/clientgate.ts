import { _dicExcs } from "../store";

export interface ClientGateInfo {
  SolutionCode: string;
  NetworkID: string;
  NetworkName: string;
  GroupNetworkID: string;
  CoreAddr: string | null;
  PingAddr: string | null;
  XSysAddr: string | null;
  WSUrlAddr: string;
  WSUrlAddrLAN: string;
  DBUrlAddr: string | null;
  DefaultVersion: string;
  MinVersion: string;
  FlagActive: string;
  LogLUDTime: string;
  LogLUBy: string;
}

export interface Mst_CampaignColumnConfig_GetCampaignColCfgCodeSys {
  Success: true;
  Data: string;
  DataList: null;
  ErrorData: null;
}

export interface Cpn_Campaign {
  CampaignCode: string;
  OrgID: string;
  NetworkID: string;
  CampaignTypeCode: string;
  CampaignName: string;
  CampaignDesc: string;
  DTimeStart: string;
  DTimeEnd: string;
  MaxCall: string;
  CallRate: string;
  CustomerRate: string;
  CampaignStatus: string;
  CreateDTimeUTC: string;
  CreateBy: string;
  ApproveDTimeUTC: string;
  AprroveBy: string;
  StartDTimeUTC: string;
  StartBy: string;
  PauseDTimeUTC: string;
  PauseBy: string;
  FinishDTimeUTC: string;
  FinishBy: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  QtyCustomer: string;
}

export interface Mst_TicketEstablishInfo {
  OrgID: string;
  TicketStatus: string;
  NetworkID: string;
  AgentTicketStatusName: string;
  CustomerTicketStatusName: string;
  FlagUseType: string;
  FlagActive: string;
  Remark: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface Cpn_Campaign_GetByCode {
  Lst_Cpn_Campaign: Cpn_Campaign[];
  Lst_Cpn_CampaignAgent: any[];
  Lst_Cpn_CampaignAttachFile: any[];
  Lst_Cpn_CampaignCustomer: any[];
  MySummaryTable: any | null;
  c_K_DT_Sys: any | null;
}

export interface Mst_CarModel {
  ModelCode: string;
  ModelProductionCode: string;
  ModelName: string;
  SegmentType: string;
  QuotaDate: string;
  FlagBusinessPlan: string;
  FlagActive: string;
  LogLUDateTime: string;
  LogLUBy: string;
}
export interface Mst_DepartmentControl {
  Lst_Mst_Department?: any[];
  Lst_Sys_UserAutoAssignTicket?: any;
  DepartmentCode?: string;
  NetworkID?: string;
  DepartmentCodeParent?: string;
  DepartmentBUCode?: string;
  DepartmentBUPattern?: string;
  DepartmentLevel?: number;
  MST?: string;
  OrgID?: string;
  DepartmentName?: string;
  DepartmentDesc?: string;
  FlagActive?: string;
  LogLUDTimeUTC?: string;
  LogLUBy?: string;
  su_QtyUser?: number;
  md_DepartmentNameParent?: string;
  Mst_Department?: any;
  Lst_Sys_UserMapDepartment?: any;
  DataList?: any;
}
export interface Mst_NNTController {
  DataList?: any;
  Lst_Mst_NNT?: any;
  invalidate?: any;
  Lst_Mst_Org?: any;
  MST: string;
  OrgID: string;
  NNTFullName: string;
  NNTShortName: string;
  NetworkID: string;
  MSTParent: string;
  MSTBUCode: string;
  MSTBUPattern: string;
  MSTLevel: string;
  ProvinceCode: string;
  DistrictCode: string;
  DLCode: string;
  NNTAddress: string;
  NNTMobile: string;
  NNTPhone: string;
  NNTFax: string;
  PresentBy: string;
  BusinessRegNo: string;
  NNTPosition: string;
  PresentIDNo: string;
  PresentIDType: string;
  GovTaxID: string;
  ContactName: string;
  ContactPhone: string;
  ContactEmail: string;
  Website: string;
  CANumber: string;
  CAOrg: string;
  CAEffDTimeUTCStart: string;
  CAEffDTimeUTCEnd: string;
  PackageCode: string;
  CreatedDate: string;
  CreateDTime: string;
  CreateBy: string;
  AccNo: string;
  AccHolder: string;
  BankName: string;
  BizType: string;
  BizFieldCode: string;
  BizSizeCode: string;
  DealerType: string;
  AreaCode: string;
  RegisterStatus: string;
  TCTStatus: string;
  FlagActive?: any;
  Remark: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  mgt_GovTaxID: string;
  mgt_GovTaxName: string;
  DepartmentCode: string;
  DepartmentName: string;
  UserName: string;
  UserPassword: string;
  UserPasswordRepeat: string;
  mp_ProvinceCode: string;
  mp_ProvinceName: string;
  md_DistrictCode: string;
  md_DistrictName: string;
  QtyLicense: string;
  CTSPath: string;
  CTSPwd: string;
  msio_OrderId: string;
  ipmio_Status: string;
  OrgIDSln: string;
  ma_AreaName: string;
}

export interface Sys_GroupController {
  GroupCode: string;
  GroupName: string;
  GroupDesc: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  MST: string;
  QtyUser: number;
  Lst_Sys_UserInGroup?: any;
  Sys_Group?: any;
  Lst_Sys_Access?: any;
  Lst_Sys_AbilityViewEticket?: any;
}
export interface Mst_PaymentTermData {
  PaymentTermCode: string;
  OrgID: string;
  NetworkID: string;
  PaymentTermName: string;
  PTType: string;
  PTDesc: string;
  OwedDay: number;
  CreditLimit: number;
  DepositPercent: number;
  FlagActive: boolean | string;
  Remark: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}
export interface Sys_AccessData {
  Lst_Sys_UserInGroup?: any;
  GroupCode: string;
  ObjectCode: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  so_ObjectCode: string;
  so_ObjectName: string;
  so_ServiceCode: string;
  so_ObjectType: string;
  so_FlagExecModal: string;
  so_FlagActive: string;
  Lst_Sys_Access?: any;
  Sys_Group?: any;
}

export interface SysUserData {
  FlagExist?: any;
  User?: any;
  Lst_Sys_User?: any;
  Lst_Sys_UserInGroup?: any;
  Lst_Sys_UserMapDepartment?: any;
  Data?: any;
  ReUserPassword?: any;
  DataList?: any;
  UserCode: string;
  NetworkID: string;
  UserName: string;
  UserPassword: string;
  UserPasswordNew: string;
  PhoneNo: string;
  EMail: string;
  MST: string;
  OrganCode: string;
  DepartmentCode: string;
  Position: string;
  VerificationCode: string;
  Avatar: string;
  UUID: string;
  FlagDLAdmin: string;
  FlagSysAdmin: string;
  FlagNNTAdmin: string;
  OrgID: string;
  CustomerCodeSys: string;
  CustomerCode: string;
  CustomerName: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  ACId: string;
  ACAvatar: string;
  ACEmail: string;
  ACLanguage: string;
  ACName: string;
  ACPhone: string;
  ACTimeZone: string;
  mo_OrganCode: string;
  mo_OrganName: string;
  mdept_DepartmentCode: string;
  mdept_DepartmentName: string;
  mnnt_DealerType: string;
  ctitctg_CustomerGrpCode: string;
}

export interface DeleteDealerParam {
  DealerCode: string;
}

export interface ClientGateInfoResponse {
  Data: {
    _strTId: string;
    _strAppTId: string;
    _objTTime: string;
    _strType: string;
    _strErrCode: string;
    _objResult?: ClientGateInfo[];
    _excResult: any;
    _dicDebugInfo: {
      strTid: string;
      strAppTId: string;
      "dataInput.SolutionCode": string;
      "dataInput.NetworkIDSearch": string;
    };
  };
}
export interface DeleteBankAccountParam {
  AccountNo: string;
  BankCode: string;
}

export interface Rpt_CpnCampaignResultCallData {
  Rpt_Cpn_CampaignResultCall?: any;
  CampaignCode: string;
  OrgID: string;
  CampaignName: string;
  CreateDTimeUTC: string;
  CampaignStatus: string;
  QtySumCtm: number;
  QtyCtmNew: number;
  QtyPending: number;
  QtyDone: number;
  QtyFailed: number;
  QtyNoAnswer: number;
  QtyCallAgain: number;
  QtyNoAnswerRetry: number;
  QtyDoNotCall: number;
  QtyFailedRetry: number;
}

export interface RptCpnCampaignSummaryCampaignStatusSearchParam {
  MST: string;
  CampaignCode: string;
}

export interface RptETTicketProcessingOverdueByAgent {
  FlagProcessingOverdue?: number;
  OrgIDConditionList?: string;
  TicketTypeConditionList?: string;
  AgentCodeConditionList?: string;
  CreateDTimeUTCFrom?: string;
  CreateDTimeUTCTo?: string;
  ProcessTimeFrom?: number | null;
  ProcessTimeTo?: number | null;
}

export interface RptCpnCampaignSummaryCampaignStatusData {
  CampaignCode: string;
  OrgID: string;
  CampaignCustomerStatus: string;
  QtyCCStatus: number;
  ValRateCCStatus: string;
}

export interface RptTicketTypeSynthesisSearchParam {
  OrgIDConditionList?: string;
  CreateDTimeUTCFrom?: string;
  CreateDTimeUTCTo?: string;
}

export interface Lst_Rpt_TicketType_Synthesis {
  Lst_Rpt_TicketType_Synthesis: Lst_Rpt_TicketType_Synthesis_List[];
}

export interface Lst_Rpt_TicketType_Synthesis_List {
  TicketType: string;
  QtyTicket: number;
  Percent: number;
  TotalQtyTicket: number;
  AgentTicketTypeName: string;
  CustomerTicketTypeName: string;
}

export interface RptETTicketVolatilitySearchParam {
  OrgIDConditionList?: string;
  CreateDTimeUTCFrom?: string;
  CreateDTimeUTCTo?: string;
}

export interface RptCpnCampaignSummaryResultSearchParam {
  MST: string;
  CampaignCode: string;
}

export interface Rpt_Cpn_CampaignSummaryResult {
  CampaignCode: string;
  OrgID: string;
  CampaignTypeCode: string;
  CusFBCode: string;
  CusFBName: string;
  QtyFeedback: number;
  ValCusFeedback: string;
}

export interface RptCpnCampaignSummaryResultData {
  Rpt_Cpn_CampaignSummaryResult: Rpt_Cpn_CampaignSummaryResult[];
}

export interface Rpt_CpnCampaignStatisticCallData {
  Rpt_Cpn_CampaignStatisticCall?: any;
  CampaignCode: string;
  OrgID: string;
  CampaignName: string;
  CreateDTimeUTC: string;
  CampaignStatus: string;
  QtySumCtm: number;
  QtyCtmNew: number;
  QtySumCall: number;
  QtyCallDone: number;
  QtyCallFailed: number;
  QtySumCallTime: number;
  CallTimeAverage: number;
}

export interface Mst_Area {
  OrgID: string;
  AreaCode: string;
  NetworkID: string;
  AreaCodeUser: string;
  AreaCodeParent: string;
  AreaBUCode: string;
  AreaBUPattern: string;
  AreaLevel: number;
  AreaName: string;
  AreaDesc: string;
  FlagActive?: any;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  SolutionCode: string;
  FunctionActionType: string;
}
export interface MstBizColumnData {
  BizType: string;
  BizCol: string;
  NetworkID: string;
  BizColName: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}
export interface KB_PostData {
  PostCode: string;
  OrgID: string;
  NetworkID: string;
  Title: string;
  CategoryCode: string;
  Detail: string;
  Synopsis: string;
  Tag: string;
  PostStatus: string;
  FlagShare: string;
  CreateDTimeUTC: string;
  CreateBy: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  Lst_Mst_Tag?: any;
  Lst_KB_Post?: any;
  KB_Post?: any;
  Lst_KB_PostAttachFile?: any;
  Lst_KB_PostCategory?: any;
  Lst_KB_PostTag?: any;
  Lst_KB_PostLastView?: any;
  Lst_KB_Category?: any;
}
export interface MstSubmissionFormData {
  SubFormCode: string;
  SubFormName: string;
  ChannelType: string;
  BulletinType: string;
  IDZNS: string;
  FlagActive: string;
  strJsonZNS: any;
  Lst_Mst_SubmissionForm?: any;
  Lst_Mst_SubmissionFormZNS?: any;
  Lst_Mst_SubmissionFormMessage?: any;
}
export interface MstChanelData {
  Lst_Mst_Channel?: any;
  Lst_Mst_ChannelZalo?: any;
  Lst_Mst_ChannelEmail?: any;
  Lst_Mst_ChannelSMS?: any;
}
export interface Cpn_CampaignAgentData {
  Data?: any;
  CampaignCode: string;
  OrgID: string;
  CampaignName: string;
  CampaignStatus: string;
  UserName: string;
  Extension: string;
  QtyCustomer: string;
  QtyCustomerSuccess: string;
}
export interface Mst_CustomerGroupData {
  OrgID?: any;
  CustomerGrpCode?: any;
  NetworkID: string;
  CustomerGrpCodeParent: string;
  CustomerGrpBUCode: string;
  CustomerGrpBUPattern: string;
  CustomerGrpLevel: string;
  CustomerGrpName: string;
  CustomerGrpDesc: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  SolutionCode: string;
  FunctionActionType: string;
  CustomerGrpImage: string;
}

export interface Mst_Dealer {
  DealerCode: string;
  DealerType: string;
  ProvinceCode: string;
  BUCode: string;
  BUPattern: string;
  DealerName: string;
  FlagDirect: string;
  FlagActive: string;
  DealerScale: string;
  DealerPhoneNo: string;
  DealerFaxNo: string;
  CompanyName: string;
  CompanyAddress: string;
  ShowroomAddress: string;
  GarageAddress: string | null;
  GaragePhoneNo: string | null;
  GarageFaxNo: string | null;
  DirectorName: string | null;
  DirectorPhoneNo: string | null;
  DirectorEmail: string | null;
  SalesManagerName: string | null;
  SalesManagerPhoneNo: string | null;
  SalesManagerEmail: string;
  GarageManagerName: string | null;
  GarageManagerPhoneNo: string | null;
  GarageManagerEmail: string | null;
  TaxCode: string;
  ContactName: string;
  Signer: string | null;
  SignerPosition: string | null;
  CtrNoSigner: string | null;
  CtrNoSignerPosition: string | null;
  HTCStaffInCharge: string | null;
  Remark: string;
  DealerAddress01: string | null;
  DealerAddress02: string | null;
  DealerAddress03: string | null;
  DealerAddress04: string | null;
  DealerAddress05: string | null;
  FlagTCG: string;
  FlagAutoLXX: string;
  FlagAutoMapVIN: string;
  FlagAutoSOAppr: string;
}

export interface Province {
  ProvinceCode: string;
  AreaCode: string;
  ProvinceName: string;
  FlagActive: string;
  LogLUDateTime: string;
  LogLUBy: string;
}
export interface Mst_CampaignTypeGetDate {
  Lst_Mst_CampaignType: Mst_CampaignTypeData;
  Lst_Mst_CustomColumnCampaignType: any[];
  Lst_Mst_CustomerFeedBack: any[];
}

export interface Mst_CampaignTypeData {
  CampaignTypeCode: string;
  OrgID: string;
  NetworkID: string;
  CampaignTypeName: string;
  CampaignTypeDesc: string;
  Remark: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  // errorCode: string;
  // errorInfo?: errorInfo;
  // debugInfo: object;
  _strErrCode: string;
  _strTId?: string;
  _strAppTId?: string;
  _objTTime?: string;
  _strType?: string;
  _dicDebug: object;
  _dicExcs: _dicExcs;
  DataList?: T[];
  Data?: T;
  ItemCount?: number;
  PageCount?: number;
  PageIndex?: number;
  PageSize?: number;
}

export interface SearchDealerParam extends SearchParam {
  DealerCode: string;
  DealerName: string;
  FlagAutoLXX: FlagActiveEnum;
  FlagAutoMapVIN: FlagActiveEnum;
  FlagAutoSOAppr: FlagActiveEnum;
}
export interface SearchUserControlParam {
  UserCode?: string;
  UserName?: string;
  PhoneNo?: string;
  EMail?: string;
  FlagActive: FlagActiveEnum;
  Ft_PageSize: number;
  Ft_PageIndex: number;
  KeyWord?: string;
}

export enum FlagActiveEnum {
  Active = "1",
  Inactive = "0",
  All = "",
}

export interface SearchParam {
  KeyWord: string;
  FlagActive: FlagActiveEnum;
  Ft_PageSize: number;
  Ft_PageIndex: number;
}
export interface Rpt_CpnCampaignResultCallSearchParam {
  AgentCodeConditionList: string;
  CampaignCodeConditionList: string;
  ReportDTimeTo: string;
  ReportDTimeFrom: string;
}
export interface Rpt_ETTicketDetailControllerSearchParam {
  AgentCodeConditionList: string;
  DepartmentCodeConditionList: string;
  OrgIDConditionList: string;
  TicketTypeConditionList: string;
  CustomerName?: string;
  CustomerCodeSys?: string;
  CustomerPhoneNo: string;
  CustomerEmail: string;
  CustomerCompany: string;
  TicketStatusConditionList: string;
  CreateDTimeUTCFrom: string;
  CreateDTimeUTCTo: string;
  LUDTimeUTCFrom: string;
  LUDTimeUTCTo: string;
  TicketCustomTypeConditionList: string;
}
export interface Rpt_MissCallSearchParam {
  AgentCodeConditionList: string;
  DepartmentCodeConditionList: string;
  OrgIDConditionList: string;
  TicketTypeConditionList: string;
  CustomerName: string;
  CustomerCodeSys: string;
  CustomerPhoneNo: string;
  CustomerEmail: string;
  CustomerCompany: string;
  TicketStatusConditionList: string;
  CreateDTimeUTCFrom: string;
  CreateDTimeUTCTo: string;
  TicketCustomTypeConditionList: string;
}
export interface Rpt_SLASearchParam {
  AgentCodeConditionList: string;
  DepartmentCodeConditionList: string;
  OrgIDConditionList: string;
  TicketTypeConditionList: string;
  TicketCustomTypeConditionList: string;
  CustomerName?: string;
  CustomerCodeSys: string;
  CustomerPhoneNo: string;
  CustomerEmail: string;
  CustomerCompany: string;
  CreateDTimeUTCFrom: string;
  CreateDTimeUTCTo: string;
}
export interface Rpt_CpnCampaignResultCtmFeedbackSearchParam {
  CampaignCodeConditionList: string;
  CampaignTypeCode: string;
  ReportDTimeTo: string;
  ReportDTimeFrom: string;
}
export interface Rpt_CpnCampaignResultCtmFeedbackData {
  CAMPAIGNCODE: string;
  ORGID: string;
  CAMPAIGNNAME: string;
  CREATEDTIMEUTC: string;
  CAMPAIGNSTATUS: string;
  QTYSUMCTM: string;
  QTYDONE: string;
  "Quan tâm": "1 - 0.5%";
  "Không quan tâm": "1 - 0.5%";
}
export interface Rpt_CpnCampaignStatisticCallSearchParam {
  AgentCodeConditionList: string;
  CampaignCodeConditionList: string;
  ReportDTimeTo: string;
  ReportDTimeFrom: string;
}
export interface Cpn_CampaignAgentParam {
  AgentCode: string;
  CampaignCode: FlagActiveEnum;
}

export interface Cpn_CampaignSearch extends SearchParam {
  CreateDTimeUTCFrom: string;
  CreateDTimeUTCTo: string;
  StartDTimeUTCFrom: string;
  StartDTimeUTCTo: string;
  FinishDTimeUTCFrom: string;
  FinishDTimeUTCTo: string;
  CampaignStatus: string;
  CampaignTypeCode: string;
}

export interface Mst_CampaignType {
  CampaignTypeCode: string;
  OrgID: string;
  NetworkID: string;
  CampaignTypeName: string;
  CampaignTypeDesc: string;
  Remark: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface Param_Mst_CampaignTypeCreate {
  Mst_CampaignType: Partial<Mst_CampaignType>;
  Lst_Mst_CustomColumnCampaignType: any[];
  Lst_Mst_CustomerFeedBack: any[];
}

export interface Mst_CampaignTypeSearchParam {
  CampaignTypeName: string;
  CampaignTypeDesc: string;
  KeyWord: string;
  FlagActive: string;
  Ft_PageSize: number;
  Ft_PageIndex: number;
}
export interface DepartmentSearchParam {
  KeyWord: string;
  FlagActive: FlagActiveEnum;
  Ft_PageSize: number;
  Ft_PageIndex: number;
}

export interface SearchCustomerParam extends SearchParam {
  CustomerCodeSys: string;
  ColGrpCodeSys: string;
  OrderByClause: string;
  CustomerType: string;
}

export interface MdMetaColGroupSpec {
  OrgID: string;
  ColGrpCodeSys: string;
  ColCodeSys: string;
  NetworkID: string;
  ColOperatorType: string;
  OrderIdx: number;
  JsonRenderParams?: any;
  JsonListOption: string;
  FlagIsNotNull: string;
  FlagIsCheckDuplicate: string;
  FlagIsQuery: string;
  FlagActive: string;
  FlagIsColDynamic: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  ColCode: string;
  ColCaption: string;
  ColDataType: string;
  Lst_MD_OptionValue?: any[];
}
export interface Rpt_ETTicketDetailControllerData {
  TicketID: string;
  CustomerCodeSys: string;
  CustomerName: string;
  TicketName: string;
  TicketDetail: string;
  AgentCode: string;
  AgentName: string;
  TicketStatus: string;
  AgentTicketStatusName: string;
  CustomerTicketStatusName: string;
  TicketDeadline: string;
  FistTicketMessage: string;
  FirstResTime: number;
  ResolutionTime: number;
  CloseDTimeUTC: string;
  ReceptionDTimeUTC: string;
  ProcessTime: number;
  TicketWarning: string;
  Rpt_ET_Ticket_Detail?: any[];
}
export interface Rpt_SLAControllerData {
  AgentCode: string;
  AgentName: string;
  TicketType: string;
  AgentTicketTypeName: string;
  CustomerTicketTypeName: string;
  QtyTicket: number;
  QtySLAResponding: number;
  QtySLANotResponding: number;
  SLARespondingRate: number;
}
export interface Rpt_MissedCallsData {
  TicketID: string;
  CustomerCodeSys: string;
  CustomerPhoneNo: string;
  CustomerName: string;
  AgentCode: string;
  AgentName: string;
  TicketStatus: string;
  AgentTicketStatusName: string;
  CustomerTicketStatusName: string;
  MissCallDTimeUTC: string;
  Detail: string;
  QtyMissCall: number;
  RecFilePath: string;
  TalkDTimeUTC: string;
  FirstResTime: number;
  ProcessTime: number;
  CreateDTimeUTC: string;
  CloseDTimeUTC: string;
}
export interface Rpt_ETTicketSynthesisController {
  RT_Rpt_ET_Ticket_Synthesis: {
    Rpt_ET_Ticket_Synthesis: {
      AvgFirstResponse: number;
      MinProcessTime: number;
      MaxProcessTime: number;
      AvgProcessTime: number;
      SLAResponseRate: number;
    };
    Lst_Rpt_ET_Ticket_SynthesisDtl: [
      {
        CreateDate: string;
        TicketStatus: string;
        AgentTicketStatusName: string;
        CustomerTicketStatusName: string;
        QtyTicket: number;
      }
    ];
  };
}

export interface vggMst_CampaignColumnConfig_GetCampaignColCfgCodeSys {
  Success: boolean;
  Data: string;
  DataList: null;
  ErrorData: null;
}

export interface Mst_CampaignColumnConfig {
  CampaignColCfgCodeSys: string;
  CampaignColCfgCode: string;
  OrgID: string;
  NetworkID: string;
  CampaignColCfgDataType: string;
  CampaignColCfgName: string;
  CampaignColCfgDateUse: string;
  JsonListOption: string;
  FlagIsDynamic: string;
  FlagActive: true;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  IsRequired: boolean | string;
  IsUnique: boolean | string;
  IsSearchable: boolean | string;
  ListOption: any[];
  DataSource: string;
}

export interface Mst_Customer {
  OrgID: string;
  CustomerCodeSys: string;
  NetworkID: string;
  CustomerCode: string;
  CustomerType: string;
  CustomerGrpCode: string;
  CustomerSourceCode: string;
  CustomerName: string;
  CustomerNameEN: string;
  CustomerGender: string;
  CustomerPhoneNo: string;
  CustomerMobilePhone: string;
  ProvinceCode: string;
  DistrictCode: string;
  WardCode: string;
  AreaCode: string;
  CustomerAvatarName: string;
  CustomerAvatarSpec: string;
  FlagCustomerAvatarPath: string;
  CustomerAvatarPath: string;
  JsonCustomerInfo: string;
  CustomerAddress: string;
  CustomerEmail: string;
  CustomerDateOfBirth: string;
  GovIDType: string;
  GovIDCardNo: string;
  GovIDCardDate: string;
  GovIDCardPlace: string;
  TaxCode: string;
  BankCode: string;
  BankName: string;
  ListOfCustDynamicFieldValue: string;
  BankAccountNo: string;
  RepresentName: string;
  RepresentPosition: string;
  UserCodeOwner: string;
  ContactName: string;
  ContactPhone: string;
  ContactEmail: string;
  Fax: string;
  Facebook: string;
  InvoiceCustomerName: string;
  InvoiceCustomerAddress: string;
  InvoiceOrgName: string;
  InvoiceEmailSend: string;
  MST: string;
  FlagDealer: string;
  FlagSupplier: string;
  FlagEndUser: string;
  FlagShipper: string;
  FlagBank: string;
  FlagInsurrance: string;
  DTimeUsed: string;
  CreateDTimeUTC: string;
  CreateBy: string;
  LUDTimeUTC: string;
  LUBy: string;
  FlagActive: string;
  Remark: string;
  Coordinates: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  Org_NNTFullName: string;
  Network_NNTFullName: string;
  mct_CustomerTypeName: string;
  mcg_CustomerGrpName: string;
  mcs_CustomerSourceName: string;
  mp_ProvinceName: string;
  md_DistrictName: string;
  mw_WardName: string;
  ma_AreaName: string;
  mg_GovIDTypeName: string;
  SolutionCode: string;
  FunctionActionType: string;
  GetCustomData: string;
  GetCustomDataString: string;
  SetCustomData: string;
}

export interface Mst_TicketPriority {
  OrgID: string;
  TicketPriority: string;
  NetworkID: string;
  AgentTicketPriorityName: string;
  CustomerTicketPriorityName: string;
  FlagUseType: string;
  FlagActive: string;
  Remark: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

interface OptionItem {
  OrderIdx: number;
  Value: string;
}

export interface MstCampaignColumnConfig {
  CampaignColCfgCodeSys: string;
  CampaignColCfgCode: string;
  OrgID: string;
  NetworkID: string;
  CampaignColCfgDataType: string;
  CampaignColCfgName: string;
  CampaignColCfgDateUse: string;
  FlagIsDynamic: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface MdMetaColGroupSpecDto extends MdMetaColGroupSpec {
  ListOption: any[];
  // incase of select one
  DefaultIndex?: string;
  IsRequired: boolean;
  Enabled: boolean;
  IsUnique: boolean;
  IsSearchable: boolean;
  DataSource?: string;
  mdmc_JsonListOption?: any;
}

interface ISearchParam {
  FlagActive: 0 | 1;
  Ft_PageIndex: number;
  Ft_PageSize: number;
}
export interface MdMetaColGroupSpecSearchParam extends ISearchParam {
  ColGrpCodeSys: string;
}

export interface MdMetaColGroupSearchParam extends ISearchParam {
  ScrTplCodeSys: string;
}

export interface MstTicketColumnConfig {
  TicketColCfgCodeSys: string;
  OrgID: string;
  TicketColCfgCode: string;
  NetworkID: string;
  TicketColCfgDataType: string;
  TicketColCfgName: string;
  TicketColCfgDateUse: string;
  JsonListOption: string;
  FlagCheckDuplicate: string;
  FlagCheckRequire: string;
  FlagIsDynamic: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface MstTicketColumnConfigParam {
  TicketColCfgCodeSys: string;
  OrgID: string;
  TicketColCfgCode: string;
  NetworkID: string;
  TicketColCfgDataType: string;
  TicketColCfgName: string;
  TicketColCfgDateUse: string;
  JsonListOption: string;
  FlagCheckDuplicate: Boolean;
  FlagCheckRequire: Boolean;
  FlagIsDynamic: Boolean;
  FlagActive: Boolean;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface MstTicketColumnConfigDtoParamV {
  TicketColCfgCodeSys: string;
  OrgID: string;
  TicketColCfgCode: string;
  NetworkID: string;
  TicketColCfgDataType: string;
  TicketColCfgName: string;
  TicketColCfgDateUse: string;
  JsonListOption: string;
  FlagCheckDuplicate: string;
  FlagCheckRequire: string;
  FlagIsDynamic: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface MstTicketColumnConfigDtoParam
  extends MstTicketColumnConfigDtoParamV {
  ListOption: any[];
  // incase of select one
  DefaultIndex?: string;
  IsRequired: boolean;
  Enabled: boolean;
  IsUnique: boolean;
  IsSearchable: boolean;
  DataSource?: string;
}

export interface MstTicketColumnConfigDto extends MstTicketColumnConfigParam {
  ListOption: any[];
  DefaultIndex?: string;
  IsRequired: boolean;
  Enabled: boolean;
  IsUnique: boolean;
  IsSearchable: boolean;
  DataSource?: string;
}

export interface MdMetaColGroup {
  OrgID: string;
  ColGrpCodeSys: string;
  NetworkID: string;
  ScrTplCodeSys: string;
  ColGrpCode: string;
  ColGrpName: string;
  OrderIdx: number;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface MdMetaColumnDataType {
  ColDataType: string;
  NetworkID: string;
  ColDataTypeDesc: string;
  SqlDataType: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface MdMetaColumnOperatorType {
  ColOperatorType: string;
  NetworkID: string;
  ColOperatorTypeDesc: string;
  SqlOperatorType: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface MdOptionValue {
  Key: string;
  OrderIdx: number;
  Value: string;
}

export interface MdMetaColGroupSpecListOption {
  OrgID: string;
  ColGrpCodeSys: string;
  ColCodeSys: string;
  NetworkID: string;
  ColOperatorType: string;
  OrderIdx: string;
  JsonRenderParams: string;
  JsonListOption: string;
  FlagIsNotNull: string;
  FlagIsCheckDuplicate: string;
  FlagIsQuery: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  ColCode: string;
  ColCaption: string;
  ColDataType: string;
  Lst_MD_OptionValue: {
    Key: string;
    Value: string;
    OrderIdx: string;
  }[];
}
export interface KB_CategoryData {
  CategoryCode: string;
  OrgID: string;
  CategoryParentCode: string;
  NetworkID: string;
  CategoryName: string;
  CategoryDesc: string;
  Slug: string;
  FlagActive: string;
  CreateDTimeUTC: string;
  CreateBy: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  expanded: boolean;
  selected: boolean;
  Lst_KB_CategoryChildren?: any;
  Lst_KB_Category?: any;
  KB_Category?: any;
}
export interface UploadedFile {
  FileId: string;
  NodeID: string;
  NetworkID: string;
  SolutionCode: string;
  FileUrlLocal: string;
  FileUrlFS: string;
  FileFullName: string;
  FileType: string;
  FileSize: number;
  FileContent: string;
  RefNo: string;
  RefType: string;
  FileIdDelete: string;
  CreateDTimeUTC: string;
  CreateBy: string;
  LUDTimeUTC: string;
  LUBy: string;
  UpdDTimeUTC: string;
  UpdBy: string;
  DeleteDTimeUTC: string;
  DeleteBy: string;
  FlagIsDeleted: string;
  FlagIsRecycle: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  isUploading?: boolean;
  Idx?: any;
}

export interface Mst_CustomerHist {
  AutoId: number | string;
  OrgID: string;
  CustomerCodeSys: string;
  NetworkID: string;
  JsonCustomerInfoHist: any;
  LUDTimeUTC: any;
  LUBy: string | undefined;
  LUByName: string | undefined;
  LogLUDTimeUTC: any;
  LogLUBy: string | undefined;
}

export interface Mst_SLA {
  SLAID: string;
  OrgID: string;
  NetworkID: string;
  SLALevel: string;
  SLADesc: string;
  FirstResTime: string;
  EveryResTime: string;
  ResolutionTime: string;
  SLAStatus: string;
  ANDConditionDetails: string;
  ORConditionDetails: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface SearchSLAParams extends SearchParam {
  SLALevel: string;
  SLADesc: string;
  SLAStatus: string;
}

export interface Mst_TicketType {
  OrgID: string;
  TicketType: string;
  NetworkID: string;
  AgentTicketTypeName: string;
  CustomerTicketTypeName: string;
  FlagUseType: string;
  FlagActive: string;
  Remark: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
}

export interface Mst_CustomContact {
  OrgID: string;
  CustomerCodeSys: string;
  CustomerCodeSysContact: string;
  NetworkID: string;
  FlagActive: string;
  LogLUDTimeUTC: string;
  LogLUBy: string;
  mc_CustomerCodeSys: string;
  mc_CustomerCode: string;
  mc_CustomerName: string;
  mc_CustomerNameEN: string;
  mc_CustomerAvatarName: string;
  mc_CustomerAvatarPath: string;
  mc_JsonCustomerInfo: any;
}
