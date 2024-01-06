import { SelectBox } from "devextreme-react";
import { atom, useAtomValue, useSetAtom } from "jotai";

export const sortAtom = atom<any>("default");
export const sortTypeAtom = atom<any>("asc");

const Sort = ({ sortData }: any) => {
  const currentSort = useAtomValue(sortAtom);
  const currentSortType = useAtomValue(sortTypeAtom);

  const setCurrentSort = useSetAtom(sortAtom);
  const setCurrentSortType = useSetAtom(sortTypeAtom);

  const sortType = [
    {
      display: "Tăng dần",
      key: "asc",
    },
    {
      display: "Giảm dần",
      key: "desc",
    },
  ];

  return (
    <div className="flex gap-3">
      <SelectBox
        dataSource={sortData ?? []}
        displayExpr="display"
        valueExpr="key"
        value={currentSort}
        onValueChanged={(e: any) => {
          setCurrentSort(e?.value);
        }}
        width={250}
      />
      {currentSort != "default" && (
        <SelectBox
          dataSource={sortType}
          displayExpr="display"
          valueExpr="key"
          value={currentSortType}
          onValueChanged={(e: any) => {
            setCurrentSortType(e?.value);
          }}
          width={100}
        />
      )}
    </div>
  );
};

export default Sort;
