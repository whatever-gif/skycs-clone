import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
import { PageHeaderNoSearchLayout } from "@layouts/page-header-layout-2/page-header-nosearch-layout";
import Button from "devextreme-react/button";
import { useSetAtom } from "jotai";
import {
  CampaignTypeAtom,
  currentInfo,
  flagSelectorAtom,
  listCampaignAtom,
} from "./store";
export const HeaderPart = () => {
  const { t } = useI18n("Cpn_CampaignPage");
  const navigate = useNetworkNavigate();
  const setFlagSelector = useSetAtom(flagSelectorAtom);
  const setCurrentInfo = useSetAtom(currentInfo);
  const setListCampaignAtom = useSetAtom(listCampaignAtom);
  const setCampaignType = useSetAtom(CampaignTypeAtom);

  const handleAdd = () => {
    setFlagSelector("add");
    setCurrentInfo({
      CampaignAgent: [],
      uploadFiles: [],
    });
    setCampaignType("");
    setListCampaignAtom([]);
    navigate("/campaign/Cpn_CampaignPage/Cpn_Campaign_Info");
  };

  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="text-header font-bold dx-font-m">
          {t("Cpn_CampaignPage")}
        </div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot
        name={"Center"}
      ></PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        <PermissionContainer permission="BTN_CAMPAIGN_CAMPAIGNMANAGER_CREATE">
          <Button
            icon="/images/icons/plus-circle.svg"
            stylingMode={"contained"}
            type="default"
            text={t("Add New")}
            onClick={handleAdd}
          />
        </PermissionContainer>
      </PageHeaderNoSearchLayout.Slot>
    </PageHeaderNoSearchLayout>
  );
};
