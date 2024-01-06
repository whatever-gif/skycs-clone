import { AdminPage } from "@/pages";
import { Business_InformationPage } from "@/pages/Business_Information/list/Business_Information-page";
import { Category_ManagerPage } from "@/pages/Category_Manager";
import { Department_ControlPage } from "@/pages/Department_Control";
import { Mst_AreaControllerPage } from "@/pages/Mst_AreaController/list/Mst_AreaController";
import { Mst_CustomerGroupPage } from "@/pages/Mst_CustomerGroup/list/Mst_CustomerGroup";
import { Mst_PaymentTermControllerPage } from "@/pages/Mst_PaymentTermController/list/Mst_PaymentTermController";
import Post_add from "@/pages/Post_Manager/components/components/Post_add";
import { Post_ManagerPage } from "@/pages/Post_Manager/list/Post_Manager";

import { Sys_GroupPage } from "@/pages/Sys_Group";
import { UserManangerPage } from "@/pages/User_Mananger/list/User_Mananger-page";
import Cpn_Campaign_Info from "@/pages/admin/Cpn_Campaign/components/Components/Cpn_Campaign_Info";

import { Mst_CampaignColumnConfig_Setting } from "@/pages/admin/Mst_CampaignColumnConfig/Setting/Mst_CampaignColumnConfig";
import { Mst_CampaignTypePage } from "@/pages/admin/Mst_CampaignType";
import Customize from "@/pages/admin/Mst_CampaignType/components/Components/Customize";
import { RouteItem } from "@/types";

import Content_Detail from "@/pages/Content_Managent/components/components/Content_Detail";
import Content_Edit from "@/pages/Content_Managent/components/components/Content_Edit";
import { Content_ManagentPage } from "@/pages/Content_Managent/list/Content_Managent";
import OmiChanelPage from "@/pages/Omi-Chanel/list/Omi_Chanel";
import Post_detail from "@/pages/Post_Manager/components/components/Post_detail";

import Post_Edit from "@/pages/Post_Manager/components/components/Post_Edit";
import { BlackList } from "@/pages/admin/BlackList/list/BlackList";
import ConfigDynamicField from "@/pages/admin/ConfigDynamicField/ConfigDynamicField";
import ConfigLayout from "@/pages/admin/ConfigLayout/ConfigLayout";
// import { ServiceImprovementManager } from "@/pages/admin/ServiceImprovement/list/ServiceImprovementManager";
import MainContainer from "@/pages/MainContainer";
import Notify from "@/pages/admin/Notify";
import { Eticket_Custom_Field_Dynamic } from "@/pages/eticket/Manager_Customer/Customer_DynamicField/list";
import Mst_TicketEstablishInfo_Save from "@/pages/eticket/Mst_TicketEstablishInfo/components/Mst_TicketEstablishInfo_Save";
import SLA_ListDemo from "@/pages/eticket/SLADemo/list/SLA_List";
import SLA_PageDemo from "@/pages/eticket/SLADemo/page/SLA_Page";
import DemoExcel from "@/utils/DemoExcel";
import Tool from "@/utils/Tool";

