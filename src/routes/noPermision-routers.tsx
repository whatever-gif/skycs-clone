import MonitorPage from "@/pages/monitor/monitor-page";
import NoPermissionPage from "@/pages/noPermission_page/noPermission_page";
import { RouteItem } from "@/types";

export const noPermisionRoutes: RouteItem[] = [
  {
    key: "NoPermission",
    path: "notAuthorized",
    mainMenuTitle: "Monitor",
    mainMenuKey: "NoPermission",
    permissionCode: "",
    getPageElement: () => <NoPermissionPage />,
  },
];
