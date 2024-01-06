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
import { Button } from "devextreme-react";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import PopupDetailContent from "./popupDetailContent";

import { progressAtom } from "@/packages/ui/upload-dialog/store";
interface HeaderPartProps {
  onAddNew: () => void;
  searchCondition: Partial<any>;
  onReload: () => void;
}

const HeaderPart = ({
  onAddNew,
  searchCondition,
  onReload,
}: HeaderPartProps) => {
  const { t } = useI18n("Mst_Customer");
  const { t: buttonTranslate } = useI18n("Mst_Customer_Button");
  const setVisiblePropsUpValue = useSetAtom(visiblePropsUpValueAtom);
  const setData = useSetAtom(dataImportAtom);
  const setIsLoadingUpload = useSetAtom(isLoadingUploadAtom);

  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const selectedItems = useAtomValue(selecteItemsAtom);
  const setProgress = useSetAtom(progressAtom);
  const { hasButtonPermission } = usePermissions();

  const handleSaveProgress = (e: any) => {
    const percent = Math.round(e.progress * 100);
    setProgress(percent);
  };

  const onDownloadTemplate = async () => {
    const resp = await api.Mst_Customer_Excel_ExportTemplate(
      "ScrTplCodeSys.2023"
    );
    if (resp.isSuccess) {
      toast.success(t("Download Successfully"));
      (window.location.href as any) = resp.Data;
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
    // setIsLoadingUpload(true);
    const resp = await api.Mst_Customer_Excel_Import(
      "ScrTplCodeSys.2023",
      files[0],
      handleSaveProgress
    );
    if (resp.isSuccess) {
      toast.success(t("Upload Successfully"));
      const response: any = resp.Data;
      const { DataTable, TotalError, TotalSuccess, Total, Url } = response;
      setVisiblePropsUpValue(true);
      setData({
        TotalSuccess: TotalSuccess,
        TotalError: TotalError,
        Total: Total,
        url: Url,
        DataTable: DataTable,
      });
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
    // setIsLoadingUpload(false);
  };

  const handleExportExcel = async (selectedOnly: boolean) => {
    let resp = await match(selectedOnly)
      .with(true, async () => {
        return await api.Mst_Customer_Excel_ExportByListCustomerCodeSys(
          "ScrTplCodeSys.2023",
          selectedItems
        );
      })
      .otherwise(async () => {
        return await api.Mst_Customer_Excel_Export(searchCondition);
      });
    if (resp.isSuccess) {
      toast.success(t("Download Successfully"));
      if (resp.Data) {
        (window.location.href as any) = resp.Data;
      }
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

  const handleClose = () => {
    setVisiblePropsUpValue(false);
    onReload();
  };

  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="text-header font-bold dx-font-m">
          {t("Mst_Customer")}
        </div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot name={"After"}>
        <PermissionContainer permission={"BTN_CUSTOMER_LIST_CREATE"}>
          <Button
            icon="/images/icons/plus-circle.svg"
            stylingMode={"contained"}
            type="default"
            text={buttonTranslate("Add New")}
            onClick={onAddNew}
            style={{
              marginRight: 10,
            }}
          />
        </PermissionContainer>
        <DropDownButton
          visible={hasButtonPermission("BTN_CUSTOMER_LIST_MORE")}
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
            visible={hasButtonPermission("BTN_CUSTOMER_LIST_MORE_IMPORTEXCEL")}
            render={(item: any) => {
              return <div>{uploadButton}</div>;
            }}
          />
          <DropDownButtonItem
            visible={hasButtonPermission("BTN_CUSTOMER_LIST_MORE_EXPORTEXCEL")}
            render={(item: any) => {
              return <div>{exportButton}</div>;
            }}
          />
        </DropDownButton>
        {uploadDialog}
        {exportDialog}
        <PopupDetailContent handleCancel={() => handleClose()} />
      </PageHeaderNoSearchLayout.Slot>
    </PageHeaderNoSearchLayout>
  );
};

export default HeaderPart;
