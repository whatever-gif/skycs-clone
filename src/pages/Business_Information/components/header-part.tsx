import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@packages/api";
import { showErrorAtom } from "@packages/store";

import { HeaderNewForm } from "@/packages/ui/headerNew-form/headerNew-form";
import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "react-toastify";
import { keywordAtom, selectedItemsAtom } from "./store";

interface HeaderPartProps {
  onAddNew?: () => void;
  refetch: any;
  handleOnEditRow?: any;
  permission?: any;
}

export const HeaderPart = ({
  onAddNew,
  refetch,
  handleOnEditRow,
  permission,
}: HeaderPartProps) => {
  const { t } = useI18n("Business_Information-headers");

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
  const handleDeleteRow = async (id: any) => {
    const resp = await api.Mst_NNTController_Delete(id);
    if (resp.isSuccess) {
      toast.success(t("Delete Successfully"));
      await refetch();
      return true;
    }
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
    throw new Error(resp._strErrCode);
  };

  return (
    <HeaderNewForm
      permissionExportExecl={""}
      permissionImportExecl={""}
      permissionMore={""}
      permissionSearch={"BTN_ADMIN_ORG_BUSINESS_INFOMATION_SEARCH"}
      permissionCreate={"BTN_ADMIN_ORG_BUSINESS_INFOMATION_CREATE"}
      hidenMore={false}
      hidenExportExcel={false}
      hidenImportExcel={false}
      onSearch={handleSearch}
      onAddNew={onAddNew}
      onExportExcel={handleExportExcel}
      selectedItems={selectedItems}
      onDelete={handleDeleteRow}
      handleOnEditRow={handleOnEditRow}
    />
  );
};
