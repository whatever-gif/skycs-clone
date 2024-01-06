import { useI18n } from "@/i18n/useI18n";
import { LinkCell } from "@/packages/ui/link-cell";

interface Props {
  handleOpenCi: (data: any) => void;
  handleOpenDi: (data: any) => void;
}

export const useColumn = ({ handleOpenCi, handleOpenDi }: Props) => {
  const array = [
    "Agent",
    "Số máy lẻ",
    "Mã cuộc gọi",
    "Thời điểm gọi",
    "Mã KH",
    "Tên KH",
    "SĐT khách hàng",
    "File ghi âm",
    "Kính ngữ",
    "Từ ngữ không phù hợp",
    "Loại cuộc gọi",
    "Nghiệp vụ liên quan",
    "Mã nghiệp vụ liên quan",
  ];

  const { t } = useI18n("Rpt_PopUpDetail_2");

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
        cellRender: (data: any) => {
          return (
            <LinkCell
              onClick={() => handleOpenCi(data)}
              value={data.displayValue}
            ></LinkCell>
          );
        },
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
        cellRender: (data: any) => {
          return (
            <LinkCell
              onClick={() => handleOpenDi(data)}
              value={data.displayValue}
            ></LinkCell>
          );
        },
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
