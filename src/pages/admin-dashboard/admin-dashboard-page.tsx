import { protectedRoutes } from "@/app-routes";
import { logger } from "@/packages/logger";
import { permissionAtom } from "@/packages/store";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const AdminDashboardPage = () => {
  logger.debug("AdminDashboardPage");
  const permissionStore = useAtomValue(permissionAtom);

  return (
    <Navigate
      to={`${
        protectedRoutes
          .filter((route) => route.key === route.mainMenuKey)
          .filter(
            (route) =>
              route.permissionCode === "" ||
              (route.permissionCode &&
                permissionStore.menu?.includes(route.permissionCode))
          )[0]?.path
          ? protectedRoutes
              .filter((route) => route.key === route.mainMenuKey)
              .filter(
                (route) =>
                  route.permissionCode === "" ||
                  (route.permissionCode &&
                    permissionStore.menu?.includes(route.permissionCode))
              )[0]?.path
          : "notAuthorized"
      }`}
    />
  );
};
