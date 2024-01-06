import { authAtom } from "@/packages/store";
import { useAtomValue } from "jotai";
import { NavLink, useNavigate } from "react-router-dom";
export default function NavNetworkLink({ to, children, ...params }: any) {
  const auth = useAtomValue(authAtom);
  return (
    <NavLink {...params} to={`/${auth.networkId}${to}`}>
      {children}
    </NavLink>
  );
}
