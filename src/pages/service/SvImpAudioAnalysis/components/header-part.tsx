import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
import { PageHeaderNoSearchLayout } from "@layouts/page-header-layout-2/page-header-nosearch-layout";
import Button from "devextreme-react/button";

export const HeaderPart = () => {
  const { t } = useI18n("SvImpAudioAnalysisManager");

  const { t: common } = useI18n("Common");

  const navigate = useNetworkNavigate();
  const handleAdd = () => {
    navigate("/service/SvImpAudioAnalysis/Add");
  };

  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="text-header font-bold dx-font-m">
          {t("SvImpAudioAnalysisManager")}
        </div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot
        name={"Center"}
      ></PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        <PermissionContainer
          permission={"BTN_QUAN_LY_SU_DUNG_AI_PHAN_TICH_AM_THANH_THEM_MOI"}
        >
          <Button
            icon="/images/icons/plus-circle.svg"
            stylingMode={"contained"}
            type="default"
            text={common("Add New")}
            onClick={handleAdd}
          />
        </PermissionContainer>
      </PageHeaderNoSearchLayout.Slot>
    </PageHeaderNoSearchLayout>
  );
};
