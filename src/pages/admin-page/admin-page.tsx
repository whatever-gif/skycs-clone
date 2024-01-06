import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { useAuth } from "@packages/contexts/auth";
import "src/pages/admin-page/admin-page.scss";

export const AdminPage = () => {
  const { t } = useI18n("Common");
  const {
    auth: { currentUser },
  } = useAuth();

  return (
    <AdminContentLayout className={"dealer-management"}>
      <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}></AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
export default AdminPage;
