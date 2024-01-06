import { AdminPage, EticketDetailPageFollow } from "@/pages";
import EticketAddDemo from "@/pages/eticket/add-demo/EticketAddDemo";
import EticketDetailPage from "@/pages/eticket/eticket/Components/Info/Detail/eticket-detail-page";
import Eticket from "@/pages/eticket/eticket/eticket";

import { RouteItem } from "@/types";

export const eticketRoutes: RouteItem[] = [
  {
    key: "eticket_Main",
    path: "eticket",
    mainMenuTitle: "eticket",
    mainMenuKey: "eticket",
    permissionCode: "MNU_ETICKET",
    getPageElement: () => <AdminPage />,
  },
  {
    key: "Detail",
    path: "eticket/DetailFollow",
    // subMenuTitle: "eticket_deta",
    permissionCode: "",
    mainMenuKey: "eticket",
    getPageElement: () => <EticketDetailPageFollow />,
  },
  {
    key: "eticket_manager",
    path: "eticket/eticket_manager",
    permissionCode: "MNU_ETICKET",
    mainMenuKey: "eticket_manager",
    getPageElement: () => <Eticket />,
  },
  {
    key: "eticket_Detail",
    path: "eticket/detail/:TicketID",
    mainMenuTitle: "eticket",
    mainMenuKey: "eticket",
    permissionCode: "MNU_ETICKET_DTLETICKET",
    getPageElement: () => <EticketDetailPage />,
  }, 
  {
    key: "eticket_Detail_Page",
    path: "eticket/detail",
    mainMenuTitle: "eticket",
    mainMenuKey: "eticket",
    permissionCode: "",
    getPageElement: () => <EticketDetailPage />,
  },
  {
    key: "eticket_add",
    path: "eticket/Add",
    permissionCode: "MNU_ETICKET_CREATETICKET",
    mainMenuKey: "eticket",
    getPageElement: () => <EticketAddDemo />,
  },
  {
    key: "eticket_add",
    path: "eticket/edit/:TicketID",
    // subMenuTitle: "eticket_add",
    permissionCode: "MNU_ETICKET_EDITETICKET",
    mainMenuKey: "eticket",
    getPageElement: () => <EticketAddDemo />,
  },
  // {
  //   key: "eticket_add",
  //   path: "eticket/add-demo",
  //   // subMenuTitle: "eticket_add",
  //   permissionCode: "MNU_ETICKET_EDITETICKET",
  //   mainMenuKey: "eticket",
  //   getPageElement: () => <EticketAddDemo />,
  // },
  // {
  //   key: "eticket_add",
  //   path: "eticket/add-demo/:TicketID",
  //   // subMenuTitle: "eticket_add",
  //   permissionCode: "MNU_ETICKET_EDITETICKET",
  //   mainMenuKey: "eticket",
  //   getPageElement: () => <EticketAddDemo />,
  // },
];
