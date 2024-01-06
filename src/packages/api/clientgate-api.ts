import { Tid } from "@/utils/hash";
import { IUser } from "@packages/types";
import axios, { AxiosError } from "axios";
import { useAuth } from "../contexts/auth";
import { useGetForCurrentUser } from "./clientgate/Api_GetForCurrentUser";
// import { useMst_CostTypeApi } from "./clientgate/Mst_CostTypeApi";
import { useCustomFieldApi } from "@packages/api/clientgate/CustomFieldApi";
import { useMdMetaColGroupSpecApi } from "@packages/api/clientgate/MDMetaColGroupSpecApi";
import { useMdMetaColGroupApi } from "@packages/api/clientgate/MdMetaColGroupApi";
import { FlagActiveConvertor } from "@packages/api/interceptors/flag-active-convertor";
import { useCpn_CampaignAgentApi } from "./clientgate/Cpn_CampaignAgentApi";
import { useCpn_Campaign } from "./clientgate/Cpn_CampaignApi";
import { useFileApi } from "./clientgate/FileApi";
import { useMst_AreaApi } from "./clientgate/Mst_AreaApi";
import { useMst_CampaignColumnConfig } from "./clientgate/Mst_CampaignColumnConfigApi";
import { use_MstCampaignTypeApi } from "./clientgate/Mst_CampaignTypeApi";
import { useMst_CarModelApi } from "./clientgate/Mst_CarModelApi";
import { useMst_ContentApi } from "./clientgate/Mst_ContentApi";
import { useMst_Customer } from "./clientgate/Mst_CustomerApi";
import { useMst_CustomerGroupApi } from "./clientgate/Mst_CustomerGroupApi";
import { useMst_CustomerHist } from "./clientgate/Mst_CustomerHistApi";
import { useDealerApi } from "./clientgate/Mst_Dealer-api";
import { useMst_DealerType } from "./clientgate/Mst_DealerTypeApi";
import { useMst_DepartmentControlApi } from "./clientgate/Mst_DepartmentApi";
import { useMst_NNTControllerApi } from "./clientgate/Mst_NNTControllerApi";
import { useMst_PaymentTermControllerApi } from "./clientgate/Mst_PaymentTermControllerApi";
import { useMst_Province_api } from "./clientgate/Mst_ProvinceApi";
import { useMst_SLAApi } from "./clientgate/Mst_SLAApi";
import { useMst_TicketEstablishInfoApi } from "./clientgate/Mst_TicketEstablishInfoApi";
import { useRptCpnCampaignSummaryResultApi } from "./clientgate/RptCpnCampaignSummaryResultApi";
import { useRpt_CpnCampaignResultCallApi } from "./clientgate/Rpt_CpnCampaignResultCallApi";
import { useRpt_CpnCampaignResultCtmFeedbackApi } from "./clientgate/Rpt_CpnCampaignResultCtmFeedbackApi";
import { useRpt_CpnCampaignStatisticCallApi } from "./clientgate/Rpt_CpnCampaignStatisticCallApi";
import { useSys_GroupControllerApi } from "./clientgate/SysGroupControllerApi";
import { useSys_AccessApi } from "./clientgate/Sys_AccessApi";
import { useSys_UserApi } from "./clientgate/Sys_UserApi";

import { useCallCallApi } from "./clientgate/CallCallApi";
import { useETTicket } from "./clientgate/ET_TicketApi";
import { useKB_CategoryApi } from "./clientgate/KB_CategoryApi";
import { useKB_PostApi } from "./clientgate/KB_Post_ControllerApi";
import { useMst_TicketPriority } from "./clientgate/MstTicketPriority_Api";
import { useMst_Channel } from "./clientgate/Mst_ChannelApi";
import { useMst_CustomerCampaign } from "./clientgate/Mst_CustomerCampaignApi";
import { useMst_CustomerContact } from "./clientgate/Mst_CustomerContactApi";
import { useMst_CustomerEticket } from "./clientgate/Mst_CustomerEticketApi";
import { useMst_CustomerTypeApi } from "./clientgate/Mst_CustomerTypeApi";
import { useMst_PartnerTypeApi } from "./clientgate/Mst_PartnerType";
import { useMst_ReceptionChannelApi } from "./clientgate/Mst_ReceptionChannelApi";
import { useMst_SubmissionForm } from "./clientgate/Mst_SubmissionForm_Api";
import { use_MstTicketColumnConfigApi } from "./clientgate/Mst_TicketColumnConfigApi";
import { useMst_TicketCustomTypeApi } from "./clientgate/Mst_TicketCustomTypeApi";
import { useMst_TicketPriorityApi } from "./clientgate/Mst_TicketPriorityApi";
import { useMst_TicketSourceApi } from "./clientgate/Mst_TicketSourceApi";
import { useMst_TicketStatusApi } from "./clientgate/Mst_TicketStatusApi";
import { useMst_TicketTypeApi } from "./clientgate/Mst_TicketTypeApi";
import { useNotificationApi } from "./clientgate/NotificationApi";
import { useUtil_Api } from "./clientgate/Util_Api";
import { useZalo_Api } from "./clientgate/Zalo_Api";

