import { ColumnOptions } from "@packages/ui/base-gridview";
import { StatusButton } from "@packages/ui/status-button";
import { useI18n } from "@/i18n/useI18n";
import { Mst_CustomerGroupData } from "@packages/types";
import { nanoid } from "nanoid";
import NavNetworkLink from "@/components/Navigate";
import { checkUIZNSAtom } from "./store";
import { useSetAtom } from "jotai";
import { filterByFlagActive } from "@/packages/common";
import {
  checkMenuPermision,
  checkPermision,
} from "@/components/PermissionContainer";

interface UseBankDealerGridColumnsProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const useBankDealerGridColumns = ({
  data,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const { t } = useI18n("Content_Managent-columns");
  const setcheckUIZNS = useSetAtom(checkUIZNSAtom);
  const handleClick = () => {
    setcheckUIZNS(false);
  };
  const check = checkMenuPermision("MNU_ADMIN_CONTENTTEM_UPDATE");

  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "SubFormCode", // Mã ngân hàng
      caption: t("SubFormCode"),
      editorType: "dxTextBox",
      filterType: "exclude",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data, rowIndex, value }) => {
        return (
          <>
            {check ? (
              <NavNetworkLink
                to={`/admin/Content_Managent/${data.SubFormCode}`}
              >
                <div className="text-green-600" onClick={handleClick}>
                  {value}
                </div>
              </NavNetworkLink>
            ) : (
              <div className="text-green-600" onClick={handleClick}>
                {value}
              </div>
            )}
          </>
        );
      },
      visible: true,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "SubFormName", // Mã ngân hàng
      caption: t("SubFormName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      visible: true,
      columnIndex: 1,
      filterType: "exclude",
    },

    {
      groupKey: "BASIC_INFORMATION",
      dataField: "ChannelType", // Tên ngân hàng
      caption: t("ChannelType"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      visible: true,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "IDZNS", // Mã đại lý
      caption: t("IDZNS"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 2,
      visible: true,
      filterType: "exclude",
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "BulletinType", // Mã đại lý
      caption: t("BulletinType"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      visible: true,
      filterType: "exclude",
    },
    {
      dataField: "FlagActive",
      caption: t("FlagActive"),
      editorType: "dxSwitch",
      alignment: "center",
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      filterType: "exclude",
      cellRender: ({ data }: any) => {
        return <StatusButton key={nanoid()} isActive={data.FlagActive} />;
      },
      headerFilter: {
        dataSource: filterByFlagActive(data, {
          true: t("Active"),
          false: t("Inactive"),
        }),
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "LogLUDTimeUTC",
      caption: t("LogLUDTimeUTC"),
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      editorType: "dxTextBox",
      columnIndex: 2,
      filterType: "exclude",
      visible: true,
    },
  ];
  // return array of the first item only

  return columns;
};
