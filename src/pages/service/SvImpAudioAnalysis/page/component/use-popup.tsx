import {
  getFirstDateOfMonthVerDate,
  getYearMonthDate,
} from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration } from "@/packages/hooks";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@/packages/layouts/content-searchpanel-layout";
import { showErrorAtom } from "@/packages/store";
import { GridViewPopup } from "@/packages/ui/base-gridview";
import { useQuery } from "@tanstack/react-query";
import { Popup } from "devextreme-react";
import { atom, useAtom, useSetAtom } from "jotai";
import { useRef, useState } from "react";
import { CustomSearch } from "./custom-search";
import { useColumn } from "./use-columns";

export const audioPopupAtom = atom<boolean>(false);

const ChooseAudioPopup = ({ addAudio, listCheck }: any) => {
  const { t } = useI18n("SvImpAudioAnalysis_Popup");
  const { t: placeholder } = useI18n("Placeholder");
  const { t: error } = useI18n("ErrorMessage");
  const { t: common } = useI18n("Common");
  const { t: common_status } = useI18n("Common_AudioAnalysis");

  const [count, setCount] = useState<number>(listCheck?.length ?? 0);

  const listStatus = [
    {
      label: common_status("PENDING"),
      value: "PENDING",
    },
    {
      label: common_status("SUCCESSED"),
      value: "SUCCESSED",
    },
    // {
    //   label : common_status("PENDING"),
    //   value : "PENDING"
    // }
  ];

  let gridRef: any = useRef();

  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);

  const { auth } = useAuth();

  const [open, setOpen] = useAtom(audioPopupAtom);

  const [searchCondition, setSearchCondition] = useState<any>({
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    AudioAnalysisCodeSys: "",
    StartDTime: [getFirstDateOfMonthVerDate(Date.now()), new Date(Date.now())],
    CallType: "",
    UserCode: [],
    FlagRecFilePathIsNotNull: 1,
    AudioAnalysisStatus: [],
    OrgIDSearch: auth?.orgData?.Id.toString(),
  });

  const api = useClientgateApi();
  const handleClose = () => {
    setOpen(false);
    setSearchCondition({
      Ft_PageIndex: 0,
      Ft_PageSize: config.MAX_PAGE_ITEMS,
      AudioAnalysisCodeSys: "",
      StartDTime: [null, null],
      CallType: "",
      UserCode: [],
      FlagRecFilePathIsNotNull: 1,
      AudioAnalysisStatus: [],
      OrgIDSearch: auth?.orgData?.Id.toString(),
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const columns = useColumn({ type: null });

  const handleSearch = async (data: any) => {
    setSearchCondition(data);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["SvImpAudioAnalysis_List", searchCondition],
    queryFn: async () => {
      const resp = await api.CallCall_Search({
        CallType:
          searchCondition?.DataSource == "INCOMINGCALL"
            ? "1"
            : searchCondition?.DataSource == "OUTGOINGCALL"
            ? "2"
            : "",
        OrgIDSearch: searchCondition?.OrgIDSearch,
        UserCode:
          searchCondition?.UserCode?.length > 0
            ? searchCondition?.UserCode?.join(",")
            : "",
        StartDTimeFrom: searchCondition?.StartDTime[0]
          ? `${getYearMonthDate(searchCondition?.StartDTime[0])} 00:00:00`
          : "",
        StartDTimeTo: searchCondition?.StartDTime[1]
          ? `${getYearMonthDate(searchCondition?.StartDTime[1])} 23:59:59`
          : "",
        AudioAnalysisStatus:
          searchCondition?.AudioAnalysisStatus?.length > 0
            ? searchCondition?.AudioAnalysisStatus?.join(",")
            : "",
        Ft_PageIndex: searchCondition?.Ft_PageIndex ?? 0,
        Ft_PageSize: searchCondition?.Ft_PageSize ?? config.MAX_PAGE_ITEMS,
        FlagRecFilePathIsNotNull: 1,
      });

      if (resp.isSuccess) {
        return (
          resp?.DataList?.map((item: any) => {
            return {
              ...item,
              TalkTimeToMinutes: Number(item?.TalkTimeToMinutes?.toFixed(2)),
            };
          }) ?? []
        );
      } else {
        showError({
          message: error(resp._strErrCode),
          _strErrCode: resp._strErrCode,
          _strTId: resp._strTId,
          _strAppTId: resp._strAppTId,
          _objTTime: resp._objTTime,
          _strType: resp._strType,
          _dicDebug: resp._dicDebug,
          _dicExcs: resp._dicExcs,
        });
      }
    },
  });

  const popupSettings = {};
  const formSettings = {};

  const { data: listCampaign, isLoading: isLoadingCampaign } = useQuery(
    ["listCpnActive"],
    async () => {
      const resp: any = await api.Cpn_CampaignAgent_GetActive();

      return (
        resp?.Data?.map((item: any) => {
          return {
            value: item?.CampaignCode,
            label: item?.CampaignName,
          };
        }) ?? []
      );
    }
  );

  const { data: listOrg, isLoading: isLoadingOrg } = useQuery(
    ["getListOrg"],
    async () => {
      const resp: any = await api.Mst_NNTController_GetAllActive();

      return resp?.Data?.Lst_Mst_NNT ?? [];
    }
  );

  const { data: listUser, isLoading: isLoadingUser } = useQuery(
    ["getListUser"],
    async () => {
      const resp: any = await api.Sys_User_GetAllActive();

      return resp?.DataList ?? [];
    }
  );

  const handleSelectionChanged = (e: any) => {
    // setCount(e?.length);
  };

  const handleSavingRow = () => {};
  const handleEditorPreparing = () => {};
  const handleOnEditRow = () => {};
  const handleEditRowChanges = () => {};
  const handleDeleteRows = () => {};

  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleSelect = () => {
    const listCheck = gridRef?.current?._instance.getSelectedRowsData();
    addAudio(listCheck);
    handleClose();
  };

  const onReady = (ref: any) => (gridRef = ref);

  const Count = () => {
    return (
      <div>
        {common("Selected")}: {count ?? 0}
      </div>
    );
  };

  return (
    <Popup
      visible={open}
      onHidden={handleClose}
      showCloseButton
      title={`${t("Choose audio")}`}
      width={useWindowSize().width - 100}
      toolbarItems={[
        {
          visible: true,
          widget: "dxButton",
          toolbar: "bottom",
          location: "after",
          options: {
            text: common("Select"),
            type: "primary",
            style: {},
            onClick: handleSelect,
          },
        },
        {
          visible: true,
          widget: "dxButton",
          toolbar: "bottom",
          location: "after",
          options: {
            text: common("Cancel"),
            type: "primary",
            style: {},
            onClick: handleClose,
          },
        },
      ]}
    >
      <AdminContentLayout className={"SvImpAudioAnalysis_Popup  w-full"}>
        <AdminContentLayout.Slot name={"Header"}></AdminContentLayout.Slot>
        <AdminContentLayout.Slot name={"Content"}>
          <ContentSearchPanelLayout searchPermissionCode="">
            <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
              {/* <div className={"w-[200px]"}> */}
              <CustomSearch
                storeKey="SvImpAudioAnalysis_Popup"
                data={searchCondition}
                onSearch={handleSearch}
                height={400}
                dataProps={{
                  listOrg: listOrg ?? [],
                  listUser: listUser ?? [],
                  listCampaign: listCampaign ?? [],
                }}
              />
              {/* </div> */}
            </ContentSearchPanelLayout.Slot>
            <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
              <GridViewPopup
                isLoading={isLoading}
                dataSource={data ?? []}
                columns={columns}
                keyExpr={"AudioId"}
                allowInlineEdit={false}
                popupSettings={popupSettings}
                formSettings={formSettings}
                onReady={onReady}
                allowSelection={true}
                onSelectionChanged={handleSelectionChanged}
                onSaveRow={handleSavingRow}
                onEditorPreparing={handleEditorPreparing}
                onEditRow={handleOnEditRow}
                onEditRowChanges={handleEditRowChanges}
                onDeleteRows={handleDeleteRows}
                storeKey={"SvImpAudioAnalysis_Popup-search"}
                height={480}
                toolbarItems={[
                  {
                    location: "before",
                    widget: "dxButton",
                    options: {
                      icon: "search",
                      onClick: handleToggleSearchPanel,
                    },
                  },
                ]}
                // editable={false}
                defaultSelectedRowKeys={listCheck?.map(
                  (item: any) => item?.AudioId
                )}
                showSelected={true}
              />
            </ContentSearchPanelLayout.Slot>
          </ContentSearchPanelLayout>
        </AdminContentLayout.Slot>
      </AdminContentLayout>
    </Popup>
  );
};

export default ChooseAudioPopup;
