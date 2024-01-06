import { Mst_CustomerList } from "@/pages/Mst_Customer";
import CustomerEditPage from "@/pages/Mst_Customer/page/CustomerEditPage/CustomerEditPage";
import { CustomerPrimaryPage } from "@/pages/Mst_Customer/page/CustomerPrimaryPage/CustomerPrimaryPage";
import CustomerEditPageDemo from "@/pages/Mst_Customer/page/demo/CustomerEditPageDemo";
import { RouteItem } from "@/types";

export const customerRoutes: RouteItem[] = [
  {
    key: "customer",
    path: "customer",
    mainMenuTitle: "customer",
    mainMenuKey: "customer",
    permissionCode: "MNU_CUSTOMER",
    getPageElement: () => <Mst_CustomerList />,
  },
  {
    key: "Mst_Customer",
    path: "customer/list",
    subMenuTitle: "",
    mainMenuKey: "customer",
    permissionCode: "MNU_CUSTOMER_LIST",
    getPageElement: () => <Mst_CustomerList />,
  },
  {
    key: "Mst_Customer",
    path: "customer/detail/:CustomerCodeSys",
    subMenuTitle: "",
    mainMenuKey: "customer",
    permissionCode: "MNU_CUSTOMER_DTLCUSTOM",
    getPageElement: () => <CustomerPrimaryPage />,
  },
  // {
  //   key: "Mst_Customer",
  //   path: "customer/edit/:CustomerCodeSys",
  //   subMenuTitle: "",
  //   mainMenuKey: "customer",
  //   permissionCode: "MNU_CUSTOMER_EDITCUSTOM",
  //   getPageElement: () => <CustomerEditPage />,
  // },
  {
    key: "Mst_Customer",
    path: "customer/:type/:CustomerCodeSys?/:nav?",
    subMenuTitle: "",
    mainMenuKey: "customer",
    permissionCode: "MNU_CUSTOMER_CREATECUSTOM",
    getPageElement: () => <CustomerEditPage />,
  },
  {
    key: "Mst_Customer",
    path: "demo/:type/:CustomerCodeSys?/:nav?",
    subMenuTitle: "",
    mainMenuKey: "customer",
    permissionCode: "MNU_CUSTOMER_CREATECUSTOM",
    getPageElement: () => <CustomerEditPageDemo />,
  },
  {
    key: "Mst_Customer",
    path: "customer/:type/:CustomerName?/:CustomerEmail?/:CustomerAddress?/:RepresentPosition?/:CustomerCodeSysERP?",
    subMenuTitle: "",
    mainMenuKey: "customer",
    permissionCode: "MNU_CUSTOMER_CREATECUSTOM",
    getPageElement: () => <CustomerEditPage />,
  },
];
