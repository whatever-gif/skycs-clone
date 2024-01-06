import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { usePermissions } from "@/packages/contexts/permission";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { showErrorAtom } from "@/packages/store";
import {
  dataImportAtom,
  isLoadingUploadAtom,
  selecteItemsAtom,
  visiblePropsUpValueAtom,
} from "@/pages/Mst_Customer/components/store";
import { useExportExcel } from "@packages/ui/export-excel/use-export-excel";
import { useUploadFile } from "@packages/ui/upload-file/use-upload-file";
import { Button, LoadPanel } from "devextreme-react";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { useAtomValue, useSetAtom } from "jotai";
import PopupDetailContent from "./popupDetailContent";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import { useState } from "react";
interface HeaderPartProps {}

const HeaderPart = ({}: HeaderPartProps) => {
  const { t } = useI18n("Analysis_ContentCall");
  const { t: buttonTranslate } = useI18n("Button");
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const { hasButtonPermission } = usePermissions();

  const onExport = () => {};
  const onSaveReport = () => {};

  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="text-header font-bold dx-font-m">
          {t("Analysis Content of Call")}
        </div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        <PermissionContainer permission={""}>
          <Button
            className="mr-2"
            stylingMode={"contained"}
            type="default"
            text={buttonTranslate("Export")}
            onClick={onExport}
          />
        </PermissionContainer>
        <PermissionContainer permission={""}>
          <Button
            stylingMode={"contained"}
            type="default"
            text={buttonTranslate("Save Report")}
            onClick={onSaveReport}
          />
        </PermissionContainer>
      </PageHeaderNoSearchLayout.Slot>
    </PageHeaderNoSearchLayout>
  );
};

export default HeaderPart;
