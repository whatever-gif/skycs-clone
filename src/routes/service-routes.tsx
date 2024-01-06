import { AdminPage } from "@/pages";
import { ServiceImprovementManager } from "@/pages/service/ServiceImprovement/list/ServiceImprovementManager";
import ServiceImprovementPage from "@/pages/service/ServiceImprovement/pages/ServiceImprovementPage";
import { SvImpAudioAnalysisManager } from "@/pages/service/SvImpAudioAnalysis/list/SvImpAudioAnalysisManager";
import SvImpAudioAnalysisPage from "@/pages/service/SvImpAudioAnalysis/page/SvImpAudioAnalysisPage";
import RptCallAnalysisBySoundValueFreq from "@/pages/service/report/RptAnalysisBySoundValueFreq/RptCallAnalysisBySoundValueFreq";
import RptCallAnalysisByCallTime from "@/pages/service/report/RptCallAnalysisByCallTime/RptCallAnalysisByCallTime";
import RptCallAnalysisByContent from "@/pages/service/report/RptCallAnalysisByContent/RptCallAnalysisByContent";
import RptCallAnalysisBySoundValueVolume from "@/pages/service/report/RptCallAnalysisBySoundValueVolume/RptCallAnalysisBySoundValueVolume";
import RptCallAnalysisByTalkTime from "@/pages/service/report/RptCallAnalysisByTalkTime/RptCallAnalysisByTalkTime";
import RptCallAnalysisByWaitTime from "@/pages/service/report/RptCallAnalysisByWaitTime/RptCallAnalysisByWaitTime";

import { RouteItem } from "@/types";

export const serviceRoutes: RouteItem[] = [
  {
    key: "service",
    path: "service",
    mainMenuTitle: "service",
    mainMenuKey: "service",
    permissionCode: "MENU_HIDDEN",
    getPageElement: () => <AdminPage />,
  },
  {
    key: "ServiceImprovement",
    path: "service/ServiceImprovement",
    subMenuTitle: "ServiceImprovement_Manage",
    mainMenuKey: "service",
    permissionCode: "MNU_BO_TIEU_CHI_PHAN_TICH",
    getPageElement: () => <ServiceImprovementManager />,
  },
  {
    key: "ServiceImprovement",
    path: "service/ServiceImprovement/Add/",
    subMenuKey: "service",
    mainMenuKey: "service",
    permissionCode: "MNU_THEM_MOI_BO_TIEU_CHI_PHAN_TICH_CHAT_LUONG_DICH_VU",
    getPageElement: () => <ServiceImprovementPage />,
  },
  {
    key: "ServiceImprovement",
    path: "service/ServiceImprovement/:flag/:SvImprvCodeSys",
    subMenuKey: "service",
    mainMenuKey: "service",
    permissionCode: "MNU_THEM_MOI_BO_TIEU_CHI_PHAN_TICH_CHAT_LUONG_DICH_VU",
    getPageElement: () => <ServiceImprovementPage />,
  },
  {
    key: "ServiceImprovement",
    path: "service/ServiceImprovement/:SvImprvCodeSys",
    mainMenuKey: "service",
    subMenuKey: "service",
    permissionCode: "MNU_CHI_TIET_BO_TIEU_CHI_PHAN_TICH_CHAT_LUONG_DICH_VU",
    getPageElement: () => <ServiceImprovementPage />,
  },
  {
    key: "SvImpAudioAnalysis",
    path: "service/SvImpAudioAnalysis",
    subMenuTitle: "SvImpAudioAnalysis_Manage",
    mainMenuKey: "service",
    permissionCode: "MNU_AI_CHUYEN_DOI",
    getPageElement: () => <SvImpAudioAnalysisManager />,
  },
  {
    key: "SvImpAudioAnalysis",
    path: "service/SvImpAudioAnalysis/Add",
    mainMenuKey: "service",
    permissionCode: "MNU_THEM_MOI_LAN_SU_DUNG_AI_PHAN_TICH_AM_THANH",
    getPageElement: () => <SvImpAudioAnalysisPage />,
  },
  {
    key: "SvImpAudioAnalysis",
    path: "service/SvImpAudioAnalysis/:code",
    mainMenuKey: "service",
    permissionCode: "MNU_CHI_TIET_LAN_SU_DUNG_AI_PHAN_TICH_AM_THANH",
    getPageElement: () => <SvImpAudioAnalysisPage />,
  },
  {
    key: "RptCallAnalysis",
    path: "",
    permissionCode: "MNU_RPT_PHAN_TICH",
    subMenuTitle: "RptCallAnalysis",
    mainMenuKey: "service",
    children: [
      {
        key: "RptCallAnalysis", // báo phân tích thời gian chờ
        path: "service/RptCallAnalysisByWaitTime",
        subMenuTitle: "RptCallAnalysisByWaitTime",
        mainMenuKey: "service",
        permissionCode: "MNU_RPT_PHAN_TICH_THOI_GIAN_CHO",
        getPageElement: () => <RptCallAnalysisByWaitTime />,
      },
      {
        key: "RptCallAnalysis", // báo cáo phân tích thời lượng cuộc gọi
        path: "service/RptCallAnalysisByCallTime",
        subMenuTitle: "RptCallAnalysisByCallTime",
        mainMenuKey: "service",
        permissionCode: "MNU_RPT_PHAN_TICH_THOI_LUONG_CUOC_GOI",
        getPageElement: () => <RptCallAnalysisByCallTime />,
      },
      {
        key: "RptCallAnalysis", // báo cáo phân tích thời gian đàm thoại
        path: "service/RptCallAnalysisByTalkTime",
        subMenuTitle: "RptCallAnalysisByTalkTime",
        mainMenuKey: "service",
        permissionCode: "MNU_RPT_PHAN_TICH_THOI_GIAN_DAM_THOAI",
        getPageElement: () => <RptCallAnalysisByTalkTime />,
      },
      {
        key: "RptCallAnalysis", // báo cáo phân tích nội dung cuộc gọi
        path: "service/RptCallAnalysisByContent",
        subMenuTitle: "RptCallAnalysisByContent",
        mainMenuKey: "service",
        permissionCode: "MNU_RPT_PHAN_TICH_NOI_DUNG_CUOC_GOI",
        getPageElement: () => <RptCallAnalysisByContent />,
      },
      {
        key: "RptCallAnalysis", // Báp cáo phân tích tần số Hz
        path: "service/RptCallAnalysisBySoundValueFreq",
        subMenuTitle: "RptCallAnalysisBySoundValueFreq",
        mainMenuKey: "service",
        permissionCode: "MNU_RPT_PHAN_TICH_TAN_SO_(HZ)",
        getPageElement: () => <RptCallAnalysisBySoundValueFreq />,
      },
      {
        key: "RptCallAnalysis", // báo cáo phân tích âm lượng DB
        path: "service/RptCallAnalysisBySoundValueVolume",
        subMenuTitle: "RptCallAnalysisBySoundValueVolume",
        mainMenuKey: "service",
        permissionCode: "MNU_RPT_PHAN_TICH_AM_LUONG_(DB)",
        getPageElement: () => <RptCallAnalysisBySoundValueVolume />,
      },
    ],
  },
];
