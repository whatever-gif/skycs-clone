import { PageHeaderNoSearchLayout } from "@layouts/page-header-layout-2/page-header-nosearch-layout";
import Button from "devextreme-react/button";

import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { selectedItemsAtom } from "@/pages/Department_Control/components/store";
import { useClientgateApi } from "@packages/api";
import { logger } from "@packages/logger";
import { showErrorAtom } from "@packages/store";
import { useExportExcel } from "@packages/ui/export-excel/use-export-excel";
import { useUploadFile } from "@packages/ui/upload-file/use-upload-file";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
interface HeaderPartProps {
  onAddNew: () => void;
}
export const HeaderPart = ({ onAddNew }: HeaderPartProps) => {
  const { t } = useI18n("Department_Control-headers");
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const selectedItems = useAtomValue(selectedItemsAtom);

  const onDownloadTemplate = async () => {
    const resp = await api.Mst_Dealer_ExportTemplate();
    if (resp.isSuccess) {
      toast.success(t("DownloadSuccessfully"));
      window.location.href = resp.Data!;
    } else {
      showError({
        message: resp._strErrCode,
        _strErrCode: resp._strErrCode,
        _strTId: resp._strTId,
        _strAppTId: resp._strAppTId,
        _objTTime: resp._objTTime,
        _strType: resp._strType,
        _dicDebug: resp._dicDebug,
        _dicExcs: resp._dicExcs,
      });
    }
  };
  const handleUploadFiles = async (files: File[]) => {
    const resp = await api.Mst_Dealer_Import(files[0]);
    if (resp.isSuccess) {
      toast.success(t("UploadSuccessfully"));
    } else {
      showError({
        message: resp._strErrCode,
        _strErrCode: resp._strErrCode,
        _strTId: resp._strTId,
        _strAppTId: resp._strAppTId,
        _objTTime: resp._objTTime,
        _strType: resp._strType,
        _dicDebug: resp._dicDebug,
        _dicExcs: resp._dicExcs,
      });
    }
  };

  const handleExportExcel = async (selectedOnly: boolean) => {
    logger.debug("selectedOnly:", selectedOnly);
    let resp = await match(selectedOnly)
      .with(true, async () => {
        return await api.Mst_Dealer_ExportByListDealerCode(selectedItems);
      })
      .otherwise(async () => {
        return await api.Mst_Dealer_Export();
      });
    if (resp.isSuccess) {
      toast.success(t("DownloadSuccessfully"));
      window.location.href = resp.Data;
    } else {
      showError({
        message: resp._strErrCode,
        _strErrCode: resp._strErrCode,
        _strTId: resp._strTId,
        _strAppTId: resp._strAppTId,
        _objTTime: resp._objTTime,
        _strType: resp._strType,
        _dicDebug: resp._dicDebug,
        _dicExcs: resp._dicExcs,
      });
    }
  };

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
          {t("DepartmentControlManager")}
        </div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        <PermissionContainer
          permission={"BTN_ADMIN_DEPARTMENTCONTROL_CREATE"}
          children={
            <Button
              icon="/images/icons/plus-circle.svg"
              stylingMode={"contained"}
              type="default"
              text={t("AddNew")}
              onClick={onAddNew}
            />
          }
        />

        <DropDownButton
          visible={false}
          showArrowIcon={false}
          keyExpr={"id"}
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
        </DropDownButton>

        {uploadDialog}
        {exportDialog}
      </PageHeaderNoSearchLayout.Slot>
    </PageHeaderNoSearchLayout>
  );
};
