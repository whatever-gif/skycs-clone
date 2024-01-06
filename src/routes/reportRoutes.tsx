import { AdminPage } from "@/pages";
import Tab_Call from "@/pages/reports/CallSummary/Rpt_Call/components/Tabs_RptCall/Tab_Call/Tab_Call";
import { Tab_CallHistory } from "@/pages/reports/CallSummary/Rpt_Call/components/Tabs_RptCall/Tab_CallHistory/Tab_CallHistory";
import { Tab_CallHistoryToAgent } from "@/pages/reports/CallSummary/Rpt_Call/components/Tabs_RptCall/Tab_CallHistoryToAgent/Tab_CallHistoryToAgent";
import RptCpnCampaignSummaryCampaignStatusController from "@/pages/reports/RptCpnCampaignSummaryCampaignStatusController/RptCpnCampaignSummaryCampaignStatusController";
import RptCpnCampaignSummaryResult from "@/pages/reports/RptCpnCampaignSummaryResult/RptCpnCampaignSummaryResult";
import RptETTicketProcessingOverdue from "@/pages/reports/RptETTicketProcessingOverdue/RptETTicketProcessingOverdue";
import RptETTicketVolatility from "@/pages/reports/RptETTicketVolatility/RptETTicketVolatility";
import RptTicketTypeSynthesis from "@/pages/reports/RptTicketTypeSynthesis/RptTicketTypeSynthesis";
import { Rpt_CpnCampaignResultCallPage } from "@/pages/reports/Rpt_CpnCampaignResultCall/list/Rpt_CpnCampaignResultCall";
import { RptCpnCampaignResultCtmFeedbackPage } from "@/pages/reports/Rpt_CpnCampaignResultCtmFeedback/list/RptCpnCampaignResultCtmFeedback";
import { Rpt_CpnCampaignStatisticCallPage } from "@/pages/reports/Rpt_CpnCampaignStatisticCall/list/Rpt_CpnCampaignStatisticCall";
import { Rpt_ETTicketDetailControllerPage } from "@/pages/reports/Rpt_ETTicketDetailController/list/Rpt_ETTicketDetailController";
import Rpt_ETTicketProcessingOverdueByAgent from "@/pages/reports/Rpt_ETTicketProcessingOverdueByAgent/Rpt_ETTicketProcessingOverdueByAgent";
import { Rpt_ETTicketSynthesisControllerPage } from "@/pages/reports/Rpt_ETTicketSynthesisController/list/Rpt_ETTicketSynthesisController";
import { Rpt_MissedCallsPage } from "@/pages/reports/Rpt_MissedCalls/list/Rpt_MissedCalls";
import { Rpt_SLAControllerPage } from "@/pages/reports/Rpt_SLAController/list/Rpt_SLAController";
import { RouteItem } from "@/types";

