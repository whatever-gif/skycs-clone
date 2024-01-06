import { useI18n } from "@/i18n/useI18n";
import { LinkCell } from "@/packages/ui/link-cell";

export const useColumn = () => {
  const array = [
    "Agent",
    "Số máy lẻ",
    "Tổng cuộc gọi",
    "Cuộc gọi đã phân tích",
    "Kính ngữ",
    "Từ ngữ không phù hợp",
  ];

  const { t } = useI18n("Analysis_ContentCall");

  const columnsFormArray = array.map((item) => {
    if (item === "Kính ngữ") {
      return {
        dataField: item,
        editorOptions: {
          readOnly: true,
        },
        caption: t(`${item}`),
        columnIndex: 1,
        visible: true,
        columns: [
          {
            dataField: "Số cuộc gọi",
            editorOptions: {
              readOnly: true,
            },
            caption: "Số cuộc gọi",
            columnIndex: 1,
            visible: true,
          },
          {
            dataField: "tỉ lệ cuộc gọi",
            editorOptions: {
              readOnly: true,
            },
            caption: "tỉ lệ cuộc gọi",
            columnIndex: 1,
            visible: true,
          },
        ],
      };
    }

    if (item === "Từ ngữ không phù hợp") {
      return {
        dataField: item,
        editorOptions: {
          readOnly: true,
        },
        caption: t(`${item}`),
        columnIndex: 1,
        visible: true,
        columns: [
          {
            dataField: "Số cuộc gọi không phù hợp",
            editorOptions: {
              readOnly: true,
            },
            caption: "Số cuộc gọi không phù hợp",
            columnIndex: 1,
            visible: true,
          },
          {
            dataField: "tỉ lệ cuộc gọi không phù hợp",
            editorOptions: {
              readOnly: true,
            },
            caption: "tỉ lệ cuộc gọi không phù hợp",
            columnIndex: 1,
            visible: true,
          },
        ],
      };
    }

    return {
      dataField: item,
      editorOptions: {
        readOnly: true,
      },
      caption: t(`${item}`),
      columnIndex: 1,
      visible: true,
    };
  });

  return columnsFormArray;
};
