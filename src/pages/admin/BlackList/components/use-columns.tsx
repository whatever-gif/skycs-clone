import { ColumnOptions } from "@packages/ui/base-gridview";

import { useI18n } from "@/i18n/useI18n";
import { SysUserData } from "@packages/types";
import { useSetAtom } from "jotai";

import { nanoid } from "nanoid";
import { LinkCell } from "@packages/ui/link-cell";
import {
  avatar,
  dataFormAtom,
  flagEdit,
  showDetail,
  showPopup,
  viewingDataAtom,
} from "@/pages/User_Mananger/components/store";
import { useClientgateApi } from "@/packages/api";
import { StatusButton } from "@/packages/ui/status-button";
import { filterByFlagActive } from "@/packages/common";

interface UseDealerGridColumnsProps {
  onShowDetail: any;
  data?: any;
}

export const useColumn = ({
  onShowDetail,
  data,
}: UseDealerGridColumnsProps) => {
  const setPopupVisible = useSetAtom(showPopup);
  const setShowDetail = useSetAtom(showDetail);
  const api = useClientgateApi();
  const setDataForm = useSetAtom(dataFormAtom);
  const setAvt = useSetAtom(avatar);
  const setFlag = useSetAtom(flagEdit);

  const viewRow = async (rowIndex: number, data: any) => {
    setShowDetail(true);
    setFlag(false);
    const resp = await api.Sys_User_Data_GetByUserCode(data.UserCode);
    if (resp.isSuccess) {
      setAvt(resp?.Data?.Lst_Sys_User?.Avatar);
      setDataForm({
        ...resp?.Data?.Lst_Sys_User,
        FlagNNTAdmin:
          resp.Data?.Lst_Sys_User?.FlagNNTAdmin === "1" ? true : false,
        FlagSysAdmin:
          resp.Data?.Lst_Sys_User?.FlagSysAdmin === "1" ? true : false,
        DepartmentName: resp.Data?.Lst_Sys_UserMapDepartment?.map(
          (item: any) => item.DepartmentCode
        ),
        GroupName: resp.Data?.Lst_Sys_UserInGroup?.map(
          (item: any) => item.GroupCode
        ),
      });
    }
    setPopupVisible(true);
  };

  const { t } = useI18n("BlackList");

  const columns: ColumnOptions[] = [
    {
      dataField: "Number",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("Number"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      cellRender: ({ data, rowIndex, value }: any) => {
        return (
          <LinkCell
            key={nanoid()}
            onClick={() => onShowDetail(rowIndex, data)}
            value={value}
          />
        );
      },
    },
    {
      dataField: "Remark",
      editorOptions: {
        readOnly: true,
      },
      filterType: "exclude",
      caption: t("Remark"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },

    {
      dataField: "CreateDTimeDesc",
      editorOptions: {
        readOnly: true,
      },
      filterType: "exclude",
      caption: t("CreateDTimeDesc"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },
    {
      dataField: "Enabled",
      editorOptions: {
        readOnly: true,
      },
      headerFilter: {
        dataSource: filterByFlagActive(data ?? [], {
          true: t("Active"),
          false: t("Inactive"),
        }),
      },
      filterType: "exclude",
      caption: t("Enabled"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      cellRender: ({ data }: any) => {
        return <StatusButton key={nanoid()} isActive={data.Enabled} />;
      },
    },
    // {
    //   dataField: "Extension",
    //   editorOptions: {
    //     readOnly: true,
    //   },
    //   filterType: "exclude",
    //   caption: t("Extension"),
    //   width: 118,
    //   alignment: "center",
    //   columnIndex: 1,
    //   groupKey: "BASIC_INFORMATION",
    //   visible: true,
    // },
    // {
    //   dataField: "DepartmentName",
    //   editorOptions: {
    //     readOnly: true,
    //   },
    //   filterType: "exclude",
    //   caption: t("DepartmentName"),
    //   columnIndex: 1,
    //   groupKey: "BASIC_INFORMATION",
    //   visible: true,
    // },
    // {
    //   dataField: "GroupName",
    //   editorOptions: {
    //     readOnly: true,
    //   },
    //   filterType: "exclude",
    //   caption: t("GroupName"),
    //   columnIndex: 1,
    //   groupKey: "BASIC_INFORMATION",
    //   visible: true,
    // },
    // {
    //   dataField: "AuthorizeDTimeStart",
    //   editorOptions: {
    //     readOnly: true,
    //   },
    //   filterType: "exclude",
    //   caption: t("AuthorizeDTimeStart"),
    //   columnIndex: 1,
    //   groupKey: "BASIC_INFORMATION",
    //   visible: true,
    // },
    // {
    //   dataField: "FlagActive",
    //   caption: t("Status"),
    //   editorType: "dxSwitch",
    //   columnIndex: 2,
    //   headerFilter: {
    //     dataSource: filterByFlagActive(data ?? [], {
    //       true: t("Active"),
    //       false: t("Inactive"),
    //     }),
    //   },
    //   filterType: "exclude",
    //   groupKey: "BASIC_INFORMATION",
    //   visible: true,
    //   cellRender: ({ data }: any) => {
    //     return <StatusButton key={nanoid()} isActive={data.FlagActive} />;
    //   },
    // },
  ];
  // return array of the first item only

  return columns;
};
