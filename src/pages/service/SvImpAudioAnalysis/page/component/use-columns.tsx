import { useI18n } from "@/i18n/useI18n";
import { Icon } from "@/packages/ui/icons";
import { getCurrentUserTime } from "@/utils/time";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { atom, useAtom } from "jotai";
import { AudioStatus } from "../../components/AudioStatus";

export const detailAtom = atom<any>(null);

export const useColumn = ({ type }: any) => {
  const { t } = useI18n("SvImpAudioAnalysis_Column");

  const [detail, setDetail] = useAtom(detailAtom);

  const handleOpenDetail = (code: any) => {
    setDetail(code);
  };

  const columns: ColumnOptions[] = [
    {
      dataField: "AudioId", // Tên ngân hàng
      caption: t("AudioId"),
      editorType: "dxTextBox",
      visible: true,
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      dataField: "CallId", // Tên ngân hàng
      caption: t("CallId"),
      editorType: "dxTextBox",
      visible: true,
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      dataField: "TalkDTime", // Tên ngân hàng
      caption: t("TalkDTime"),
      editorType: "dxTextBox",
      visible: true,
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data }: any) => {
        return getCurrentUserTime(data?.StartDTime);
      },
    },
    {
      dataField: "suag_UserName", // Tên ngân hàng
      caption: t("suag_UserName"),
      editorType: "dxTextBox",
      visible: true,
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      dataField: "CustomerName", // Tên ngân hàng
      caption: t("CustomerName"),
      editorType: "dxTextBox",
      visible: true,
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      dataField: "RecFilePathFull", // Tên ngân hàng
      caption: t("RecFilePathFull"),
      editorType: "dxTextBox",
      visible: true,
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
      cellRender: ({ data }: any) => {
        if (data.RecFilePathFull) {
          return (
            <Icon
              name="headphone"
              className="cursor-pointer"
              onClick={() => {
                window.open(data.RecFilePathFull);
              }}
            ></Icon>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      dataField: "TalkTimeToMinutes", // Tên ngân hàng
      caption: t("TalkTimeToMinutes"),
      editorType: "dxTextBox",
      visible: true,
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      dataField: "TalkTime", // Tên ngân hàng
      caption: t("TalkTime"),
      editorType: "dxTextBox",
      visible: true,
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
      columnIndex: 1,
    },
    {
      dataField: "AudioAnalysisStatusDtl", // Mô t ả
      caption: t("AudioAnalysisStatusDtl"),
      visible: false,
      columnIndex: 1,
      cellRender: ({ data }: any) => {
        return <AudioStatus content={data.AudioAnalysisStatusDtl} />;
      },
    },
    {
      dataField: "AnalysisResultClient", // Mô t ả
      caption: t("AnalysisResultClient"),
      visible: false,
      columnIndex: 1,
      width: 300,
      cellRender: ({ data }: any) => {
        return (
          <p
            className="cursor-pointer text-[#00703c] line-clamp-1 hover:underline"
            onClick={() =>
              handleOpenDetail({ ...data, type: type ?? undefined })
            }
          >
            {t("AnalysisResultClient")}
          </p>
        );
      },
    },
    {
      dataField: "OrgID", // Tên ngân hàng
      caption: t("OrgID"),
      columnIndex: 1,
      visible: false,
    },
    {
      dataField: "CallType", // Tên ngân hàng
      caption: t("CallType"),
      columnIndex: 1,
      visible: false,
    },
    {
      dataField: "HoldTime", // Tên ngân hàng
      caption: t("HoldTime"),
      columnIndex: 1,
      visible: false,
    },
    {
      dataField: "RemoteNumber", // Tên ngân hàng
      caption: t("RemoteNumber"),
      columnIndex: 1,
      visible: false,
    },
    {
      dataField: "CustomerCodeSys", // Tên ngân hàng
      caption: t("CustomerCodeSys"),
      columnIndex: 1,
      visible: false,
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Related profession",
      caption: t("Related profession"),
      visible: true,
      columnIndex: 1,
      cellRender: ({ data }) => {
        const list = JSON.parse(data?.Json_Call_CallBizRef ?? "[]");

        return list && list[0] ? list[0]?.BizType : "";
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Related business code",
      caption: t("Related business code"),
      visible: true,
      columnIndex: 1,
      cellRender: ({ data }) => {
        const list = JSON.parse(data?.Json_Call_CallBizRef ?? "[]");

        return list && list[0] ? list[0]?.BizRefCode : "";
      },
    },
  ];

  return columns;
};
