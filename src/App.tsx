import { noSidebarRoutes, protectedRoutes } from "@/app-routes";
import { AdminPageLayout } from "@/layouts";
import { LoginSsoPage, Page404, SelectNetworkPage, TestPage } from "@/pages";
import { HomePage } from "@/pages/home-page";
import { localeAtom } from "@packages/store/localization-store";
import { PrivateRoutes } from "@packages/ui/private-routes";
import { RequireSession } from "@packages/ui/require-session";
import "devextreme/dist/css/dx.common.css";
import { useAtom, useAtomValue } from "jotai";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./dx-styles.scss";
import { AdminDashboardPage } from "./pages/admin-dashboard";
import "./themes/generated/theme.additional.css";
import "./themes/generated/theme.base.css";
import { Disconnected } from "./pages/home-page/disconnected";
import { ZaloLoginCallback } from "./pages/home-page/zalo-login-callback";
import { permissionAtom } from "@packages/store";
import { useEffect } from "react";

export default function Root() {
  // to trigger localization service
  const [value] = useAtom(localeAtom);
  const permissionStore = useAtomValue(permissionAtom);

  return (
    <Router>
      <Routes>
        <Route path={""} element={<PrivateRoutes />}>
          <Route path={""} element={<RequireSession />}>
            <Route path={"/"} element={<HomePage />} />
            <Route path={"/disconnected"} element={<Disconnected />} />
            <Route
              path={"/zalo-login-callback"}
              element={<ZaloLoginCallback />}
            />
            <Route path={"/:networkId"} element={<AdminPageLayout />}>
              <Route path={"testPage"} element={<TestPage />}></Route>
              {protectedRoutes
                .filter((route) => route.key === route.mainMenuKey)
                .map((route) => {
                  return (
                    <Route
                      key={route.key}
                      path={`${route.path}`}
                      element={
                        route.permissionCode === "" ||
                        permissionStore.menu?.includes(
                          route.permissionCode!
                        ) ? (
                          route.getPageElement?.()
                        ) : (
                          <RequireSession />
                        )
                      }
                    >
                      {route.children &&
                        route.children.length > 0 &&
                        route.children.map((child) => {
                          return (
                            <Route
                              key={child.key}
                              path={`${child.path}`}
                              element={
                                child.permissionCode === "" ||
                                permissionStore.menu?.includes(
                                  child.permissionCode!
                                ) ? (
                                  child.getPageElement?.()
                                ) : (
                                  <RequireSession />
                                )
                              }
                            />
                          );
                        })}
                    </Route>
                  );
                })}
              {protectedRoutes
                .filter((route) => route.key !== route.mainMenuKey)
                .map((route) => {
                  return (
                    <Route
                      key={route.key}
                      path={`${route.path}`}
                      element={
                        route.permissionCode === "" ||
                        permissionStore.menu?.includes(
                          route.permissionCode!
                        ) ? (
                          route.getPageElement?.()
                        ) : (
                          <RequireSession />
                        )
                      }
                    >
                      {route.children &&
                        route.children.length > 0 &&
                        route.children
                          .filter((route) => route.key !== route.mainMenuKey)
                          .map((child) => {
                            return (
                              <Route
                                key={child.key}
                                path={`${child.path}`}
                                element={
                                  child.permissionCode === "" ||
                                  permissionStore.menu?.includes(
                                    child.permissionCode!
                                  ) ? (
                                    child.getPageElement?.()
                                  ) : (
                                    <RequireSession />
                                  )
                                }
                              />
                            );
                          })}
                    </Route>
                  );
                })}
            </Route>
          </Route>
        </Route>
        <Route path={"//login"} element={<LoginSsoPage />}></Route>
        <Route path={"/login"} element={<LoginSsoPage />}></Route>
        <Route path={"/select-network"} element={<SelectNetworkPage />}></Route>
        <Route path={"*"} element={<Page404 />} />
      </Routes>
    </Router>
  );
}
