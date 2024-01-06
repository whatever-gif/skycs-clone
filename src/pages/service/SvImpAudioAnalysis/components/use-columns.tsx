import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
import { getCurrentUserTime } from "@/utils/time";
import { requiredType } from "@packages/common/Validation_Rules";
import { Mst_CustomerGroupData } from "@packages/types";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { AudioStatus } from "./AudioStatus";

interface useColumnProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const useColumn = () => {
  const { t } = useI18n("SvImpAudioAnalysis_Column");

  const navigate = useNetworkNavigate();

  const handleOpenDetail = (value: any) => {
    navigate(`/service/SvImpAudioAnalysis/${value}`);
  };

  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "AudioAnalysisCode",
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
      dataField: "CreateDTimeUTC",
      caption: t("CreateDTimeUTC"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data }: any) => {
        return getCurrentUserTime(data?.CreateDTimeUTC);
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CreateBy",
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
      dataField: "TotalAudio",
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
      dataField: "TotalAudioAnalysisTime",
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
      dataField: "TotalAudioAnalysisOk",
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
      dataField: "TotalAudioAnalysisOkTime",
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
      dataField: "AudioAnalysisStatus",
      caption: t("AudioAnalysisStatus"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      width: 200,
      cellRender: ({ data }: any) => {
        return <AudioStatus content={data.AudioAnalysisStatus} />;
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TotalAudioAnalysisFail",
      caption: t("TotalAudioAnalysisFail"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TotalAudioAnalysisFailTime",
      caption: t("TotalAudioAnalysisFailTime"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TotalAudioAnalysisRemain",
      caption: t("TotalAudioAnalysisRemain"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "TotalAudioAnalysisRemainTime",
      caption: t("TotalAudioAnalysisRemainTime"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      visible: false,
    },
  ];

  return columns;
};
