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
import { useQuery } from "@tanstack/react-query";
import { Button, LoadPanel, Popup } from "devextreme-react";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";

import PermissionContainer from "@/components/PermissionContainer";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";
import { getDMY } from "@/utils/time";
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

const RptCallAnalysisBySoundValueFreq = () => {
  const { t } = useI18n("RptCallAnalysisBySoundValueFreq");
  const { t: placeholder } = useI18n("Placeholder");
  const { t: error } = useI18n("ErrorMessage");
  const { t: common } = useI18n("Common");
  const { t: common_status } = useI18n("Common_AudioAnalysis");
  const { t: validate } = useI18n("Validate");
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

  const handleSelectionChanged = (e: any) => {};
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

      const resp: any =
        await api.RptCallAnalysis_RptCallAnalysisBySoundValueFreq({
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
    const dataSource =
      getData?.Lst_Rpt_CallAnalysis_BySoundValueDtl?.filter(
        (item: any) => item.UserCode == userCode?.UserCode
      ) ?? [];

    return (
      <GridViewPopup
        isLoading={isLoading}
        dataSource={dataSource}
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
        storeKey={"RptCallAnalysisBySoundValueFreq-search"}
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

    const genCode = customAlphabet(apb, 8);

    const Rpt_CallAnalysis = {
      RptCallAnalysisCodeSys: `Rpt_Freq_${genCode()}`,
      RptCallAnalysisType: "RPTCALLANALYSISBYSOUNDVALUEFREQ",
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
      Lst_Rpt_CallAnalysis_BySoundValue:
        getData?.Lst_Rpt_CallAnalysis_BySoundValue ?? [],
      Lst_Rpt_CallAnalysis_BySoundValueDtl:
        getData?.Lst_Rpt_CallAnalysis_BySoundValueDtl ?? [],
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

  const handleExportGrid = (e: any) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Companies");

    worksheet.columns = [
      { width: 5 },
      { width: 30 },
      { width: 25 },
      { width: 15 },
      { width: 25 },
      { width: 40 },
    ];

    exportDataGrid({
      component: e.component,
      worksheet,
      keepColumnWidths: false,
      topLeftCell: { row: 2, column: 2 },
      customizeCell: ({ gridCell, excelCell }: any) => {
        // if (gridCell.rowType === "data") {
        //   if (gridCell.column.dataField === "Phone") {
        //     excelCell.value = parseInt(gridCell.value, 10);
        //     excelCell.numFmt = "[<=9999999]###-####;(###) ###-####";
        //   }
        //   if (gridCell.column.dataField === "Website") {
        //     excelCell.value = {
        //       text: gridCell.value,
        //       hyperlink: gridCell.value,
        //     };
        //     excelCell.font = { color: { argb: "FF0000FF" }, underline: true };
        //     excelCell.alignment = { horizontal: "left" };
        //   }
        // }
        if (gridCell.rowType === "group") {
          excelCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "BEDFE6" },
          };
        }
        if (gridCell.rowType === "totalFooter" && excelCell.value) {
          excelCell.font.italic = true;
        }
      },
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer: any) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "Companies.xlsx"
        );
      });
    });
  };

  const ref: any = useRef();

  const handleExport = () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Main sheet");

    exportDataGrid({
      component: ref?.current?._instance,
      worksheet: worksheet,
      customizeCell: function (options) {
        options.excelCell.font = { name: "Arial", size: 12 };
        options.excelCell.alignment = { horizontal: "left" };
      },
    }).then(function () {
      workbook.xlsx.writeBuffer().then(function (buffer) {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "DataGrid.xlsx"
        );
      });
    });
  };

  return (
    <AdminContentLayout
      className={"RptCallAnalysisBySoundValueFreq h-full w-full rpt-container"}
    >
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header flex justify-between items-center w-full px-2">
          <div className="font-semibold">
            {t("RptCallAnalysisBySoundValueFreq")}
          </div>
          <div className="flex">
            <PermissionContainer
              permission={"BTN_RPT_PHAN_TICH_TAN_SO_(HZ)_EXPORT_EXCEL"}
            >
              <Button
                style={{
                  padding: 10,
                  margin: "10px 5px",
                  background: "#00703C",
                  color: "white",
                }}
                onClick={handleExport}
              >
                {common("Export Excel")}
              </Button>
            </PermissionContainer>
            <PermissionContainer
              permission={"BTN_RPT_PHAN_TICH_AM_LUONG_(DB)_LUU_RPT"}
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
                    isLoading={isLoading}
                    dataSource={
                      getData?.Lst_Rpt_CallAnalysis_BySoundValue ?? []
                    }
                    customerHeight={"auto"}
                    nameFile={
                      t("Phân tích tần số âm thanh cuộc gọi") +
                      `${getDMY(new Date(Date.now()))}`
                    }
                    permissionExport=""
                    visibleExport={true}
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
                    storeKey={"RptCallAnalysisBySoundValueFreq-search"}
                    editable={false}
                    checkboxMode="none"
                    handleExport={handleExportGrid}
                    ref={ref}
                  />
                </>
              )}
            </div>

            <Popup
              visible={openDetail}
              title={`${t("RptCallAnalysisBySoundValueFreq Detail")}`}
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

export default RptCallAnalysisBySoundValueFreq;
