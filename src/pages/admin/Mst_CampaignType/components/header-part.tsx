import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
import { PageHeaderNoSearchLayout } from "@layouts/page-header-layout-2/page-header-nosearch-layout";
import Button from "devextreme-react/button";

export const HeaderPart = () => {
  const { t } = useI18n("Mst_CampaignTypePage");
  const navigate = useNetworkNavigate();
  const handleAdd = () => {
    navigate("/admin/Mst_CampaignTypePage/Customize/Add");
  };

  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="text-header font-bold dx-font-m">
          {t("Mst_CampaignTypePage")}
        </div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot
        name={"Center"}
      ></PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        <PermissionContainer permission={"BTN_ADMIN_CAMPAIGN_TYPE_CREATE"}>
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
