import { ColumnOptions } from "@packages/ui/base-gridview";
import {
  filterByFlagActive,
  headerFilterAllowTranslate,
  uniqueFilterByDataField,
} from "@packages/common";
import { StatusButton } from "@packages/ui/status-button";
import { useI18n } from "@/i18n/useI18n";
import { Mst_CustomerGroupData } from "@packages/types";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { LinkCell } from "@packages/ui/link-cell";
import { flagSelectorAtom, viewingDataAtom } from "./store";
import NavNetworkLink from "@/components/Navigate";
import { match } from "ts-pattern";
import { Search } from "devextreme-react/data-grid";

interface Cpn_CampaignPage_ColumnProps {
  cellClick: (t: string[]) => void;
}

export const Cpn_CampaignPage_Column = ({
  cellClick,
}: // listBankCode,
Cpn_CampaignPage_ColumnProps) => {
  const { t } = useI18n("Cpn_Campaign_Column");
  const setFlagSelector = useSetAtom(flagSelectorAtom);

  const FlagStatus = (value: string) => {
    return (
      <div className="status-container flex justify-center">
        <span className={`status ${value ? value.toLowerCase() : ""}`}>
          {t(`${value}`)}
        </span>
      </div>
    );
  };

  const columns: ColumnOptions[] = [
    {
      dataField: "Idx",
      caption: t("Idx"),
      width: 80,
      cellRender: ({ data, rowIndex }) => {
        return <>{rowIndex + 1}</>;
      },
    },
    {
      dataField: "CampaignCode", // Mã chien dich
      caption: t("CampaignCode"),
      visible: true,
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data, rowIndex, value }) => {
        return (
          <p
            onClick={() => {
              setFlagSelector("detail");
            }}
          >
            <NavNetworkLink
              to={`/campaign/Cpn_CampaignPage/Cpn_Campaign_Info/detail/${data.CampaignCode}`}
            >
              {data.CampaignCode}
            </NavNetworkLink>
          </p>
        );
      },
    },
    {
      dataField: "CampaignName", // Tên chiến dịch
      caption: t("CampaignName"),
      visible: true,
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      dataField: "CampaignTypeName", // Loại chiến dịch
      caption: t("CampaignTypeName"),
      visible: true,
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      dataField: "DTimeStart", // Thời gian
      caption: t("DTimeStart"),
      visible: true,
      editorType: "dxTextBox",
    },
    {
      dataField: "DTimeEnd", // Thời gian kết thúc
      caption: t("DTimeEnd"),
      visible: true,
      editorType: "dxTextBox",
    },
    {
      dataField: "QtyCustomer", // SL khách hàng
      caption: t("QtyCustomer"),
      visible: true,
      editorType: "dxTextBox",
    },
    {
      dataField: "ListAgentName", // Agent phụ trách
      caption: t("ListAgentName"),
      visible: true,
      editorType: "dxTextBox",
      cellRender: ({ data }) => {
        const getList = data.ListAgentName ? data.ListAgentName.split(",") : [];
        if (getList.length > 1) {
          return (
            <>
              <LinkCell
                onClick={() => cellClick(getList)}
                value={t("Multiple") + " " + `(${getList.length})`}
              ></LinkCell>
            </>
          );
        } else {
          return <span>{getList.join(",")}</span>;
        }
      },
    },
    {
      dataField: "CampaignStatus", // trạng thái
      caption: t("CampaignStatus"),
      visible: true,
      editorType: "dxTextBox",
      cellRender: ({ data }: any) => {
        return FlagStatus(data.CampaignStatus);
      },
      filterType: "exclude",
    },
    {
      dataField: "CampaignDesc", // Mô tả
      caption: t("CampaignDesc"),
      visible: true,
      editorType: "dxTextBox",
    },
  ];

  return columns;
};
