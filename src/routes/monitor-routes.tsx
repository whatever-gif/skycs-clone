import MonitorPage from "@/pages/monitor/monitor-page";

import { RouteItem } from "@/types";

export const monitorRoutes: RouteItem[] = [
  {
    key: "monitor",
    path: "monitor",
    mainMenuTitle: "Monitor",
    mainMenuKey: "monitor",
    permissionCode: "MNU_GIAMSAT",
    getPageElement: () => <MonitorPage />,
  },
];
