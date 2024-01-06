import { useI18n } from "@/i18n/useI18n";
import { forwardRef, useState } from "react";

const HeaderFilter = (ref: any) => {
  const { dataRef, onSetStatus } = ref;

  const { t } = useI18n("Post_Manager-header");
  const [ValueFilter, setValueFilter] = useState("CreateDTimeUTC");
  const [mapItems, setMapItems] = useState([
    { id: 1, name: t("Thời gian tạo"), active: true, action: "CreateDTimeUTC" },
    {
      id: 2,
      name: t("Thời gian cập nhật"),
      active: false,
      action: "LogLUDTimeUTC",
    },
  ]);
  const [mapTimes, setMapTimes] = useState([
    { id: 3, name: t("Sắp xếp tăng dần"), active: true, action: "Ascending" },
    { id: 4, name: t("Sắp xếp giảm dần"), active: false, action: "Descending" },
  ]);

  const handleItemClick = (itemId: any, refGrid: any) => {
    const updatedMapItems = mapItems.map((item) => {
      if (item.id === itemId) {
        if (item.action === "LogLUDTimeUTC") {
          setValueFilter("LogLUDTimeUTC");
        } else {
          setValueFilter("CreateDTimeUTC");
        }
        return { ...item, active: true };
      } else {
        return { ...item, active: false };
      }
    });
    setMapItems(updatedMapItems);
  };
  const handleItemTimesClick = (itemId: any, refGrid: any) => {
    const updatedMapItemsTimes = mapTimes.map((item) => {
      if (item.id === itemId) {
        if (item.action === "Descending" && ValueFilter === "CreateDTimeUTC") {
          refGrid.instance.clearSorting();
          refGrid.instance.columnOption("CreateDTimeUTC", "sortOrder", "desc");
        }
        if (item.action === "Ascending" && ValueFilter === "CreateDTimeUTC") {
          refGrid.instance.clearSorting();
          refGrid.instance.columnOption("CreateDTimeUTC", "sortOrder", "asc");
        }
        if (item.action === "Descending" && ValueFilter === "LogLUDTimeUTC") {
          refGrid.instance.clearSorting();
          refGrid.instance.columnOption("LogLUDTimeUTC", "sortOrder", "desc");
        }
        if (item.action === "Ascending" && ValueFilter === "LogLUDTimeUTC") {
          refGrid.instance.clearSorting();
          refGrid.instance.columnOption("LogLUDTimeUTC", "sortOrder", "asc");
        }
        return { ...item, active: true };
      } else {
        return { ...item, active: false };
      }
    });
    setMapTimes(updatedMapItemsTimes);
  };
  return (
    <div className="w-[200px] bg-white shadow-md p-1 rounded-md absolute">
      <div className="border-b pb-1 ">
        {mapItems.map((item: any) => {
          return (
            <div
              key={item.id}
              className={`sidebar-item ${
                item.active ? "bg-[#d4ecdb] text-[#008016]" : ""
              } px-1 py-1 rounded-md cursor-pointer flex items-center justify-between`}
              onClick={() => handleItemClick(item.id, dataRef)}
            >
              <div>{item.name}</div>
              {item.active === true ? (
                <div>
                  <img src="/images/icons/tick.png" />
                </div>
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
      <div className="pt-1">
        {mapTimes.map((item: any) => {
          return (
            <div
              key={item.id}
              className={`sidebar-item ${
                item.active ? "bg-[#d4ecdb] text-[#008016]" : ""
              } px-1 py-1 rounded-md cursor-pointer flex items-center justify-between`}
              onClick={() => handleItemTimesClick(item.id, dataRef)}
            >
              <div>{item.name}</div>
              {item.active === true ? (
                <div>
                  <img src="/images/icons/tick.png" />
                </div>
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const HeaderFilterPost = forwardRef(
  ({ dataRef, onSetStatus }: any, ref: any) => {
    return <HeaderFilter dataRef={dataRef} onSetStatus={onSetStatus} />;
  }
);
