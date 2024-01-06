import { useI18n } from "@/i18n/useI18n";
import { LinkCell } from "@/packages/ui/link-cell";
import { requiredType } from "@packages/common/Validation_Rules";
import { Mst_CustomerHist } from "@packages/types";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import { viewingDataAtom } from "./store";

interface Props {
  data?: Mst_CustomerHist[] | any;
}

export const useMst_CustomerHist_Column = ({
  data,
}: // listBankCode,
Props) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const viewRow = (rowIndex: number, data: Mst_CustomerHist) => {
    setViewingItem({
      rowIndex,
      item: data,
    });
  };

  const { t } = useI18n("Tab_CustomerHist");
  const columns = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "LUDTimeUTC", // Mã ngân hàng
      caption: t("LUDTimeUTC"),
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: true,
        placeholder: t("Input"),
      },
      width: 200,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "LUBy", // Mã ngân hàng
      caption: t("LUBy"),
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: true,
        placeholder: t("Input"),
      },
      width: 200,
    },

    {
      groupKey: "BASIC_INFORMATION",
      dataField: "JsonCustomerInfoHist", // Mã ngân hàng
      caption: t("JsonCustomerInfoHist"),
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: true,
        placeholder: t("Input"),
      },
      width: 200,
      cellRender: ({ data, rowIndex, value }: any) => {
        return (
          <LinkCell
            key={nanoid()}
            onClick={() => viewRow(rowIndex, data)}
            value={value}
          />
        );
      },
    },
  ];

  return columns;
};
