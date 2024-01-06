import "src/pages/admin-page/admin-page.scss";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@packages/contexts/auth";
import { useI18n } from "@/i18n/useI18n";
import { EticketLayout } from "@/packages/layouts/eticket-layout";
import { Height } from "devextreme-react/chart";
import { Button, TabPanel, Tabs } from "devextreme-react";
import { Item as TabItem } from "devextreme-react/tabs";
import { Eticket } from "@packages/types";

import { useEticket_api } from "@/packages/api/clientgate/Api_Eticket_Demo";

export const NoPermissionPage = () => {
  //const { auth: { currentUser } } = useAuth();

  return (
    <EticketLayout className={"eticket monitor"}>
      <EticketLayout.Slot name={"Header"}></EticketLayout.Slot>

      <EticketLayout.Slot name={"Content"}></EticketLayout.Slot>
    </EticketLayout>
  );
};
export default NoPermissionPage;
