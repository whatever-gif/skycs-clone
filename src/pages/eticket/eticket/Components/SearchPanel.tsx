import { useI18n } from "@/i18n/useI18n";
import { useSetAtom } from "jotai";
import { searchPanelVisibleAtom } from "@layouts/content-searchpanel-layout";
import Form, { IItemProps } from "devextreme-react/form";
import { useCallback, useEffect } from "react";
import {
  Header,
  SearchPanel as CommonSearchPanel,
} from "@/packages/ui/search-panel";
import { flagEditorOptions } from "@/packages/common";
import { Mst_Dealer } from "@/packages/types";
import CustomStore from "devextreme/data/custom_store";
import { useClientgateApi } from "@/packages/api";

interface SearchPanelProps {
  conditionFields?: IItemProps[];
  listDealer: Mst_Dealer[];
  onSearch?: (values: any) => void;
  data?: any;
}

export const SearchPanel = ({
  conditionFields = [],
  listDealer,
  onSearch,
  data,
}: SearchPanelProps) => {
  // màn hình search
  const { t } = useI18n("Eticket_Manager_SearchPanel");
  const api = useClientgateApi();
  const setSearchPanelVisible = useSetAtom(searchPanelVisibleAtom); // hàm này dùng để thay đổi trạng thái của state
  const onToggleSettings = () => {};
  // console.log("search:", data);
  let formData = {};
  useEffect(() => {
    formData = {
      ...formData,
      ...data,
    };
  }, []);

  const handleSearch = () => {
    onSearch?.(data);
  };
  const onClose = () => {
    // đóng màn hình nav search
    setSearchPanelVisible(false);
  };
  // điều kiện form ở trong nav search
  const formItems: IItemProps[] = [
    ...conditionFields, // default
    {
      caption: t("DealerCode"),
      dataField: "DealerCode",
      editorType: "dxSelectBox",
      editorOptions: {
        dataSource: listDealer,
        displayExpr: "DealerCode",
        valueExpr: "DealerCode",
        placeholder: t("Input"),
      },
    },
    {
      dataField: "SOApprDateFrom",
      caption: t("SOApprDateFrom"),
      editorType: "dxDateBox",
      editorOptions: {
        type: "date",
      },
      // format: "yyyy-MM-dd",
    },
    {
      dataField: "SOApprDateTo",
      caption: t("SOApprDateTo"),
      editorType: "dxDateBox",
      editorOptions: {
        type: "date",
      },
      // format: "yyyy-MM-dd",
    },
    {
      dataField: "SOApprDateToInit",
      caption: t("SOApprDateToInit"),
      editorType: "dxDateBox",
      editorOptions: {
        type: "date",
      },
      // format: "yyyy-MM-dd",
    },
    {
      dataField: "FlagActive",
      caption: t("Flag Active"),
      editorType: "dxSelectBox",
      editorOptions: flagEditorOptions,
    },
    {
      itemType: "button",
      cssClass: "w-full flex items-center justify-center",
      buttonOptions: {
        text: t("Search"),
        stylingMode: "contained",
        type: "default",
        width: "100%",
        onClick: handleSearch,
      },
    },
  ];
  return (
    <CommonSearchPanel
      onClose={onClose}
      data={data}
      items={formItems}
      onToggleSettings={onToggleSettings}
    />
  );
};