import { useCpn_CampaignCustomerApi } from "./clientgate/Cpn_CampaignCustomerApi";
import { useMdMetaColumnApi } from "./clientgate/MdMetaColumnApi";
import { useMst_CountryApi } from "./clientgate/Mst_CountryApi";
import { useGovIDTypeApi } from "./clientgate/Mst_GovIDTypeApi";
import { useRpt_CallAnalysisApi } from "./clientgate/RptCallAnalysisApi";
import { useRptCpnCampaignSummaryCampaignStatusApi } from "./clientgate/RptCpnCampaignSummaryCampaignStatusApi";
import { useRptETTicketProcessingOverdueApi } from "./clientgate/RptETTicketProcessingOverdueApi";
import { useRptETTicketProcessingOverdueByAgentApi } from "./clientgate/RptETTicketProcessingOverdueByAgentApi";
import { useRptETTicketVolatilityApi } from "./clientgate/RptETTicketVolatility";
import { useRpt_ETTicketDetailControllerApi } from "./clientgate/Rpt_ETTicketDetailControllerApi";
import { useRptETTicketSynthesisControllerApi } from "./clientgate/Rpt_ETTicketSynthesisController";
import { useRptMissedCallsApi } from "./clientgate/Rpt_MissedCallsApi";
import { useRptSLAControllerApi } from "./clientgate/Rpt_SLAControllerApi";
import { useRptTicketTypeSynthesisApi } from "./clientgate/Rpt_TicketTypeSynthesis";
import { useSeq_Api } from "./clientgate/Seq_Api";
import { use_ServiceImprovementApi } from "./clientgate/ServiceImprovementApi";
import { use_SvImpAudioAnalysisApi } from "./clientgate/SvImpAudioAnalysisApi";
import { useMst_EstablishRemindETicket } from "./clientgate/MstEstablishRemindETicketApi";
// import { use_ServiceImprovementApi } from "./clientgate/ServiceImprovementApi";
// report end

/**
 * Creates an axios instance for making requests to the ClientGate API.
 * @param {IUser} currentUser - The current user's information.
 * @param {string} clientGateDomain - The base URL for the ClientGate API.
 * @param {string} networkId - The ID of the network.
 * @param {string} orgId - The ID of the organization.
 * @return {AxiosInstance} An axios instance configured for the ClientGate API.
 */
export const createReportApiBase = (
  currentUser: IUser,
  clientGateDomain: string,
  networkId: string,
  orgId: string
) => {
  const api = axios.create({
    baseURL: clientGateDomain,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      AppAgent: import.meta.env.VITE_AGENT,
      GwUserCode: import.meta.env.VITE_GW_USER,
      GwPassword: import.meta.env.VITE_GW_USER_PW,
      AppVerCode: "V1",
      Tid: Tid(),
      AppTid: Tid(),
      AppLanguageCode: currentUser?.Language,
      UtcOffset: currentUser?.TimeZone,
      NetworkId: networkId,
      OrgId: orgId,
    },
  });
  api.interceptors.request.use(
    FlagActiveConvertor.beforeRequest,
    function (error) {
      return Promise.reject(error);
    }
  );
  api.interceptors.response.use(
    function (response) {
      // with this API, it always falls to this case.
      const data = response.data;
      const result: any = {
        isSuccess: data.Data._strErrCode === "0" && !data.Data._excResult,
        debugInfo: data.Data._dicDebugInfo,
        errorInfo:
          data.Data._strErrCode === "0" ? undefined : data.Data._excResult,
        errorCode: data.Data._strErrCode,
      };
      if (result.isSuccess && !!data.Data._objResult) {
        if (data.Data._objResult.Data) {
          result.Data = data.Data._objResult.Data;
        } else {
          result.Data = data.Data._objResult;
        }
      } else {
      }
      return result;
    },
    function (error: AxiosError) {
      if (error?.response?.status === 401) {
        location.href = "/login";
      }
      return Promise.reject(error.response?.data);
    }
  );
  return api;
};
/**
 * Creates an axios instance for making requests to the ClientGate API.
 * @param {IUser} currentUser - The current user's information.
 * @param {string} clientGateDomain - The base URL for the ClientGate API.
 * @param {string} networkId - The ID of the network.
 * @param {string} orgId - The ID of the organization.
 * @return {AxiosInstance} An axios instance configured for the ClientGate API.
 */