export const reportRoutes: RouteItem[] = [
  {
    key: "report",
    path: "report",
    permissionCode: "MNU_REPORT",
    mainMenuTitle: "report",
    mainMenuKey: "report",
    getPageElement: () => <AdminPage />,
  },
  // {
  //   key: "Report_CallPage", // lịch sử cuộc gọi
  //   path: "report/Report_CallPage",
  //   permissionCode: "MNU_RPTCALL",
  //   subMenuTitle: "Report_CallPage",
  //   mainMenuKey: "report",
  //   getPageElement: () => <Report_CallPage />,
  // },
  // {
  //   key: "baocaocuocgoi",
  //   path: "report/baocaocuocgoi",
  //   permissionCode: "",
  //   subMenuTitle: "baocaocuocgoi",
  //   mainMenuKey: "report",
  //   getPageElement: () => <Rpt_CallPage />,
  // },
  {
    key: "Rpt_Call",
    path: "",
    permissionCode: "MNU_MENURPTCALL",
    subMenuTitle: "Báo cáo cuộc gọi",
    mainMenuKey: "report",
    children: [
      {
        key: "Rpt_Call",
        path: "report/Rpt_Call",
        permissionCode: "MNU_RPTCALL",
        subMenuTitle: "Rpt_Call",
        mainMenuKey: "report",
        getPageElement: () => <Tab_Call />,
      },
      {
        key: "Rpt_CallHistory",
        path: "report/Rpt_CallHistory",
        permissionCode: "MNU_RPTCALL_HISTORY",
        subMenuTitle: "Rpt_CallHistory",
        mainMenuKey: "report",
        getPageElement: () => <Tab_CallHistory />,
      },
      {
        key: "Rpt_CallHistoryToAgent",
        path: "report/Rpt_CallHistoryToAgent",
        permissionCode: "MNU_RPTCALL_HISTORY_AGENT",
        subMenuTitle: "Rpt_CallHistoryToAgent",
        mainMenuKey: "report",
        getPageElement: () => <Tab_CallHistoryToAgent />,
      },
    ],
  },
  {
    key: "Rpt_CpnCampaign",
    path: "",
    permissionCode: "MNU_REPORT_CAMPAIGN",
    subMenuTitle: "Báo cáo chiến dịch",
    mainMenuKey: "report",
    children: [
      {
        key: "Rpt_CpnCampaignResultCall",
        path: "report/Rpt_CpnCampaignResultCall",
        permissionCode: "MNU_RPT_CPNCAMPAIGN_RESULT_CALL",
        subMenuTitle: "Rpt_CpnCampaignResultCall",
        mainMenuKey: "report",
        getPageElement: () => <Rpt_CpnCampaignResultCallPage />,
      },
      {
        key: "Rpt_CpnCampaignStatisticCall",
        path: "report/RptCpnCampaignStatisticCall",
        permissionCode: "MNU_RPT_CPNCAMPAIGN_STATISTIC_CALL",
        subMenuTitle: "Rpt_CpnCampaignStatisticCall",
        mainMenuKey: "report",
        getPageElement: () => <Rpt_CpnCampaignStatisticCallPage />,
      },
      {
        key: "RptCpnCampaignResultCtmFeedback",
        path: "report/RptCpnCampaignResultCtmFeedback",
        permissionCode: "MNU_RPT_CPNCAMPAIGN_RESULT_CTM_FEEDBACK",
        subMenuTitle: "RptCpnCampaignResultCtmFeedback",
        mainMenuKey: "report",
        getPageElement: () => <RptCpnCampaignResultCtmFeedbackPage />,
      },
      // TA
      // chị thuận
      {
        key: "RptCpnCampaignSummaryResult", // báo cáo tổng hợp kết quả chiến dịch
        path: "report/RptCpnCampaignSummaryResult",
        permissionCode: "MNU_RPT_CPNCAMPAIGN_SUMMARY_RESULT",
        subMenuTitle: "RptCpnCampaignSummaryResult",
        mainMenuKey: "report",
        getPageElement: () => <RptCpnCampaignSummaryResult />,
      },
      {
        key: "RptCpnCampaignSummaryCampaignStatusController", // báo cáo tổng hợp tình hình thực hiện chiến dịch
        path: "report/RptCpnCampaignSummaryCampaignStatusController",
        permissionCode: "MNU_RPT_CPNCAMPAIGN_SUMMARY_STATUS_CONTROLLER",
        subMenuTitle: "RptCpnCampaignSummaryCampaignStatusController",
        mainMenuKey: "report",
        getPageElement: () => <RptCpnCampaignSummaryCampaignStatusController />,
      },
    ],
  },
  {
    key: "Rpt_ETTicketDetailControllerGroup",
    path: "",
    permissionCode: "MNU_RPT_ETICKETCONTROL",
    subMenuTitle: "Report ETicket",
    mainMenuKey: "report",
    children: [
      {
        key: "RptETTicketSynthesis",
        path: "report/RptETTicketSynthesis",
        permissionCode: "MNU_RPT_SYNTHETICETICKET",
        subMenuTitle: "RptETTicketSynthesis",
        mainMenuKey: "report",
        getPageElement: () => <Rpt_ETTicketSynthesisControllerPage />,
      },
      {
        key: "Rpt_ETTicketDetailController",
        path: "report/Rpt_ETTicketDetailController",
        permissionCode: "MNU_RPT_DTLETICKET",
        subMenuTitle: "Rpt_ETTicketDetailController",
        mainMenuKey: "report",
        getPageElement: () => <Rpt_ETTicketDetailControllerPage />,
      },
      {
        key: "Rpt_SLAController",
        path: "report/Rpt_SLAController",
        permissionCode: "MNU_RPT_SLA",
        subMenuTitle: "Rpt_SLAController",
        mainMenuKey: "report",
        getPageElement: () => <Rpt_SLAControllerPage />,
      },
      {
        key: "Rpt_MissedCalls",
        path: "report/Rpt_MissedCalls",
        permissionCode: "MNU_RPT_CUOC_GOI_NHO",
        subMenuTitle: "Rpt_MissedCalls",
        mainMenuKey: "report",
        getPageElement: () => <Rpt_MissedCallsPage />,
      },
      // anh Khang
      {
        key: "RptTicketTypeSynthesis", // báo cáo tổng hợp loại eticket
        path: "report/RptTicketTypeSynthesis",
        permissionCode: "MNU_RPT_TONG_HOP_LOAI_ETICKET",
        subMenuTitle: "RptTicketTypeSynthesis",
        mainMenuKey: "report",
        getPageElement: () => <RptTicketTypeSynthesis />,
      },
      {
        key: "RptETTicketVolatility", // báo cáo biến động eticket
        path: "report/RptETTicketVolatility",
        permissionCode: "MNU_RPT_BIEN_DONG_ETICKET",
        subMenuTitle: "RptETTicketVolatility",
        mainMenuKey: "report",
        getPageElement: () => <RptETTicketVolatility />,
      },
      // báo cáo thống hợp eticket quá hạn
      {
        key: "RptETTicketProcessingOverdueByAgent", // báo cáo tổng hợp eticket quá hạn xử lý theo agent
        path: "report/RptETTicketProcessingOverdueByAgent",
        permissionCode: "MNU_RPT_TONG_HOP_ETICKET_QUA_HAN_XU_LY_THEO_AGENT",
        subMenuTitle: "RptETTicketProcessingOverdueByAgent",
        mainMenuKey: "report",
        getPageElement: () => <Rpt_ETTicketProcessingOverdueByAgent />,
      },
      {
        key: "RptETTicketProcessingOverdue", // báo cáo tổng hợp eticket quá hạn xử lý
        path: "report/RptETTicketProcessingOverdue",
        permissionCode: "MNU_RPT_TONG_HOP_ETICKET_QUA_HAN_XU_LY",
        subMenuTitle: "RptETTicketProcessingOverdue",
        mainMenuKey: "report",
        getPageElement: () => <RptETTicketProcessingOverdue />,
      },
    ],
  },
];
