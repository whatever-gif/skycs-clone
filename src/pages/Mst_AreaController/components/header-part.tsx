import { PageHeaderNoSearchLayout } from "@layouts/page-header-layout-2/page-header-nosearch-layout";
import Button from "devextreme-react/button";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { useI18n } from "@/i18n/useI18n";
import { toast } from "react-toastify";
import { useUploadFile } from "@packages/ui/upload-file/use-upload-file";
import { useExportExcel } from "@packages/ui/export-excel/use-export-excel";
import notify from "devextreme/ui/notify";
import { useClientgateApi } from "@packages/api";
import { useAtomValue, useSetAtom } from "jotai";
import { showErrorAtom } from "@packages/store";
import { logger } from "@packages/logger";
import { match } from "ts-pattern";
import { selectedItemsAtom } from "./store";

import PermissionContainer from "@/components/PermissionContainer";

interface HeaderPartProps {
  onAddNew: () => void;
  searchCondition: any;
}
export const HeaderPart = ({ onAddNew, searchCondition }: HeaderPartProps) => {
  const { t } = useI18n("Mst_AreaController-headers");
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const selectedItems = useAtomValue(selectedItemsAtom);

  const onDownloadTemplate = async () => {};
  const handleUploadFiles = async (files: File[]) => {};

  const handleExportExcel = async (selectedOnly: boolean) => {};

  const { uploadButton, uploadDialog } = useUploadFile({
    handleUploadFiles,
    onDownloadTemplate,
    buttonClassName: "w-full",
  });
  const { exportButton, exportDialog } = useExportExcel({
    buttonClassName: "w-full",
    selectedItems,
    onExportExcel: handleExportExcel,
  });

  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="text-header font-bold dx-font-m">
          {t("Mst_AreaController")}
        </div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        <PermissionContainer
          permission={"BTN_ADMIN_AREAMANAGER_CREATE"}
          children={
            <Button
              icon="/images/icons/plus-circle.svg"
              stylingMode={"contained"}
              type="default"
              className="heder-part-button-add"
              text={t("Add New")}
              onClick={onAddNew}
            />
          }
        />
        {/* <DropDownButton
          showArrowIcon={false}
          keyExpr={"id"}
          className="menu-items"
          displayExpr={"text"}
          wrapItemText={false}
          dropDownOptions={{
            width: 200,
            wrapperAttr: {
              class: "headerform__menuitems",
            },
          }}
          icon="/images/icons/more.svg"
        >
          <DropDownButtonItem
            render={(item: any) => {
              return <div>{uploadButton}</div>;
            }}
          />
          <DropDownButtonItem
            render={(item: any) => {
              return <div>{exportButton}</div>;
            }}
          />
        </DropDownButton> */}

        {uploadDialog}
        {exportDialog}
      </PageHeaderNoSearchLayout.Slot>
    </PageHeaderNoSearchLayout>
  );
};