export const createClientGateApiBase = (
  currentUser: IUser,
  clientGateDomain: string,
  networkId: string,
  orgId: string
) => {
  const api = axios.create({
    baseURL: clientGateDomain,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      AppAgent: import.meta.env.VITE_AGENT,
      GwUserCode: import.meta.env.VITE_GW_USER,
      GwPassword: import.meta.env.VITE_GW_USER_PW,
      AppVerCode: "V1",
      Tid: Tid(),
      AppTid: Tid(),
      AppLanguageCode: currentUser?.Language,
      UtcOffset: currentUser?.TimeZone,
      NetworkId: networkId,
      OrgId: orgId,
    },
  });
  api.interceptors.request.use(
    FlagActiveConvertor.beforeRequest,
    function (error) {
      return Promise.reject(error);
    }
  );
  api.interceptors.response.use(
    function (response) {
      // with this API, it always falls to this case.
      const data = response.data;
      const result: any = {
        isSuccess: data.Data._strErrCode === "0" && !data.Data._excResult,
        debugInfo: data.Data._dicDebugInfo,
        errorInfo:
          data.Data._strErrCode === "0" ? undefined : data.Data._excResult,
        errorCode: data.Data._strErrCode,
        // customize
        _objTTime: data.Data._objTTime ?? "",
        _strAppTId: data.Data._strAppTId ?? "",
        _strErrCode: data.Data._strErrCode ?? "",
        _strTId: data.Data._strTId ?? "",
        _strType: data.Data._strType ?? "",
        _dicExcs: data.Data._dicExcs ?? {},
        _dicDebug: data.Data._dicDebug ?? {},
      };
      if (
        result.isSuccess &&
        !!data.Data._objResult &&
        !!data.Data._objResult.DataList
      ) {
        result.DataList = data.Data._objResult.DataList.map((item: any) => {
          // if `item` has `FlagActive` property
          if (Object.keys(item).includes("FlagActive")) {
            item.FlagActive = item.FlagActive === "1";
          }
          return {
            ...item,
          };
        });

        result.ItemCount = data.Data._objResult.ItemCount;
        result.PageCount = data.Data._objResult.PageCount;
        result.PageIndex = data.Data._objResult.PageIndex;
        result.PageSize = data.Data._objResult.PageSize;
      } else {
        if (
          !!data.Data?._objResult &&
          typeof data.Data?._objResult === "object"
        ) {
          result.Data = data.Data?._objResult.Data || data.Data?._objResult;
        } else if (typeof data.Data?._objResult !== "string") {
          result.Data = data.Data?._objResult?.map((item: any) => {
            // if `item` has `FlagActive` property
            if (Object.keys(item).includes("FlagActive")) {
              item.FlagActive = item.FlagActive === "1";
            }
            return {
              ...item,
            };
          });
        } else {
          result.Data = data.Data?._objResult;
        }
      }
      return result;
    },
    function (error: AxiosError) {
      if (error?.response?.status === 401) {
        location.href = "/login";
      }
      return Promise.reject(error.response?.data);
    }
  );
  return api;
};

