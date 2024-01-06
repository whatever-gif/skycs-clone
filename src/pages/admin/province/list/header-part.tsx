import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@packages/api";
import { showErrorAtom } from "@packages/store";
import { HeaderForm } from "@packages/ui/header-form/header-form";
import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "react-toastify";
import {
  keywordAtom,
  selectedItemsAtom,
} from "src/pages/admin/province/components/screen-atom";

interface HeaderPartProps {
  onAddNew?: () => void;
  onUploadFile?: (file: File, progressCallback?: Function) => void;
  onDownloadTemplate: () => void;
}

export const HeaderPart = ({
  onUploadFile,
  onDownloadTemplate,
  onAddNew,
}: HeaderPartProps) => {
  const { t } = useI18n("Common");

  const selectedItems = useAtomValue(selectedItemsAtom);
  const keyword = useAtomValue(keywordAtom);
  const setKeyword = useSetAtom(keywordAtom);
  const showError = useSetAtom(showErrorAtom);
  const api = useClientgateApi();
  const handleSearch = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleExportExcel = async (selectedOnly: boolean) => {
    const resp = await api.Mst_Province_ExportByListProvinceCode(
      selectedItems,
      keyword || ""
    );
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

  return (
    <HeaderForm
      onSearch={handleSearch}
      onAddNew={onAddNew}
      onUploadFile={onUploadFile}
      onExportExcel={handleExportExcel}
      onDownloadTemplate={onDownloadTemplate}
      selectedItems={selectedItems}
    />
  );
};
