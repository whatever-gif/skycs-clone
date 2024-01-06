import { atom, useAtomValue } from "jotai";
import { match } from "ts-pattern";
import CustomerCampaign_Popup from "../Tab_CustomerCampaign/CustomerCampagin_Popup";
import EticketPopup from "../Tab_CustomerHistCall/components/popup/Eticket_Popup/EticketPopup";

export const matchTitleWithCurrentType = (type: string) => {
  return match(type)
    .with("ETICKET", () => "Chi tiết Eticket")
    .with("CAMPAIGN", () => "Chi tiết chiến dịch")
    .otherwise(() => "");
};

export const bizType = atom<any>(null);

export const bizCodeSys = atom<any>(null);

const Tab_Popup = () => {
  const currentBizType = useAtomValue(bizType);

  const currentBizCodeSys = useAtomValue(bizCodeSys);

  return match(currentBizType)
    .with("ETICKET", () => <EticketPopup TicketID={currentBizCodeSys} />)
    .with("CAMPAIGN", () => (
      <CustomerCampaign_Popup CampaignCode={currentBizCodeSys} />
    ))
    .otherwise(() => <></>);
};

export default Tab_Popup;
