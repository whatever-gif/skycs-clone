import PermissionContainer from "@/components/PermissionContainer";
import { getYearMonthDate } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration } from "@/packages/hooks";
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
import { Button, Chart, LoadPanel, Popup } from "devextreme-react";
import { Series } from "devextreme-react/chart";
import { useAtom, useSetAtom } from "jotai";
import { customAlphabet } from "nanoid";
import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import { CustomSearch } from "./components/custom-search";
import CustomType from "./components/custom-type";
import SaveNamePopup from "./components/name-popup";
import {
  openDetailAtom,
  useColumn,
  userCodeAtom,
} from "./components/use-columns";
import { useColumnDetail } from "./components/use-columns-detail";

const RptCallAnalysisByWaitTime = () => {
  const { t } = useI18n("RptCallAnalysisByWaitTime");
  const { t: RP } = useI18n("SvImpAudioAnalysis_Popup");
  const { t: common } = useI18n("Common");
  const nameRef: any = useRef();

  const [openDetail, setOpenDetail] = useAtom(openDetailAtom);
  const [userCode, setUserCode] = useAtom(userCodeAtom);

  const handleClose = () => {
    setOpenDetail(false);
    setUserCode(null);
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
          Lst_Rpt_CallAnalysis_ByTime: [],
          Lst_Rpt_CallAnalysis_ByTimeDtl: [],
        };
      }

      const resp: any = await api.RptCallAnalysis_RptCallAnalysisByWaitTime({
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
          getData?.Lst_Rpt_CallAnalysis_ByTimeDtl?.filter(
            (item: any) => item.UserCode == userCode
          ) ?? []
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
        storeKey={"RptCallAnalysisByWaitTime-search"}
        editable={false}
        checkboxMode="none"
        height={500}
        toolbarItems={[
          {
            toolbar: "bottom",
            location: "before",
            widget: "dxButton",
            visible:
              getData?.Lst_Rpt_CallAnalysis_ByTimeDtl?.filter(
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

  const [openPopup, setOpenPopup] = useState<boolean>(false);

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

    const genCode = customAlphabet(apb, 6);

    const Rpt_CallAnalysis = {
      RptCallAnalysisCodeSys: `RCACS${genCode()}`,
      RptCallAnalysisType: "RPTCALLANALYSISBYWAITTIME",
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
      Lst_Rpt_CallAnalysis_ByTime: getData?.Lst_Rpt_CallAnalysis_ByTime ?? [],
      Lst_Rpt_CallAnalysis_ByTimeDtl:
        getData?.Lst_Rpt_CallAnalysis_ByTimeDtl ?? [],
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

  const handleOpenSave = () => {
    handleOpen();
  };

  return (
    <AdminContentLayout
      className={"RptCallAnalysisByWaitTime h-full w-full rpt-container"}
    >
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header flex justify-between items-center w-full px-2">
          <div className="font-semibold">{t("RptCallAnalysisByWaitTime")}</div>
          <div className="flex">
            <PermissionContainer
              permission={"BTN_RPT_PHAN_TICH_THOI_GIAN_CHO_EXPORT_EXCEL"}
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
              permission={"BTN_RPT_PHAN_TICH_THOI_GIAN_CHO_LUU_RPT"}
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
            <div
              style={{
                height: "85vh",
              }}
            >
              <CustomSearch
                handleTrigger={handleTrigger}
                ref={ref_1}
                setFormValue={setCurrentValue}
                formValue={currentValue}
                // refSubmitButton={refSubmitButton}
              />
            </div>
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot
            name={"ContentPanel"}
            style={{ overflow: "auto" }}
          >
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
                  <Chart
                    id="chart"
                    dataSource={getData?.Lst_Rpt_CallAnalysis_ByTime ?? []}
                  >
                    <Series
                      valueField="TotalFail"
                      argumentField="UserName"
                      name="TotalFail"
                      type="bar"
                      color="#F36B6B"
                      barWidth={50}
                    />
                  </Chart>

                  <GridViewCustomize
                    isLoading={isLoading}
                    nameFile={
                      RP("Phân tích thời gian chờ trong cuộc gọi") +
                      `${getDMY(new Date(Date.now()))}`
                    }
                    customerHeight={"auto"}
                    permissionExport=""
                    visibleExport={true}
                    dataSource={getData?.Lst_Rpt_CallAnalysis_ByTime ?? []}
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
                    storeKey={"RptCallAnalysisByWaitTime-search"}
                    editable={false}
                    // checkboxMode="none"
                  />
                </>
              )}
            </div>

            <Popup
              visible={openDetail}
              title={`${t("RptCallAnalysisByWaitTime Detail")}`}
              showCloseButton
              hideOnOutsideClick
              onHidden={handleClose}
            >
              {tableDetail}
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

export default RptCallAnalysisByWaitTime;
