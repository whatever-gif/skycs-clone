import PermissionContainer from "@/components/PermissionContainer";
import { getYearMonthDate } from "@/components/ulti";
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
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { getDMY } from "@/utils/time";
import { useQuery } from "@tanstack/react-query";
import { Button, LoadPanel, Popup } from "devextreme-react";
import { useAtom, useSetAtom } from "jotai";
import { customAlphabet } from "nanoid";
import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import "./components/base.scss";
import { CustomSearch } from "./components/custom-search";
import CustomType from "./components/custom-type";
import SaveNamePopup from "./components/name-popup";
import {
  openDetailAtom,
  useColumn,
  userCodeAtom,
} from "./components/use-columns";
import { useDenyColumn } from "./components/use-columns-deny";
import {
  dtlContentAtom,
  openDtlContentAtom,
  useColumnDetail,
} from "./components/use-columns-detail";
import { useHonorificColumn } from "./components/use-columns-honorific";

const RptCallAnalysisByContent = () => {
  const { t } = useI18n("RptCallAnalysisByContent");
  const { t: placeholder } = useI18n("Placeholder");
  const { t: error } = useI18n("ErrorMessage");
  const { t: common } = useI18n("Common");
  const { t: common_status } = useI18n("Common_AudioAnalysis");
  const { t: validate } = useI18n("Validate");
  const nameRef: any = useRef();

  const [openDetail, setOpenDetail] = useAtom(openDetailAtom);
  const [openDtlContent, setopenDtlContent] = useAtom(openDtlContentAtom);

  const [userCode, setUserCode] = useAtom(userCodeAtom);
  const [dtlContent, setDtlContent] = useAtom(dtlContentAtom);

  const handleClose = () => {
    setOpenDetail(false);
    setUserCode(null);
  };

  const handleCloseDtlContent = () => {
    setopenDtlContent(false);
    setDtlContent(null);
  };

  let gridRef: any = useRef();

  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);

  const { auth } = useAuth();

  const api = useClientgateApi();

  const columns: any = useColumn();

  const popupSettings = {};
  const formSettings = {};

  const handleSelectionChanged = (e: any) => {
    console.log(e);
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

  const onReady = (ref: any) => (gridRef = ref);

  const ref_1: any = useRef();
  const ref_2: any = useRef();

  const [currentValue, setCurrentValue] = useState<any>({
    AnalysisSourceCode: "",
    CallTypeConditionList: [],
    BizRefCodeConditionList: [],
    StartDTime: [new Date().setDate(1), new Date()],
    OrgIDRpt: auth?.orgData?.Id.toString(),
    UserCodeConditionList: [],
    DataSource: undefined,
    DetailDataSource: [],
    // searched: false,
  });

  const [currentCode, setCurrentCode] = useState<any>({
    SvImprvCodeSys: "",
    // searched: false,
  });

  const { data: getData, isLoading }: any = useQuery(
    ["getDataCallContent", currentValue, currentCode],
    async () => {
      if (!currentValue.DataSource || !currentCode.SvImprvCodeSys) {
        return {
          Lst_Rpt_CallAnalysis_ByContent: [],
          Lst_Rpt_CallAnalysis_ByContentDtl: [],
        };
      }

      const resp: any = await api.RptCallAnalysis_RptCallAnalysisByContent({
        SvImprvCodeSys: currentCode.SvImprvCodeSys,
        AnalysisSourceCode: currentValue.AnalysisSourceCode,
        CallTypeConditionList: match(currentValue.DataSource)
          .with("INCOMINGCALL", () => "1")
          .with("OUTGOINGCALL", () => "2")
          .with("ALL", () => "1,2")
          .otherwise(() => ""),
        BizRefCodeConditionList: "",
        StartDTimeFrom: currentValue?.StartDTime[0]
          ? `${getYearMonthDate(
              new Date(currentValue?.StartDTime[0])
            )} 00:00:00`
          : "",
        StartDTimeTo: currentValue?.StartDTime[1]
          ? `${getYearMonthDate(
              new Date(currentValue?.StartDTime[1])
            )} 23:59:59`
          : "",
        OrgIDRpt: currentValue.OrgIDRpt,
        UserCodeConditionList:
          currentValue?.UserCodeConditionList?.length > 0
            ? currentValue?.UserCodeConditionList?.join(",")
            : "",
      });

      if (resp.isSuccess) {
        return resp?.Data;
      } else {
        showError({
          message: resp._strErrCode,
          _strErrCode: resp._strErrCode,
          _strTId: resp._strTId,
          _strAppTId: resp._strAppTId,
          _objTTime: resp._objTTime,
          _strType: resp._strType,
          _dicDebug: resp._dicDebug,
          _dicExcs: resp._dicExcs,
        });
      }
    }
  );

  const handleTrigger = () => {
    ref_1?.current?.click();
    ref_2?.current?.click();

    // handleSubmit();
  };

  const columnDetail = useColumnDetail();

  const handleExportDetail = () => {};

  const tableDetail = useMemo(() => {
    return (
      <GridViewPopup
        isLoading={isLoading}
        dataSource={
          getData?.Lst_Rpt_CallAnalysis_ByContentDtl?.filter(
            (item: any) => item.ExtId == userCode?.ExtId
          )?.filter((item: any) => {
            if (userCode?.type == "Honorific") {
              return item.FlagIsHonorificFail == "1";
            }

            if (userCode?.type == "Deny") {
              return item.FlagIsDenyWordFail == "1";
            }
          }) ?? []
        }
        columns={columnDetail}
        keyExpr={"CallId"}
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
        storeKey={"RptCallAnalysisByContent-detail-search"}
        editable={false}
        checkboxMode="none"
        toolbarItems={[
          {
            toolbar: "bottom",
            location: "before",
            widget: "dxButton",
            visible:
              getData?.Lst_Rpt_CallAnalysis_ByContentDtl?.filter(
                (item: any) => item.UserCode == userCode
              ).length > 0,
            options: {
              text: common("Export Excel"),
              stylingMode: "contained",
              type: "default",
              onClick: handleExportDetail,
            },
          },
        ]}
      />
    );
  }, [getData, userCode]);

  const honorificColumns = useHonorificColumn();
  const denyColumns = useDenyColumn();

  const tabContent = useMemo(() => {
    const dataSource = match(dtlContent?.type)
      .with("Honorific", () =>
        getData?.Lst_Rpt_CallAnalysis_ByContentHonorific?.filter(
          (item: any) =>
            item.ExtId == dtlContent?.ExtId && item.CallId == dtlContent?.CallId
        )
      )
      .with("Deny", () =>
        getData?.Lst_Rpt_CallAnalysis_ByContentDenyWord?.filter(
          (item: any) =>
            item.ExtId == dtlContent?.ExtId && item.CallId == dtlContent?.CallId
        )
      )
      .otherwise(() => []);

    return (
      <div className="flex flex-col gap-2">
        <div>
          {t("Agent")}: {dtlContent?.UserName}
        </div>
        <div>
          {dtlContent?.type == "Honorific"
            ? t("List Honorific")
            : t("List Deny")}{" "}
          ({dataSource?.length})
        </div>
        <GridViewPopup
          isLoading={isLoading}
          dataSource={dataSource ?? []}
          columns={
            dtlContent?.type == "Honorific" ? honorificColumns : denyColumns
          }
          keyExpr={"Idx"}
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
          storeKey={"Lst_Rpt_CallAnalysis_ByContentHonorific-search"}
          editable={false}
          checkboxMode="none"
          height={350}
        />
      </div>
    );
  }, [getData, dtlContent]);

  const height = useWindowSize().height;

  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const handleOpenSave = () => {
    handleOpen();
  };

  const handleOpen = () => {
    if (!currentValue.DataSource || !currentCode.SvImprvCodeSys) {
      return;
    }
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleSave = async () => {
    const name = nameRef?.current?.props?.defaultValue;

    if (!currentValue.DataSource || !currentCode.SvImprvCodeSys) {
      return;
    }

    if (!name) {
      return;
    }

    const apb = "0123456789";

    const genCode = customAlphabet(apb, 8);

    const Rpt_CallAnalysis = {
      RptCallAnalysisCodeSys: `Rpt_Content_${genCode()}`,
      RptCallAnalysisType: "RPTCALLANALYSISBYCONTENT",
      RptCallAnalysisName: name,
      SvImprvCodeSys: currentCode.SvImprvCodeSys,
      AnalysisSourceCode: currentValue.AnalysisSourceCode,
      CallTypeConditionList: match(currentValue.DataSource)
        .with("INCOMINGCALL", () => "1")
        .with("OUTGOINGCALL", () => "2")
        .with("ALL", () => "1,2")
        .otherwise(() => ""),
      BizRefCodeConditionList: "",
      StartDTimeFrom: currentValue?.StartDTime[0]
        ? `${getYearMonthDate(new Date(currentValue?.StartDTime[0]))} 00:00:00`
        : "",
      StartDTimeTo: currentValue?.StartDTime[1]
        ? `${getYearMonthDate(new Date(currentValue?.StartDTime[1]))} 23:59:59`
        : "",
      OrgIDRpt: currentValue.OrgIDRpt,
      UserCodeConditionList:
        currentValue?.UserCodeConditionList?.length > 0
          ? currentValue?.UserCodeConditionList?.join(",")
          : "",
    };

    const param = {
      Rpt_CallAnalysis,
      Lst_Rpt_CallAnalysis_ByContent:
        getData?.Lst_Rpt_CallAnalysis_ByContent ?? [],
      Lst_Rpt_CallAnalysis_ByContentDtl:
        getData?.Lst_Rpt_CallAnalysis_ByContentDtl ?? [],
    };

    const resp: any = await api.RptCallAnalysis_Save(param);

    if (resp.isSuccess) {
      toast.success(common("Save successfully!"));
    } else {
      showError({
        message: resp._strErrCode,
        _strErrCode: resp._strErrCode,
        _strTId: resp._strTId,
        _strAppTId: resp._strAppTId,
        _objTTime: resp._objTTime,
        _strType: resp._strType,
        _dicDebug: resp._dicDebug,
        _dicExcs: resp._dicExcs,
      });
    }
  };

  return (
    <AdminContentLayout
      className={"RptCallAnalysisByContent h-full w-full rpt-container"}
    >
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header flex justify-between items-center w-full px-2">
          <div className="font-semibold">{t("RptCallAnalysisByContent")}</div>
          <div className="flex">
            <PermissionContainer
              permission={"BTN_RPT_PHAN_TICH_NOI_DUNG_CUOC_GOI_EXPORT_EXCEL"}
            >
              <Button
                style={{
                  padding: 10,
                  margin: "10px 5px",
                  background: "#00703C",
                  color: "white",
                }}
              >
                {common("Export Excel")}
              </Button>
            </PermissionContainer>
            <PermissionContainer
              permission={"BTN_RPT_PHAN_TICH_NOI_DUNG_CUOC_GOI_LUU_RPT"}
            >
              <Button
                style={{
                  padding: 10,
                  margin: "10px 5px",
                  background: "#00703C",
                  color: "white",
                }}
                onClick={handleOpenSave}
              >
                {common("Save Report")}
              </Button>
            </PermissionContainer>
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout searchPermissionCode="">
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <CustomSearch
              handleTrigger={handleTrigger}
              ref={ref_1}
              setFormValue={setCurrentValue}
              formValue={currentValue}
              // refSubmitButton={refSubmitButton}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <div className="w-full h-full d-flex-col pb-2">
              <Button
                className="btn-search"
                icon={"/images/icons/search.svg"}
                onClick={handleToggleSearchPanel}
              />

              <CustomType
                ref={ref_2}
                setFormValue={setCurrentCode}
                formValue={currentCode}
              />

              {!currentValue.DataSource || !currentCode.SvImprvCodeSys ? (
                <> </>
              ) : (
                <>
                  <GridViewCustomize
                    nameFile={
                      t("Phân tích nội dung cuộc gọi") +
                      `${getDMY(new Date(Date.now()))}`
                    }
                    permissionExport=""
                    visibleExport={true}
                    isLoading={isLoading}
                    dataSource={getData?.Lst_Rpt_CallAnalysis_ByContent ?? []}
                    columns={columns}
                    keyExpr={"UserCode"}
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
                    storeKey={"RptCallAnalysisByContent-search"}
                    cssClass="Tab_CallHistoryAgent"
                    customerHeight={height - 200}
                    isHiddenCheckBox
                  />
                </>
              )}
            </div>

            <Popup
              visible={openDetail}
              title={`${t("RptCallAnalysisByContent Detail")}`}
              showCloseButton
              hideOnOutsideClick
              onHidden={handleClose}
            >
              {tableDetail}
            </Popup>

            <Popup
              visible={openDtlContent}
              titleRender={() => {
                return (
                  <div className="font-semibold text-lg">
                    {t("CallId")}: {dtlContent?.CallId}
                  </div>
                );
              }}
              hideOnOutsideClick
              onHidden={handleCloseDtlContent}
              showCloseButton
              width={600}
              height={500}
              toolbarItems={[
                {
                  toolbar: "bottom",
                  location: "center",
                  widget: "dxButton",
                  visible: true,
                  options: {
                    text: common("Cancel"),
                    stylingMode: "contained",
                    type: "default",
                    onClick: handleCloseDtlContent,
                  },
                },
              ]}
            >
              {tabContent}
            </Popup>

            <SaveNamePopup
              openPopup={openPopup}
              handleClosePopup={handleClosePopup}
              handleSave={handleSave}
              ref={nameRef}
            />

            <LoadPanel visible={isLoading} />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default RptCallAnalysisByContent;
