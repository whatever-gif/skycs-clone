import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
import { PageHeaderNoSearchLayout } from "@layouts/page-header-layout-2/page-header-nosearch-layout";
import Button from "devextreme-react/button";

export const HeaderPart = () => {
  const { t } = useI18n("ServiceImprovementManager");

  const { t: common } = useI18n("Common");

  const navigate = useNetworkNavigate();
  const handleAdd = () => {
    navigate("/service/ServiceImprovement/Add");
  };

  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="text-header font-bold dx-font-m">
          {t("ServiceImprovementManager")}
        </div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot
        name={"Center"}
      ></PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        <PermissionContainer
          permission={
            "BTN_QUAN_LY_BO_TIEU_CHI_PHAN_TICH,_DANH_GIA_CHAT_LUONG_DICH_VU_THEM_MOI"
          }
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
