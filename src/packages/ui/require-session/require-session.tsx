import { PermissionProvider } from "@/packages/contexts/permission";
import { useAuth } from "@packages/contexts/auth";
import { useAuthService } from "@packages/services/auth-services";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export const RequireSession = () => {
  const { loginIgoss, signOut } = useAuthService();
  const {
    auth: { networkId, currentUser, createDTime },
  } = useAuth();

  useEffect(() => {
    // get user information
    (async function () {
      if (!createDTime) {
        signOut();
      } else if (!currentUser) {
        await loginIgoss(networkId);
      } else {
        const dateOffset = 12 * 60 * 60 * 1000; //12h
        let latestDate = new Date();
        latestDate.setTime(latestDate.getTime() - dateOffset);
        let ssDate = createDTime
          ? new Date(createDTime)
          : new Date("2000-01-01");
        if (ssDate < latestDate) {
          signOut();
        }
      }
    })();
  }, [networkId]);
  if (currentUser) {
    return (
      <PermissionProvider>
        <Outlet />
      </PermissionProvider>
    );
  }
  return null;
};
