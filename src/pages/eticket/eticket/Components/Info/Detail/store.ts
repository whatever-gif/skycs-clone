import { atom } from "jotai";

export const Lst_Eticket_ActionType_Atom = atom([
  {
    ActionTypeCode: "0",
    ActionTypeName: "Send",
  },
  {
    ActionTypeCode: "1",
    ActionTypeName: "Send and mark eTicket as Closed",
  },
  {
    ActionTypeCode: "2",
    ActionTypeName: "Send and mark eTicket as Processing",
  },
]);

export const currentTabAtom = atom<number>(0);
export const currentValueTabAtom = atom<any>({
  ActionTypeCode: "0",
});

export const reloadingtabAtom = atom<string>("");
