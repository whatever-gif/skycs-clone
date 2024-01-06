import { AdminPage } from "@/pages";
import { Cpn_CampaignAgentPage } from "@/pages/Cpn_CampaignAgent/list/Cpn_CampaignAgent";
import { Cpn_CampaignPage } from "@/pages/admin/Cpn_Campaign";
import Cpn_Campaign_Info from "@/pages/admin/Cpn_Campaign/components/Components/Cpn_Campaign_Info";

import { Cpn_CampaignPerformPage } from "@/pages/Campaign_Perform/campaign-perform-page";
import { Cpn_CampaignPerformPageTuyenBA } from "@/pages/Campaign_Perform_TuyenBA/campaign-perform-page";
import HandleCampaign from "@/pages/campaign/handle_campaign";
import { RouteItem } from "@/types";

export const campaignRoutes: RouteItem[] = [
  {
    key: "campaign",
    path: "campaign",
    mainMenuTitle: "campaign",
    mainMenuKey: "campaign",
    permissionCode: "MENU_ADMIN_CAMPAIGN",
    getPageElement: () => <AdminPage />,
  },
  {
    key: "Campaign",
    path: "",
    mainMenuTitle: "Campaign",
    mainMenuKey: "campaign",
    subMenuTitle: "Campaign",
    permissionCode: "MNU_CAMPAIGN_CALL",
    children: [
      {
        key: "Cpn_CampaignAgent",
        path: "campaign/Cpn_CampaignAgent",
        subMenuTitle: "Cpn_CampaignAgent",
        mainMenuKey: "campaign",
        permissionCode: "MNU_CAMPAIGN_AGENTMANAGER",
        getPageElement: () => <Cpn_CampaignAgentPage />,
      },
      {
        key: "Cpn_CampaignPage",
        path: "campaign/Cpn_CampaignPage",
        subMenuTitle: "Cpn_CampaignPage",
        mainMenuKey: "campaign",
        permissionCode: "MNU_CAMPAIGN_CAMPAIGNMANAGER",
        getPageElement: () => <Cpn_CampaignPage />,
      },
      {
        key: "Cpn_Campaign_Info",
        path: "campaign/Cpn_CampaignPage/Cpn_Campaign_Info",
        subMenuTitle: "",
        permissionCode: "MNU_CAMPAIGN_CAMPAIGNMANAGER_CREATE",
        mainMenuKey: "campaign",
        getPageElement: () => <Cpn_Campaign_Info />,
      },
      // {
      //   key: "Cpn_Campaign_Info",
      //   path: "campaign/Cpn_CampaignPage/Cpn_Campaign_Info/:CampaignCode",
      //   subMenuTitle: "BTN_ADMIN_CAMPAIGN_ADD",
      //   mainMenuKey: "campaign",
      //   getPageElement: () => <Cpn_Campaign_Info />,
      // },
      {
        key: "Cpn_Campaign_Info",
        path: "campaign/Cpn_CampaignPage/Cpn_Campaign_Info/:flag/:CampaignCode",
        subMenuTitle: "",
        permissionCode: "MNU_CAMPAIGN_CAMPAIGNMANAGER_DETAIL",
        mainMenuKey: "campaign",
        getPageElement: () => <Cpn_Campaign_Info />,
      },
      {
        key: "handleCampaign",
        path: "campaign/handleCampaign",
        // subMenuTitle: "handleCampaign",
        mainMenuKey: "campaign",
        permissionCode: "",
        getPageElement: () => <HandleCampaign />,
      },
      {
        key: "Cpn_CampaignPerform",
        path: "campaign/perform",
        subMenuTitle: "Cpn_CampaignPerform",
        mainMenuKey: "campaign",
        permissionCode: "MNU_CAMPAIGN_CAMPAIGN_PERFORM",
        getPageElement: () => <Cpn_CampaignPerformPage />,
      },
      {
        key: "Cpn_CampaignPerform_TuyenBA",
        path: "campaign/perform_TuyenBA",
        // subMenuTitle: "Cpn_CampaignPerform_TuyenBA",
        mainMenuKey: "campaign",
        permissionCode: "",
        getPageElement: () => <Cpn_CampaignPerformPageTuyenBA />,
      },
    ],
  },
];
