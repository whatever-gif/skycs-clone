import { AuthState } from "@/types";
import { createClientGateApi } from "@packages/api";
import { atomsWithQueryAsync, atomWithLocalStorage } from "./utils";
const emptyState: AuthState = {
  token: localStorage.getItem("token") || undefined,
  networkId: localStorage.getItem("networkId") || "0",
  clientGateUrl: localStorage.getItem("clientGateUrl") || undefined,
  currentUser: undefined,
  clientGate: undefined,
  permissions: undefined,
};
export const authAtom = atomWithLocalStorage<AuthState>("auth", emptyState);

const [permissionAtom] = atomsWithQueryAsync(async (get) => {
  const auth = await get(authAtom);
  return {
    queryKey: ["permissions", auth?.currentUser?.Id],
    queryFn: async ({}) => {
      // const auth = get(authAtom);
      //console.log("auth:", auth);
      if (auth) {
        const { currentUser, networkId, orgData, clientGateUrl } = auth;
        if (!currentUser) {
          return {};
        }
        const api = createClientGateApi(
          currentUser!,
          clientGateUrl!,
          networkId,
          orgData?.Id!
        );
        //console.log("api ", api);
        const res = await api.GetForCurrentUser();
        if (res.isSuccess) {
          // parsing permission data
          const grantedMenu = res.Data?.Lst_Sys_Access.filter(
            (item) =>
              item.so_FlagActive === "1" && item.so_ObjectType === "MENU"
          ).map((item) => item.so_ObjectCode);
          const grantedButtons = res.Data?.Lst_Sys_Access.filter(
            (item) =>
              item.so_FlagActive === "1" && item.so_ObjectType === "BUTTON"
          ).map((item) => item.so_ObjectCode);
          return {
            menu: grantedMenu,
            buttons: grantedButtons,
          };
        } else {
          return {};
        }
      }
      return {};
    },
    networkMode: "offlineFirst",
    keepPreviousData: false,
  };
});

export { permissionAtom };
