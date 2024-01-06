import { authAtom } from "@/packages/store";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
export const useNetworkNavigate = () => {
  const auth = useAtomValue(authAtom);
  const navi = useNavigate();
  const navigate = (str: string) => {
    // console.log("str", str);
    navi(`/${auth.networkId}/${str}`);
  };

  return navigate;
};
