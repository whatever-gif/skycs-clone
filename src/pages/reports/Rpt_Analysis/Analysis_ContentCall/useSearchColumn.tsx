import { useI18n } from "@/i18n/useI18n";
import { RequiredField } from "@/packages/common/Validation_Rules";
import { ItemProps } from "@/packages/ui/search-panel";
import { ColumnOptions } from "@/types";
import React from "react";

const useSearchColumn = () => {
  const { t } = useI18n("useSearchColumn_Analysis_ContentCall");

  const array: ItemProps[] = [
    {
      visible: true,
      dataField: "nguồn dữ liệu", // nguồn dữ liệu
      caption: t("nguồn dữ liệu"),
      label: {
        text: t("nguồn dữ liệu"),
      },
      editorType: "dxSelectBox",
      editorOptions: {
        dataSource: [],
        displayExpr: "",
        valueExpr: "",
      },
      validationRules: [RequiredField],
    },
    {
      visible: true,
      dataField: "Chi tiết nguồn dữ liệu", // nguồn dữ liệu
      caption: t("Chi tiết nguồn dữ liệu"),
      editorType: "dxTagBox",
      label: {
        text: t("Chi tiết nguồn dữ liệu"),
      },
      editorOptions: {
        dataSource: [],
        displayExpr: "",
        valueExpr: "",
      },
    },
    {
      dataField: "CreateDTimeUTC", // Thời gian
      caption: t("Thời gian"),
      visible: true,
      label: {
        text: t("CreateDTimeUTC"),
      },
      editorType: "dxDateRangeBox",
      editorOptions: {
        showClearButton: true,
        type: "date",
        format: "yyyy-MM-dd",
        displayFormat: "yyyy-MM-dd",
      },
    },
    {
      visible: true,
      dataField: "Chi nhánh", // chi nhánh
      caption: t("Chi nhánh"),
      editorType: "dxSelectBox",
      label: {
        text: t("Chi nhánh"),
      },
      editorOptions: {
        dataSource: [],
        displayExpr: "",
        valueExpr: "",
      },
    },
    {
      visible: true,
      dataField: "Agent", // Agent
      caption: t("Agent"),
      editorType: "dxTagBox",
      label: {
        text: t("Agent"),
      },
      editorOptions: {
        dataSource: [],
        displayExpr: "",
        valueExpr: "",
      },
    },
  ];

  return array;
};

export default useSearchColumn;
