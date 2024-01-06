import { useI18n } from "@/i18n/useI18n";
import { GridViewPopup } from "@/packages/ui/base-gridview";
import { Popup } from "devextreme-react";
import { useAtom } from "jotai";
import { match } from "ts-pattern";
import "./popup-result.scss";
import { detailAtom } from "./use-columns";
import { GridViewCustomize } from "@/packages/ui/base-gridview/gridview-customize";

const PopupResult = () => {
  const { t } = useI18n("SvImpAudioAnalysisPage_Result");

  const [detail, setDetail] = useAtom(detailAtom);

  const handleClose = () => {
    setDetail(null);
  };

  const renderResult = match(detail?.type)
    .with("AUDIOTOSOUNDVALUE", () => {
      const columns = [
        {
          dataField: "Second", // Tên ngân hàng
          caption: t("Second"),
        },

        {
          dataField: "FreqMin", // Tên ngân hàng
          caption: t("FreqMin"),
        },

        {
          dataField: "FreqMax", // Tên ngân hàng
          caption: t("FreqMax"),
        },
        {
          dataField: "FreqAverage", // Tên ngân hàng
          caption: t("FreqAverage"),
        },
        {
          dataField: "DecibelMin", // Tên ngân hàng
          caption: t("DecibelMin"),
        },

        {
          dataField: "DecibelMax", // Tên ngân hàng
          caption: t("DecibelMax"),
        },
        {
          dataField: "DecibelAverage", // Tên ngân hàng
          caption: t("DecibelAverage"),
        },
      ];

      const list = JSON.parse(detail?.AnalysisResultClient ?? "[]");

      return (
        <div className="popup-result w-full h-full ">
          <GridViewCustomize
            isLoading={false}
            dataSource={list?.map((item: any) => {
              return {
                Second: !isNaN(item?.Second)
                  ? Number(item?.Second).toFixed(2)
                  : "",
                DecibelMax: !isNaN(item?.DecibelMax)
                  ? Number(item?.DecibelMax).toFixed(2)
                  : "",
                DecibelAverage: !isNaN(item?.DecibelAverage)
                  ? Number(item?.DecibelAverage).toFixed(2)
                  : "",
                DecibelMin: !isNaN(item?.DecibelMin)
                  ? Number(item?.DecibelMin).toFixed(2)
                  : "",
                FreqMax: !isNaN(item?.FreqMax)
                  ? Number(item?.FreqMax).toFixed(2)
                  : "",
                FreqAverage: !isNaN(item?.FreqAverage)
                  ? Number(item?.FreqAverage).toFixed(2)
                  : "",
                FreqMin: !isNaN(item?.FreqMin)
                  ? Number(item?.FreqMin).toFixed(2)
                  : "",
              };
            })}
            columns={columns}
            keyExpr={"AudioId"}
            allowInlineEdit={false}
            popupSettings={{}}
            formSettings={{}}
            onReady={(ref) => {}}
            allowSelection={true}
            onSelectionChanged={() => {}}
            onSaveRow={() => {}}
            onEditorPreparing={() => {}}
            onEditRow={() => {}}
            onEditRowChanges={() => {}}
            onDeleteRows={() => {}}
            storeKey={"SvImpAudioAnalysisPage_Result-columns"}
            height={500}
            editable={false}
            checkboxMode="none"
            defaultPageSize={10000}
          />
        </div>
      );
    })
    .with("SPEECHTOTEXT", () => {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: detail?.AnalysisResultClient }}
          className="text-base italic"
        ></div>
      );
    })
    .otherwise(() => <></>);

  return (
    <Popup
      visible={detail}
      showCloseButton
      hideOnOutsideClick
      onHidden={handleClose}
      title={` ${t(`Result process: `)} ${detail?.AudioId}`}
      width={900}
      height={500}
    >
      {renderResult}
    </Popup>
  );
};

export default PopupResult;
