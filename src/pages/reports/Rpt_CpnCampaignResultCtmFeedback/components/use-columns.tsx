import { ColumnOptions } from "@packages/ui/base-gridview";
import { useI18n } from "@/i18n/useI18n";
import {
  Mst_CustomerGroupData,
  Rpt_CpnCampaignResultCtmFeedbackData,
} from "@packages/types";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { viewingDataAtom } from "./store";
import { StatusUser } from "@/packages/ui/status-user";
import { useEffect, useRef, useState } from "react";

interface UseBankDealerGridColumnsProps {
  data?: Rpt_CpnCampaignResultCtmFeedbackData[] | any;
}

export const useBankDealerGridColumns = ({
  data,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const { t } = useI18n("RptCpnCampaignResultCtmFeedback-colums");
  const dataFilter = Object.keys(data[0] || {}).map((key: any) => ({
    dataField: key,
    caption: key,
    visible: true,
  }));

  const columns: ColumnOptions[] = [
    {
      dataField: "CAMPAIGNCODE", // Mã ngân hàng
      caption: t("CAMPAIGNCODE"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      filterType: "exclude",
      visible: true,
    },
    {
      dataField: "CAMPAIGNNAME", // Mã ngân hàng
      caption: t("CAMPAIGNNAME"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      filterType: "exclude",
      visible: true,
    },

    {
      dataField: "CREATEDTIMEUTC", // Tên ngân hàng
      caption: t("CREATEDTIMEUTC"),
      format: "yyyy-MM-dd",
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      filterType: "exclude",
      visible: true,
    },
    {
      dataField: "CAMPAIGNSTATUS", // Mã đại lý
      caption: t("CAMPAIGNSTATUS"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      cellRender: ({ data }: any) => {
        return <StatusUser key={nanoid()} status={data.CAMPAIGNSTATUS} />;
      },
      filterType: "exclude",
      visible: true,
    },
    {
      dataField: "QTYSUMCTM", // Mã đại lý
      caption: t("QTYSUMCTM"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      filterType: "exclude",
      visible: true,
    },
    {
      dataField: "QTYDONE", // Mã đại lý
      caption: t("QTYDONE"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      filterType: "exclude",
      visible: true,
    },
    ...dataFilter,
  ];

  // return array of the first item only

  return columns;
};
