import { atom } from "jotai";
import { Mst_CampaignColumnConfig } from "@packages/types";

export const defatultValue = atom<any>({
  CampaignColCfgCodeSys: "",
  CampaignColCfgCode: "",
  OrgID: "",
  NetworkID: "",
  CampaignColCfgDataType: "",
  CampaignColCfgName: "",
  CampaignColCfgDateUse: "",
  JsonListOption: "",
  FlagIsDynamic: "",
  FlagActive: false,
  LogLUDTimeUTC: "",
  LogLUBy: "",
  IsRequired: false,
  IsUnique: false,
  IsSearchable: false,
});

export const showPopupAtom = atom<boolean>(false);
export const currentItemAtom = atom<Partial<Mst_CampaignColumnConfig>>({
  CampaignColCfgCodeSys: "",
  CampaignColCfgCode: "",
  OrgID: "",
  NetworkID: "",
  CampaignColCfgDataType: "",
  CampaignColCfgName: "",
  CampaignColCfgDateUse: "",
  JsonListOption: "",
  FlagIsDynamic: "",
  FlagActive: true,
  LogLUDTimeUTC: "",
  LogLUBy: "",
  IsRequired: "",
  IsUnique: "",
  IsSearchable: "",
  ListOption: [],
});

export const flagAtom = atom<string>("");
