import { PageHeaderNoSearchLayout } from "@layouts/page-header-layout-2/page-header-nosearch-layout";
import Button from "devextreme-react/button";
import { useI18n } from "@/i18n/useI18n";
import PermissionContainer from "@/components/PermissionContainer";

export const HeaderPart = ({ onSave }: any) => {
  const { t } = useI18n("OmiChanel-header");
  const handleSave = () => {
    onSave();
  };

  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="text-header font-bold dx-font-m">
          {t("Omni Chanel")}
        </div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot
        name={"Center"}
      ></PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        <PermissionContainer
          permission={"BTN_ADMIN_CAU_HINH_KET_NOI_KENH_TUONG_TAC_UPDATE"}
          children={
            <Button
              stylingMode={"contained"}
              type="default"
              text={t("Save")}
              onClick={handleSave}
            />
          }
        />
      </PageHeaderNoSearchLayout.Slot>
    </PageHeaderNoSearchLayout>
  );
};
