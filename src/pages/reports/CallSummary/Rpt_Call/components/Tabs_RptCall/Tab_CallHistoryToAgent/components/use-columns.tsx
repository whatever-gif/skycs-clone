import { ColumnOptions } from "@packages/ui/base-gridview";
import { useI18n } from "@/i18n/useI18n";
import { Mst_CustomerGroupData } from "@packages/types";

interface UseBankDealerGridColumnsProps {
  data?: Mst_CustomerGroupData[] | any;
}

export const useColumns = ({
  data,
}: // listBankCode,
UseBankDealerGridColumnsProps) => {
  const { t } = useI18n("Rpt_CallHistoryToAgent_Column");
  const columns: ColumnOptions[] = [
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "idx", // Số thứ tự
      caption: t("idx"),
      width: 80,
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
        height: 50,
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Id", // Mã cuộc gọi
      caption: t("Id"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
        height: 50,
      },
    },
    {
      dataField: "CallType",
      caption: t("CallType"), // loại cuộc gọi
      editorType: "dxTextBox",
      alignment: "center",
      groupKey: "BASIC_INFORMATION",
      visible: true,
    },

    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CCNumber", // Số điện thoại tổng đài
      caption: t("CCNumber"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
        height: 50,
      },
    },
    {
      groupKey: "BASIC_INFORMATION", //Số khách hàng
      dataField: "RemoteNumber",
      caption: t("RemoteNumber"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
        height: 50,
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "CustomerName", // Tên khách hàng
      caption: t("CustomerName"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Status", // Trạng thái cuộc gọi
      caption: t("Trạng thái cuộc gọi"),
      editorType: "dxTextBox",
      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
      },
    },
    // {
    //   groupKey: "BASIC_INFORMATION",
    //   dataField: "LastAgent", // Agent
    //   caption: t("LastAgent"),
    //   editorType: "dxTextBox",
    // },
    // {
    //   groupKey: "BASIC_INFORMATION",
    //   dataField: "LastExt", // Số máy lẻ
    //   caption: t("LastExt"),
    //   editorType: "dxTextBox",
    // },
    {
      groupKey: "BASIC_INFORMATION",
      // dataField: "Thời gian của từng agent",
      caption: t("Time of each agent"),
      editorType: "dxTextBox",

      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
        height: 50,
      },
      columns: [
        {
          dataField: "detail_Name", // Agent
          caption: t("detail_ExtId"),
          cellRender: (data: any) => {
            const array = data?.data?.detail_Name
              ? data.data.detail_Name.length
                ? data.data.detail_Name
                : []
              : [];

            return (
              <div>
                {array.map((item: any) => {
                  return <div>{item}</div>;
                })}
              </div>
            );
          },
        },
        {
          dataField: "detail_Number", // Số máy lẻ
          caption: t("detail_Number"),
          cellRender: (data: any) => {
            const array = data?.data?.detail_Number
              ? data.data.detail_Number.length
                ? data.data.detail_Number
                : []
              : [];
            if (data.data.CallType === "Outgoing") {
              return <>{data.data.FromNumber}</>;
            }
            return (
              <div>
                {array.map((item: any) => {
                  return <div>{item}</div>;
                })}
              </div>
            );
          },
        },

        {
          dataField: "detail_RingDTime", // thời gian đổ chuông
          caption: t("detail_RingDTime"),
          cellRender: (data: any) => {
            const array = data?.data?.detail_RingDTime
              ? data.data.detail_RingDTime.length
                ? data.data.detail_RingDTime
                : []
              : [];
            if (data.data.CallType === "Outgoing") {
              return <>{data.data.RingDTime}</>;
            }
            return (
              <div>
                {array.map((item: any) => {
                  return <div>{item}</div>;
                })}
              </div>
            );
          },
        },
        {
          dataField: "detail_EndDTime", // thời gian cúp máy
          caption: t("detail_EndDTime"),
          cellRender: (data: any) => {
            const array = data?.data?.detail_EndDTime
              ? data.data.detail_EndDTime.length
                ? data.data.detail_EndDTime
                : []
              : [];
            return (
              <div>
                {array.map((item: any) => {
                  return <div>{item}</div>;
                })}
              </div>
            );
          },
        },
        {
          dataField: "detail_TalkDTime", // thời điểm nhấc máy
          caption: t("detail_TalkDTime"),
          cellRender: (data: any) => {
            const array = data?.data?.detail_TalkDTime
              ? data.data.detail_TalkDTime.length
                ? data.data.detail_TalkDTime
                : []
              : [];
            return (
              <div>
                {array.map((item: any) => {
                  return <div>{item}</div>;
                })}
              </div>
            );
          },
        },
        {
          dataField: "detail_RingTime", // thời lượng đổ chuông
          caption: t("detail_RingTime"),
          cellRender: (data: any) => {
            const array = data?.data?.detail_RingTime
              ? data.data.detail_RingTime.length
                ? data.data.detail_RingTime
                : []
              : [];
            return (
              <div>
                {array.map((item: any) => {
                  return <div>{item ?? 0}</div>;
                })}
              </div>
            );
          },
        },
        {
          dataField: "detail_TalkTime", // thời lượng trả lời
          caption: t("detail_TalkTime"),
          cellRender: (data: any) => {
            const array = data?.data?.detail_TalkTime
              ? data.data.detail_TalkTime.length
                ? data.data.detail_TalkTime
                : []
              : [];
            return (
              <div>
                {array.map((item: any) => {
                  return <div>{item}</div>;
                })}
              </div>
            );
          },
        },
        {
          dataField: "detail_HoldTime", // thời gian giữ máy
          caption: t("detail_HoldTime"),
          cellRender: (data: any) => {
            const array = data?.data?.detail_HoldTime
              ? data.data.detail_HoldTime.length
                ? data.data.detail_HoldTime
                : []
              : [];
            return (
              <div>
                {array.map((item: any) => {
                  return <div>{item}</div>;
                })}
              </div>
            );
          },
        },
      ],
    },
    {
      groupKey: "BASIC_INFORMATION",
      dataField: "Tổng hợp thời của 1 id cuộc gọi", // Tổng hợp thời của 1 id cuộc gọi
      caption: t("Total time's call of 1 id call"),
      editorType: "dxTextBox",

      editorOptions: {
        readOnly: false,
        placeholder: t("Input"),
        height: 50,
      },
      columns: [
        {
          dataField: "RingTime", // thời gian khách hàng chờ
          caption: t("RingTime"),
        },
        {
          dataField: "StartDTime",
          caption: t("StartDTime"), // thời gian bắt đầu cuộc gọi
        },
        {
          dataField: "EndDTime",
          caption: t("EndDTime"),
        },
        {
          dataField: "Remark",
          caption: t("Remark"),
        },
      ],
    },
  ];
  // return array of the first item only

  return columns;
};
