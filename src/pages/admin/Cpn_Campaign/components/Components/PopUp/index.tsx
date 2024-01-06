import { Popup, ToolbarItem } from "devextreme-react/popup";
import { useAtomValue, useSetAtom } from "jotai";
import {
  InfoDetailCampaignValue,
  ListInfoDetailCampaignValue,
  visiblePopupAtom,
  typeSelectAtom,
  listCampaignAtom,
} from "./../../store";
import Button from "devextreme-react/button";
import ScrollView from "devextreme-react/scroll-view";
import { useClientgateApi } from "@packages/api";
import { useI18n } from "@/i18n/useI18n";
import { Mst_CustomerPage } from "./Mst_Customer_Clone";
import "./../../../style.scss";
import { toast } from "react-toastify";

interface SearchCustomerPopupProps {
  onCancel: any;
  onSave: (data: any) => void;
}

export const SearchCustomerPopup = ({
  onCancel,
  onSave,
}: SearchCustomerPopupProps) => {
  const { t } = useI18n("EditForm_Campaign");
  const popupVisible = useAtomValue(visiblePopupAtom);
  const setVisible = useSetAtom(visiblePopupAtom);
  const setListCampaign = useSetAtom(listCampaignAtom);
  const listCampaign = useAtomValue(listCampaignAtom);
  const handleCancel = () => {
    onCancel();
    setVisible(false);
  };

  const handleSave = () => {};

  return (
    <Popup
      className="popup-campaign"
      position={"center"}
      showCloseButton={true}
      onHiding={handleCancel}
      title={`Add Field`}
      visible={popupVisible}
    >
      <ScrollView className="popup-customer-content" width={"100%"}>
        <Mst_CustomerPage />
      </ScrollView>
      <ToolbarItem toolbar={"bottom"} location={"center"}>
        <Button
          text={t("Select")}
          type={"default"}
          stylingMode={"contained"}
          onClick={handleSave}
        />
        <Button
          text={t("Cancel")}
          stylingMode={"contained"}
          onClick={handleCancel}
        />
      </ToolbarItem>
    </Popup>
  );
};
