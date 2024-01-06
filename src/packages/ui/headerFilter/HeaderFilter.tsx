import { useI18n } from "@/i18n/useI18n";
import { forwardRef, useEffect, useState } from "react";

export interface FilterItem {
  active: boolean; // just only one item have active = true
  nameField: string;
}

interface Props {
  listFilter: FilterItem[];
  t: (s: string) => void;
}

const HeaderFilter = forwardRef(({ listFilter, t }: Props, ref: any) => {
  const { t: tf } = useI18n("HeaderFilter");

  const [ValueFilter, setValueFilter] = useState("LogLUDTimeUTC");
  const [ValueFilterSort, setValueFilterSort] = useState("Descending");

  const [mapItems, setMapItems] = useState(
    listFilter.map((item, index) => {
      return {
        id: index,
        name: t(item.nameField),
        active: item.active,
        action: item.nameField,
      };
    })
  );

  const [mapTimes, setMapTimes] = useState([
    { id: 6, name: tf("Ascending"), active: false, action: "Ascending" },
    { id: 7, name: tf("Descending"), active: true, action: "Descending" },
  ]);

  const handleItemClick = (itemId: any) => {
    const updatedMapItems = mapItems.map((item) => {
      if (item.id === itemId) {
        setValueFilter(item.action);
        return { ...item, active: true };
      } else {
        return { ...item, active: false };
      }
    });
    setMapItems(updatedMapItems);
  };

  useEffect(() => {
    if (ValueFilterSort === "Ascending") {
      ref.instance.clearSorting();
      ref.instance.columnOption(`${ValueFilter}`, "sortOrder", "asc");
    }
    if (ValueFilterSort === "Descending") {
      ref.instance.clearSorting();
      ref.instance.columnOption(`${ValueFilter}`, "sortOrder", "desc");
    }
  }, [ValueFilterSort, ValueFilter]);

  const handleItemTimesClick = (itemId: any) => {
    const updatedMapItemsTimes = mapTimes.map((item) => {
      if (item.id === itemId) {
        setValueFilterSort(item.action);
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
              onClick={() => handleItemClick(item.id)}
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
              onClick={() => handleItemTimesClick(item.id)}
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
});

interface PropsT {
  t: (name: string) => void;
  listFilter: FilterItem[];
}

export const HeaderFilterPost = forwardRef(
  ({ t, listFilter }: PropsT, ref: any) => {
    return <HeaderFilter ref={ref} t={t} listFilter={listFilter} />;
  }
);
