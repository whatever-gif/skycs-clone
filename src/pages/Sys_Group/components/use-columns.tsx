import { ColumnOptions } from "@packages/ui/base-gridview";
import { useI18n } from "@/i18n/useI18n";
import { Mst_DepartmentControl, Sys_GroupController } from "@packages/types";
import { useSetAtom } from "jotai";

import { nanoid } from "nanoid";
import { LinkCell } from "@packages/ui/link-cell";
import { StatusButton } from "@/packages/ui/status-button";
import {
  flagDetail,
  flagEdit,
  showDetail,
  showPopup,
  viewingDataAtom,
} from "./store";
import { filterByFlagActive } from "@/packages/common";

interface Mst_DepartmentControlColumnsProps {
  data?: any;
}

export const useDepartMentGridColumns = ({
  data,
}: Mst_DepartmentControlColumnsProps) => {
  const setViewingItem = useSetAtom(viewingDataAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setShowDetail = useSetAtom(showDetail);
  const setCheckEdit = useSetAtom(flagEdit);
  const setFlagDetail = useSetAtom(flagDetail);
  const viewRow = (rowIndex: number, data: any) => {
    setShowDetail(true);
    setCheckEdit(false);
    setViewingItem({
      rowIndex,
      item: data,
    });
    setFlagDetail("");
    setPopupVisible(true);
  };

  const { t } = useI18n("Sys_Group-columns");
  const columns: ColumnOptions[] = [
    {
      dataField: "GroupName",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("GroupName"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
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
      filterType: "exclude",
    },
    {
      dataField: "QtyUser",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("QtyUser"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      alignment: "left",
      cssClass: "TextLeftGrid",
      width: 120,
      filterType: "exclude",
    },
    {
      dataField: "GroupDesc",
      editorOptions: {
        readOnly: true,
      },
      caption: t("GroupDesc"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      filterType: "exclude",
    },
    {
      dataField: "FlagActive",
      caption: t("Status"),
      editorType: "dxSwitch",
      columnIndex: 2,
      headerFilter: {
        dataSource: filterByFlagActive(data ?? [], {
          true: t("Active"),
          false: t("Inactive"),
        }),
      },
      groupKey: "BASIC_INFORMATION",
      visible: true,
      filterType: "exclude",
      cellRender: ({ data }: any) => {
        return <StatusButton key={nanoid()} isActive={data.FlagActive} />;
      },
    },
  ];
  // return array of the first item only

  return columns;
};
