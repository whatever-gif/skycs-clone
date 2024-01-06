import { PageHeaderNoSearchLayout } from "@layouts/page-header-layout-2/page-header-nosearch-layout";
import Button from "devextreme-react/button";
import { useI18n } from "@/i18n/useI18n";
import { useNavigate } from "react-router-dom";
import { authAtom } from "@/packages/store";
import { useAtomValue } from "jotai";

export const HeaderPart = () => {
  const nav = useNavigate();
  const { t } = useI18n("Post_Manager-header");
  const auth = useAtomValue(authAtom);
  const handleSave = () => {
    nav(`/${auth.networkId}/admin/Post_Manager/addNew`);
  };

  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="text-header font-bold dx-font-m">
          {t("Post manager")}
        </div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot
        name={"Center"}
      ></PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        <Button
          stylingMode={"contained"}
          type="default"
          text={t("Add new")}
          onClick={handleSave}
        />
      </PageHeaderNoSearchLayout.Slot>
    </PageHeaderNoSearchLayout>
  );
};