export const createClientGateApi = (
  currentUser: IUser,
  clientgateDomain: string,
  networkId: string,
  orgId: string
) => {
  const apiBase = createClientGateApiBase(
    currentUser,
    clientgateDomain,
    networkId,
    orgId
  );
  const reportApiBase = createReportApiBase(
    currentUser,
    clientgateDomain,
    networkId,
    orgId
  );
  const useDealer = useDealerApi(apiBase);
  const getCurrentUserApis = useGetForCurrentUser(apiBase);
  const mstDealerType = useMst_DealerType(apiBase);
  const provinceApis = useMst_Province_api(apiBase);
  const mstAreaApi = useMst_AreaApi(apiBase);
  const mstCarModelApi = useMst_CarModelApi(apiBase);
  const mdMetaColGroupSpecApi = useMdMetaColGroupSpecApi(apiBase);
  const mdMetaColGroupApi = useMdMetaColGroupApi(apiBase);
  const customFieldApi = useCustomFieldApi(apiBase);
  const mstDepartmentControlApi = useMst_DepartmentControlApi(apiBase);
  const sys_UserApi = useSys_UserApi(apiBase);
  const mstNNTControllerApi = useMst_NNTControllerApi(apiBase);
  const useMstSubmissionForm = useMst_SubmissionForm(apiBase);
  // const mdMetaColGroupApi = useMdMetaColGroupApi(apiBase)
  // const customFieldApi = useCustomFieldApi(apiBase);
  const useMstCustomer = useMst_Customer(apiBase);
  const useMstCususeMstCampaignColumnConfigtomer =
    useMst_CampaignColumnConfig(apiBase);
  const sysGroupControllerApi = useSys_GroupControllerApi(apiBase);
  const sysAccessApi = useSys_AccessApi(apiBase);
  const mstCustomerGroupApi = useMst_CustomerGroupApi(apiBase);
  const mstPartnerTypeApi = useMst_PartnerTypeApi(apiBase);
  const seqApi = useSeq_Api(apiBase);

  const metaColColumn = useMdMetaColumnApi(apiBase);
  const mstCustomerHist = useMst_CustomerHist(apiBase);
  const mstCustomerCampaign = useMst_CustomerCampaign(apiBase);
  const mstCustomerEticket = useMst_CustomerEticket(apiBase);
  const mstCustomerType = useMst_CustomerTypeApi(apiBase);
  const zaloApi = useZalo_Api(apiBase);
  const callcallApi = useCallCallApi(apiBase);
  const notificationApi = useNotificationApi(apiBase);

  const mstPaymentTermControllerApi = useMst_PaymentTermControllerApi(apiBase);
  const mstCampaignTypeApi = use_MstCampaignTypeApi(apiBase);
  const useCpnCampaign = useCpn_Campaign(apiBase);
  const cpnCampaignAgentApi = useCpn_CampaignAgentApi(apiBase);
  const rpt_CpnCampaignResultCallApi = useRpt_CpnCampaignResultCallApi(apiBase);
  const rpt_CpnCampaignStatisticCallApi =
    useRpt_CpnCampaignStatisticCallApi(apiBase);
  const fileApi = useFileApi(apiBase);
  const rpt_CpnCampaignResultCtmFeedbackApi =
    useRpt_CpnCampaignResultCtmFeedbackApi(apiBase);
  const useMstTicketColumnConfigApi = use_MstTicketColumnConfigApi(apiBase);
  // eticket
  const useMst_TicketEstablishInfo = useMst_TicketEstablishInfoApi(apiBase);
  const mstSLAApi = useMst_SLAApi(apiBase);
  const useETicket = useETTicket(apiBase);
  const mstEticketType = useMst_TicketTypeApi(apiBase);
  const mstEticketCustomType = useMst_TicketCustomTypeApi(apiBase);
  const mstEticketPriority = useMst_TicketPriorityApi(apiBase);
  const mstEticketSource = useMst_TicketSourceApi(apiBase);
  const mstEticketStatus = useMst_TicketStatusApi(apiBase);

  const mstReceptionChannel = useMst_ReceptionChannelApi(apiBase);
  const mstCustomerContact = useMst_CustomerContact(apiBase);
  const utilApi = useUtil_Api(apiBase);

  // const mst_BizColumn = useMst_BizColumnApi(apiBase);
  const mst_ContentApi = useMst_ContentApi(apiBase);
  const KB_Post = useKB_PostApi(apiBase);
  const mst_Channel = useMst_Channel(apiBase);
  const kb_Category = useKB_CategoryApi(apiBase);
  const useMstTicketPriority = useMst_TicketPriority(apiBase);
  const rptETTicketDetailController =
    useRpt_ETTicketDetailControllerApi(apiBase);
  const rptETTicketSynthesisControllerApi =
    useRptETTicketSynthesisControllerApi(apiBase);
  const rptSLAControllerApi = useRptSLAControllerApi(apiBase);

  const cpnCampaignCustomerApi = useCpn_CampaignCustomerApi(apiBase);
  const rptMissedCallsApi = useRptMissedCallsApi(apiBase);

  const mstCountryApi = useMst_CountryApi(apiBase);
  const serviceImprovement = use_ServiceImprovementApi(apiBase);
  const SvImpAudioAnalysis = use_SvImpAudioAnalysisApi(apiBase);
  const rptCallAnalysis = useRpt_CallAnalysisApi(apiBase);
  const govIDType = useGovIDTypeApi(apiBase);

  //rp
  const useRpt_CpnCampaignSummaryResultApi =
    useRptCpnCampaignSummaryResultApi(apiBase);
  const useRpt_CpnCampaignSummaryCampaignStatusApi =
    useRptCpnCampaignSummaryCampaignStatusApi(apiBase);
  const useRpt_TicketTypeSynthesisApi = useRptTicketTypeSynthesisApi(apiBase);
  const use_RptETTicketVolatilityApi = useRptETTicketVolatilityApi(apiBase);
  const use_RptETTicketProcessingOverdueByAgentApi =
    useRptETTicketProcessingOverdueByAgentApi(apiBase);
  const use_RptETTicketProcessingOverdueApi =
    useRptETTicketProcessingOverdueApi(apiBase);

  const useMstEstablishRemindETicket = useMst_EstablishRemindETicket(apiBase);
  return {
    ...useMstEstablishRemindETicket, //Notify
    ...govIDType,
    ...kb_Category,
    ...mst_Channel,
    ...KB_Post,
    ...useMstTicketColumnConfigApi,
    ...useMstSubmissionForm,
    ...rptMissedCallsApi,
    ...serviceImprovement,
    ...SvImpAudioAnalysis,
    ...rptCallAnalysis,
    // ...mst_BizColumn,
    ...rptSLAControllerApi,
    ...rptETTicketDetailController,
    ...rptETTicketSynthesisControllerApi,
    ...mst_ContentApi,
    ...rpt_CpnCampaignResultCtmFeedbackApi,
    ...fileApi,
    ...rpt_CpnCampaignStatisticCallApi,
    ...rpt_CpnCampaignResultCallApi,
    ...useCpnCampaign,
    ...cpnCampaignAgentApi,
    ...mstCampaignTypeApi,
    ...mstPaymentTermControllerApi,
    ...mstCustomerGroupApi,
    ...sysAccessApi,
    ...mstNNTControllerApi,
    ...sysGroupControllerApi,
    ...sys_UserApi,
    ...useMstCususeMstCampaignColumnConfigtomer,
    ...mstDepartmentControlApi,
    ...useMstCustomer,
    ...mstCarModelApi,
    ...useDealer,
    ...provinceApis,
    ...mstDealerType,
    ...mstAreaApi,
    ...getCurrentUserApis,
    ...mdMetaColGroupSpecApi,
    ...mdMetaColGroupApi,
    ...metaColColumn,
    ...customFieldApi,
    ...mstCustomerHist,
    ...utilApi,
    // eticket
    ...useMst_TicketEstablishInfo,
    ...mstSLAApi,
    ...useETicket,
    ...mstEticketType,
    ...mstEticketPriority,
    ...mstEticketCustomType,
    ...mstEticketSource,
    ...mstReceptionChannel,
    ...mstCustomerContact,
    ...mstEticketStatus,
    ...useMstTicketPriority,
    ...mstCustomerCampaign,
    ...mstCustomerEticket,
    ...zaloApi,
    ...mstCustomerType,
    ...callcallApi,
    ...notificationApi,
    ...mstPartnerTypeApi,
    ...seqApi,
    ...cpnCampaignCustomerApi,
    ...mstCountryApi,
    //rp
    ...useRpt_CpnCampaignSummaryResultApi,
    ...useRpt_CpnCampaignSummaryCampaignStatusApi,
    ...useRpt_TicketTypeSynthesisApi,
    ...use_RptETTicketVolatilityApi,
    ...use_RptETTicketProcessingOverdueByAgentApi,
    ...use_RptETTicketProcessingOverdueApi,
  };
};

export const useClientgateApi = () => {
  const {
    auth: { currentUser, networkId, orgData, clientGateUrl },
  } = useAuth();
  return createClientGateApi(
    currentUser!,
    clientGateUrl!,
    networkId,
    orgData?.Id!
  );
};
