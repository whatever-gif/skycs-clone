import { permissionAtom } from "@packages/store";
import { useAtomValue } from "jotai";
import React, { createContext, useContext } from "react";

interface PermissionContextProps {
  hasMenuPermission: (code: string) => boolean;
  hasButtonPermission: (code: string) => boolean;
  isLoaded: boolean;
}
const PermissionContext = createContext({} as PermissionContextProps);
export const usePermissions = () => useContext(PermissionContext);

export function PermissionProvider(props: React.PropsWithChildren<unknown>) {
  const permissionStore = useAtomValue(permissionAtom);
  const hasMenuPermission = (code: string) => {
    // return true;
    // return permissionStore.menu?.includes(code) ?? true;
    return permissionStore.menu?.includes(code) ?? false;
  };
  const hasButtonPermission = (code: string) => {
    // return true;
    // return permissionStore.buttons?.includes(code) ?? true;
    return permissionStore.buttons?.includes(code) ?? false;
  };
  return (
    <PermissionContext.Provider
      value={{
        hasMenuPermission,
        hasButtonPermission,
        isLoaded: !!permissionStore.menu,
      }}
      {...props}
    />
  );
}
