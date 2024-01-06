import { atom } from "jotai";
export const selectedItemsAtom = atom<string[]>([]);

export const keywordAtom = atom<string>("");

interface formValue {
  SLALevel: string;
  SLADesc: string;
  FirstResTime: number;
  ResolutionTime: number;
  SLAStatus: boolean;
}

export const defaultSLAHeaderForm: formValue = {
  SLALevel: "",
  SLADesc: "",
  FirstResTime: -21600000,
  ResolutionTime: -21600000,
  SLAStatus: true,
};

export const headerForm = atom<formValue>(defaultSLAHeaderForm);

interface ticketInfo {
  TicketType: any[];
  TicketCustomType: any[];
  Customer: any[];
  CustomerGroup: any[];
  CustomerEnterprise: any[];
  CustomerEnterpriseGroup: any[];
}

export const defaultTicketInfo: ticketInfo = {
  TicketType: [],
  TicketCustomType: [],
  Customer: [],
  CustomerGroup: [],
  CustomerEnterprise: [],
  CustomerEnterpriseGroup: [],
};

export const ticketInfo = atom<ticketInfo>(defaultTicketInfo);
