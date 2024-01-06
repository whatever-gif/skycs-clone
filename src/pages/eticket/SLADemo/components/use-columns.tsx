import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";

import { LinkCell } from "@packages/ui/link-cell";
import { Switch } from "devextreme-react";
import { nanoid } from "nanoid";

export const useMst_SLAColumns = () => {
  const navigate = useNetworkNavigate();

  const viewRow = async (rowIndex: number, data: any) => {
    navigate(`/admin/SLADemoPage/detail/${data?.SLAID}`);
  };

  const { t } = useI18n("Mst_SLA");

  const columns = [
    {
      dataField: "SLAID",
      editorOptions: {
        readOnly: true,
      },
      caption: t("SLAID"),
      columnIndex: 1,
      visible: true,
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
    {
      dataField: "SLALevel",
      editorOptions: {
        readOnly: true,
      },
      caption: t("SLALevel"),
      columnIndex: 1,
      visible: true,
    },
    {
      dataField: "SLADesc",
      editorOptions: {
        readOnly: true,
      },
      caption: t("SLADesc"),
      columnIndex: 1,
      visible: true,
      width: 300,
    },

    {
      dataField: "LogLUDTimeUTC",
      editorOptions: {
        readOnly: true,
      },
      caption: t("LogLUDTimeUTC"),
      columnIndex: 1,
      visible: true,
    },
    {
      dataField: "SLAStatus",
      editorOptions: {
        readOnly: true,
      },
      caption: t("SLAStatus"),
      columnIndex: 1,
      visible: true,
      cellRender: ({ data }: any) => {
        return <Switch value={data?.SLAStatus == "1"} />;
      },
    },
  ];
  // return array of the first item only

  return columns;
};
