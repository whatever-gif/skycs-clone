import { DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import { useParams } from "react-router-dom";

const HolidayTable = ({ control, setValue, watch }: any) => {
  const holidayList = watch("Lst_Mst_SLAHoliday");

  const { type } = useParams();

  const handleDelete = (id: string) => {
    setValue(
      "Lst_Mst_SLAHoliday",
      holidayList.filter((item: any) => item.id != id)
    );
  };

  const columns = [
    {
      dataField: "id",
      caption: "",
      cellRender: ({ data }: any) => {
        return (
          <div
            onClick={() => handleDelete(data.id)}
            className="w-[20px] h-[20px] cursor-pointer"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/8102/8102162.png"
              alt=""
              className="w-full h-full"
            />
          </div>
        );
      },
      width: type == "detail" ? 0 : 100,
    },

    {
      dataField: "day",
      caption: "Day",
      cellRender: ({ data }: any) => {
        return (
          <>
            {`0${data.Day}`.slice(-2)}-{`0${data.Month}`.slice(-2)}
          </>
        );
      },
      width: 200,
    },
    {
      dataField: "Event",
      caption: "Event",
    },
  ];
  return (
    <DataGrid dataSource={holidayList} keyExpr="id" width={"50%"}>
      {columns.map((item: any) => (
        <Column {...item} key={item.dataField} />
      ))}
    </DataGrid>
  );
};

export default HolidayTable;
