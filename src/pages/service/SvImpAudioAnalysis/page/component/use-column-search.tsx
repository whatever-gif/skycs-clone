import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
import { requiredType } from "@packages/common/Validation_Rules";
import { Mst_CustomerGroupData } from "@packages/types";
import { ColumnOptions } from "@packages/ui/base-gridview";

interface useColumnProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const useColumnSearch = () => {
  const { t } = useI18n("SvImpAudioAnalysis_Column");

  const navigate = useNetworkNavigate();

  const handleOpenDetail = (value: any) => {
    navigate(`/service/SvImpAudioAnalysis/${value}`);
  };

  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "AudioAnalysisCode", // Tên loại chiến dịch
      caption: t("AudioAnalysisCode"),
      editorType: "dxTextBox",
      validationRules: [requiredType],
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data, rowIndex, value }) => {
        return (
          <div
            className="cursor-pointer text-[#00703c]"
            onClick={() => handleOpenDetail(data.AudioAnalysisCode)}
          >
            {data.AudioAnalysisCode}
          </div>
        );
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CreateDTimeUTC", // Tên ngân hàng
      caption: t("CreateDTimeUTC"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CreateBy", // Tên ngân hàng
      caption: t("CreateBy"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TotalAudio", // Tên ngân hàng
      caption: t("TotalAudio"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TotalAudioAnalysisTime", // Tên ngân hàng
      caption: t("TotalAudioAnalysisTime"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TotalAudioAnalysisOk", // Tên ngân hàng
      caption: t("TotalAudioAnalysisOk"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TotalAudioAnalysisOkTime", // Tên ngân hàng
      caption: t("TotalAudioAnalysisOkTime"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "SvImprvName", // Mô t ả
      caption: t("SvImprvName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "msiitp_SvImprvItTypeName", // Mô tả
      caption: t("msiitp_SvImprvItTypeName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
  ];
  // return array of the first item only

  return columns;
};
