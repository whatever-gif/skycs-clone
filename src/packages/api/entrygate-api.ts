import { ClientGateInfoResponse, IUser } from "@packages/types";
import { logger } from "@packages/logger";
import axios from "axios";
import { Tid } from "@/utils/hash";

const entryGateDomain: string = `${
  import.meta.env.VITE_API_ENTRY_CENTER_GATE_URL
}`;

const entryGateApiBase = axios.create({
  baseURL: entryGateDomain,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    AppAgent: "Web-SkyCS",
    GwUserCode: "idocNet.idn.EntryCenterGate.Sv",
    GwPassword: "idocNet.idn.EntryCenterGate.Sv",
    AppLanguageCode: "en",
    UtcOffset: 7,
    DealerCode: "HTC",
    Tid: Tid(),
  },
});
export const entryGateApi = {
  getNetworkInfo: async (
    networkId: string,
    orgId: string,
    currentUser: IUser
  ) => {
    // console.log("entryGateDomain ", entryGateDomain);
    const token = localStorage.getItem("token");
    const response = await entryGateApiBase.post<ClientGateInfoResponse>(
      "/EntryCtMstNetwork/GetByNetwork",
      {
        SolutionCode: "SKYCS",
        NetworkIdSearch: networkId,
      },
      {
        headers: {
          NetworkId: networkId,
          OrgId: orgId,
          Authorization: `Bearer ${token}`,
          AppLanguageCode: currentUser.Language,
          UtcOffset: currentUser.TimeZone,
        },
      }
    );
    logger.debug("response", response);
    if (
      response.status === 200 &&
      response.data.Data._objResult &&
      response.data.Data._objResult.length > 0
    ) {
      return response.data;
    } else {
      return null;
    }
  },
};
