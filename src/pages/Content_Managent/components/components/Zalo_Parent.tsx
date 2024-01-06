import { useAtomValue } from "jotai";
import Zalo_Zns from "./Zalo/Zalo_Zns";
import { valueIDAtom } from "../store";
import Zalo_UserID from "./Zalo/Zalo_UserID";

export default function Zalo_Parent({ formRef, markup, dataForm }: any) {
  const valueID = useAtomValue(valueIDAtom);

  return (
    <>
      {!valueID ? (
        <Zalo_UserID formRef={formRef} markup={markup} />
      ) : (
        <Zalo_Zns formRef={formRef} dataForm={dataForm} />
      )}
    </>
  );
}
