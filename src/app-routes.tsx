import { adminRoutes } from "./routes/admin-routes";
import { campaignRoutes } from "./routes/campaign-router";
import { customerRoutes } from "./routes/customer-routes";
import { eticketRoutes } from "./routes/eticket-routes";
import { monitorRoutes } from "./routes/monitor-routes";
import { noPermisionRoutes } from "./routes/noPermision-routers";
import { reportRoutes } from "./routes/reportRoutes";
import { searchRoutes } from "./routes/searchInfor-routes";
import { serviceRoutes } from "./routes/service-routes";
import { RouteItem } from "./types";

export const protectedRoutes: RouteItem[] = [
  ...serviceRoutes,
  ...adminRoutes,
  ...reportRoutes,
  ...eticketRoutes,
  ...customerRoutes,
  ...monitorRoutes,
  ...campaignRoutes,
  ...searchRoutes,
  ...noPermisionRoutes,
];

export const noSidebarRoutes: RouteItem[] = [...customerRoutes];