export const adminRoutes: RouteItem[] = [
  {
    key: "admin",
    path: "admin",
    mainMenuTitle: "admin",
    mainMenuKey: "admin",
    permissionCode: "MENU_ADMIN",
    getPageElement: () => <AdminPage />,
  },
  {
    key: "",
    path: "",
    mainMenuTitle: "",
    mainMenuKey: "",
    permissionCode: "",
    getPageElement: () => <MainContainer />,
  },
  {
    key: "",
    path: "demo",
    mainMenuTitle: "",
    mainMenuKey: "",
    permissionCode: "",
    getPageElement: () => <DemoExcel />,
  },
  {
    key: "",
    path: "tool",
    mainMenuTitle: "",
    mainMenuKey: "",
    permissionCode: "",
    getPageElement: () => <Tool />,
  },

  // {
  //   key: "SLADemoPage",
  //   path: "admin/SLADemoPage/add",
  //   subMenuTitle: "SLADemoPage",
  //   mainMenuKey: "admin",
  //   permissionCode: "MENU_ADMIN_BUSINESS_INFORMATION",
  //   getPageElement: () => <SLA_PageDemo />,
  // },
  {
    key: "Organization_Settings",
    path: "",
    permissionCode: "MNU_ADMIN_ORG",
    subMenuTitle: "Thiết lập doanh nghiệp",
    mainMenuKey: "admin",
    children: [
      {
        key: "Business_Information",
        path: "admin/Business_Information",
        subMenuTitle: "Business_Information",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_ORG_BUSINESS_INFOMATION",
        getPageElement: () => <Business_InformationPage />,
      },
      {
        key: "UserMananger",
        path: "admin/UserMananger",
        subMenuTitle: "UserMananger",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_USERMANAGER",
        getPageElement: () => <UserManangerPage />,
      },
      {
        key: "Department_Control",
        path: "admin/Department_Control",
        subMenuTitle: "Department_Control",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_DEPARTMENTCONTROL",
        getPageElement: () => <Department_ControlPage />,
      },
      {
        key: "Sys_GroupPage",
        path: "admin/Sys_GroupPage",
        subMenuTitle: "Sys_Group",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_SYSGRP",
        getPageElement: () => <Sys_GroupPage />,
      },
    ],
  },
  {
    key: "Content_Managent",
    path: "admin/Content_Managent",
    subMenuTitle: "Content_Managent",
    mainMenuKey: "admin",
    permissionCode: "MNU_ADMIN_CONTENTTEM",
    getPageElement: () => <Content_ManagentPage />,
  },
  {
    key: "Content_Edit",
    path: "admin/Content_Managent/add",
    subMenuTitle: "",
    mainMenuKey: "admin",
    permissionCode: "MNU_ADMIN_CONTENTTEM_CREATE",
    getPageElement: () => <Content_Edit />,
  },
  {
    key: "Content_Detail",
    path: "admin/Content_Managent/:idContent",
    subMenuTitle: "",
    mainMenuKey: "admin",
    permissionCode: "MNU_ADMIN_CONTENTTEM_UPDATE",
    getPageElement: () => <Content_Detail />,
  },
  //=========================
  {
    key: "OmniChanel",
    path: "admin/OmniChanel",
    subMenuTitle: "Omni Chanel",
    mainMenuKey: "admin",
    permissionCode: "MNU_ADMIN_CAU_HINH_KET_NOI_KENH_TUONG_TAC",
    getPageElement: () => <OmiChanelPage />,
  },
  {
    key: "CallSetting",
    path: "",
    permissionCode: "MENU_ADMIN_CALL_SETTING",
    subMenuTitle: "Call Setting",
    mainMenuKey: "admin",
    children: [
      {
        key: "BlackList",
        path: "admin/BlackList",
        subMenuTitle: "BlackList",
        mainMenuKey: "admin",
        permissionCode: "MENU_ADMIN_BLACKLIST",
        getPageElement: () => <BlackList />,
      },
    ],
  },
  {
    key: "Customer_Settings",
    path: "",
    permissionCode: "MNU_ADMIN_CUSTOMERMANAGER",
    subMenuTitle: "Thiết lập thông tin khách hàng",
    mainMenuKey: "admin",
    children: [
      {
        key: "Mst_AreaController",
        path: "admin/Mst_AreaController",
        subMenuTitle: "Mst_AreaController",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_AREAMANAGER",
        getPageElement: () => <Mst_AreaControllerPage />,
      },
      {
        key: "Mst_PaymentTermController",
        path: "admin/Mst_PaymentTermController",
        subMenuTitle: "Mst_PaymentTermController",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_PAYMENTTERM",
        getPageElement: () => <Mst_PaymentTermControllerPage />,
      },
      {
        key: "Mst_CustomerGroup",
        path: "admin/Mst_CustomerGroup",
        subMenuTitle: "Mst_CustomerGroup",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_CUSTOMGRP",
        getPageElement: () => <Mst_CustomerGroupPage />,
      },
      // {
      //   key: "CustomField",
      //   path: "admin/custom-fields",
      //   subMenuTitle: "CustomField",
      //   mainMenuKey: "admin",
      //   permissionCode: "MNU_ADMIN_CUSTOMFIELD",
      //   getPageElement: () => <CustomFieldListPage />,
      // },
      {
        key: "configDynamicFieldList",
        path: "admin/config-dynamic-field-list",
        subMenuTitle: "Config Dynamic Field",
        mainMenuKey: "admin",
        permissionCode: "MNU_CONFIGDYNAMICFIELD",

        getPageElement: () => <ConfigDynamicField />,
      },
      {
        key: "configLayout",
        path: "admin/config-layout",
        subMenuTitle: "Config Layout",
        mainMenuKey: "admin",
        permissionCode: "MNU_CONFIGLAYOUT",
        getPageElement: () => <ConfigLayout />,
      },
    ],
  },
  {
    key: "eTicket_Settings",
    path: "",
    permissionCode: "MNU_ADMIN_ETICKETMANAGER",
    subMenuTitle: "Thông tin eTicket",
    mainMenuKey: "admin",
    children: [
      {
        key: "eticket_Custom_Field_Dynamic",
        path: "admin/Eticket_Custom_Field_Dynamic",
        subMenuTitle: "admin_Custom_Field_Dynamic",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_ETICKETFIELD_LIST",
        getPageElement: () => <Eticket_Custom_Field_Dynamic />,
      },
      {
        key: "Mst_TicketEstablishInfo_Save",
        path: "admin/Mst_TicketEstablishInfo_Save",
        subMenuTitle: "Mst_TicketEstablishInfo_Save",
        permissionCode: "MNU_ADMIN_INFOETICKET_CONFIG",
        mainMenuKey: "admin",
        getPageElement: () => <Mst_TicketEstablishInfo_Save />,
      },
      // {
      //   key: "SLA",
      //   path: "admin/SLA",
      //   subMenuTitle: "SLA",
      //   mainMenuKey: "admin",
      //   permissionCode: "MNU_ADMIN_SLA_LIST",
      //   getPageElement: () => <SLA_List />,
      // },
      // {
      //   key: "SLA",
      //   path: "admin/SLA-Add",
      //   subMenuTitle: "",
      //   mainMenuKey: "admin",
      //   permissionCode: "MNU_ADMIN_SLA_CREATESLA",
      //   getPageElement: () => <SLA_Page />,
      // },
      // {
      //   key: "SLA",
      //   path: "admin/SLA/:SLAID/:nav?",
      //   subMenuTitle: "",
      //   mainMenuKey: "admin",
      //   permissionCode: "MNU_ADMIN_SLA_DTLSLA",
      //   getPageElement: () => <SLA_Page />,
      // },

      {
        key: "SLADemo",
        path: "admin/SLADemo",
        subMenuTitle: "SLA",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_SLA_LIST",
        getPageElement: () => <SLA_ListDemo />,
      },

      // {
      //   key: "SLADemoPage",
      //   path: "admin/SLADemoPage/add",
      //   subMenuTitle: "",
      //   mainMenuKey: "admin",
      //   permissionCode: "MNU_ADMIN_SLA_CREATESLA",
      //   getPageElement: () => <SLA_PageDemo />,
      // },

      {
        key: "SLADemoPage",
        path: "admin/SLADemoPage/:type?/:SLAID?",
        subMenuTitle: "",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_SLA_DTLSLA",
        getPageElement: () => <SLA_PageDemo />,
      },
    ],
  },
  {
    key: "Campaign Settings",
    path: "",
    mainMenuTitle: "Campaign Settings",
    mainMenuKey: "admin",
    subMenuTitle: "Thiết lập chiến dịch",
    permissionCode: "MNU_ADMIN_CAMPAIGN_CONFIG",
    children: [
      {
        key: "Mst_CampaignColumnConfig_Setting",
        path: "admin/Mst_CampaignColumnConfig_Setting",
        subMenuTitle: "Mst_CampaignColumnConfig_Setting",
        permissionCode: "MNU_ADMIN_CAMPAIGN_COLUMN_CONFIG",
        mainMenuKey: "admin",
        getPageElement: () => <Mst_CampaignColumnConfig_Setting />,
      },
      {
        key: "Mst_CampaignTypePage",
        path: "admin/Mst_CampaignTypePage",
        subMenuTitle: "Mst_CampaignTypePage",
        permissionCode: "MNU_ADMIN_CAMPAIGN_TYPE",
        mainMenuKey: "admin",
        getPageElement: () => <Mst_CampaignTypePage />,
      },
      {
        key: "Mst_CampaignTypePage/Customize",
        path: "admin/Mst_CampaignTypePage/Customize/Add",
        subMenuTitle: "",
        permissionCode: "MNU_ADMIN_CAMPAIGN_TYPE_CREATE",
        mainMenuKey: "admin",
        getPageElement: () => <Customize />,
      },
      {
        key: "Mst_CampaignTypePage/Customize",
        path: "admin/Mst_CampaignTypePage/Customize/:flag/:id",
        permissionCode: "MNU_ADMIN_CAMPAIGN_TYPE_UPDATE",
        subMenuTitle: "",
        mainMenuKey: "admin",
        getPageElement: () => <Customize />,
      },
      {
        key: "Mst_CampaignTypePage/Customize",
        path: "admin/Mst_CampaignTypePage/Customize/:id",
        permissionCode: "MNU_ADMIN_CAMPAIGN_TYPE_DETAIL",
        subMenuTitle: "",
        mainMenuKey: "admin",
        getPageElement: () => <Customize />,
      },
      // {
      //   key: "Cpn_CampaignPage",
      //   path: "campaign/Cpn_CampaignPage",
      //   subMenuTitle: "Cpn_CampaignPage",
      //   mainMenuKey: "admin",
      //   permissionCode: "",
      //   getPageElement: () => <Cpn_CampaignPage />,
      // },
      {
        key: "Cpn_Campaign_Info",
        path: "campaign/Cpn_CampaignPage/Cpn_Campaign_Info",
        subMenuTitle: "",
        mainMenuKey: "admin",
        permissionCode: "",
        getPageElement: () => <Cpn_Campaign_Info />,
      },
    ],
  },
  {
    key: "knowledge_store",
    path: "",
    permissionCode: "MNU_ADMIN_CAMPAIGN_POST",
    subMenuTitle: "Kho tri thức",
    mainMenuKey: "admin",
    children: [
      {
        key: "Post_Manager",
        path: "admin/Post_Manager",
        subMenuTitle: "Post_Manager",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_CAMPAIGN_POSTMANAGER",
        getPageElement: () => <Post_ManagerPage />,
      },
      {
        key: "Post_detail",
        path: "admin/Post_detail/:idPost",
        subMenuTitle: "",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_CAMPAIGN_POSTMANAGER_DETAIL",
        getPageElement: () => <Post_detail />,
      },
      {
        key: "Post_Edit",
        path: "admin/Post_Edit/:idPostEdit",
        subMenuTitle: "",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_CAMPAIGN_POSTMANAGER_UPDATE",
        getPageElement: () => <Post_Edit />,
      },
      {
        key: "Post_Manager",
        path: "admin/Post_Manager/addNew",
        subMenuTitle: "",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_CAMPAIGN_POSTMANAGER_CREATE",
        getPageElement: () => <Post_add />,
      },
      {
        key: "Category_Manager",
        path: "admin/Category_Manager",
        subMenuTitle: "Category_Manager",
        mainMenuKey: "admin",
        permissionCode: "MNU_ADMIN_CAMPAIGN_CATEGORYMANAGER",
        getPageElement: () => <Category_ManagerPage />,
      },
    ],
  },
  {
    key: "Notify",
    path: "admin/Notify",
    subMenuTitle: "Notify",
    mainMenuKey: "admin",
    permissionCode: "MNU_ADMIN_NOTIFY",
    getPageElement: () => <Notify />,
  },

  // {
  //   key: "FormRender",
  //   path: "admin/form-render",
  //   subMenuTitle: "FormRender",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <FormRenderContainer />,
  // },

  // {
  //   key: "Cpn_CampaignAgent",
  //   path: "admin/Cpn_CampaignAgent",
  //   subMenuTitle: "Cpn_CampaignAgent",
  //   mainMenuKey: "admin",
  //   permissionCode: "",
  //   getPageElement: () => <Cpn_CampaignAgentPage />,
  // },
  // {
  //   key: "Mst_CampaignColumnConfig_Setting",
  //   path: "campaign/Mst_CampaignColumnConfig_Setting",
  //   subMenuTitle: "Mst_CampaignColumnConfig_Setting",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <Mst_CampaignColumnConfig_Setting />,
  // },

  // {
  //   key: "testPopup",
  //   path: "admin/testPopup",
  //   subMenuTitle: "testPopup",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <Cpn_Campaign_List_Customer />,
  // },
  // {
  //   key: "testUpload",
  //   path: "admin/testUpload",
  //   subMenuTitle: "testUpload",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <TestUploadPage />,
  // },
  // {
  //   key: "testTabs",
  //   path: "admin/testTabs",
  //   subMenuTitle: "testTabs",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <TestTabsPage />,
  //   children: [
  //     {
  //       key: "testTabsTab2",
  //       path: "tab2",
  //       subMenuTitle: "testTabsTab2",
  //       mainMenuKey: "admin",
  //       getPageElement: () => <Tab2Page />,
  //     },
  //     {
  //       key: "testTabsTab1",
  //       path: "tab1",
  //       subMenuTitle: "testTabsTab1",
  //       mainMenuKey: "admin",
  //       getPageElement: () => <Tab1Page />,
  //     },
  //   ],
  // },
  // {
  //   key: "testGrid",
  //   path: "admin/testGrid",
  //   subMenuTitle: "testGrid",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <TreeLikeGridPage />,
  // },
  // {
  //   key: "testGridSelect",
  //   path: "admin/testGridSelect",
  //   subMenuTitle: "testGridSelect",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <TestGridPage />,
  // },
  // {
  //   key: "testHtmlEditor",
  //   path: "admin/testHtmlEditor",
  //   subMenuTitle: "testHtmlEditor",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <TestFormPage />,
  // },
  // {
  //   key: "zaloconnect",
  //   path: "admin/zaloconnect",
  //   subMenuTitle: "ZaloConnect",
  //   mainMenuKey: "admin",
  //   getPageElement: () => <ZaloConnect />,
  // },
];
