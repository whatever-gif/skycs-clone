import { LoadPanel, SelectBox } from "devextreme-react";
import { IStateStoringProps } from "devextreme-react/data-grid";
import { IFormOptions } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import CustomStore from "devextreme/data/custom_store";
import {
  EditingStartEvent,
  EditorPreparingEvent,
} from "devextreme/ui/data_grid";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { ForwardedRef, ReactNode, useEffect, useMemo, useState } from "react";
import { ColumnOptions, ToolbarItemProps } from "../base-gridview";
import Sort, { sortAtom, sortTypeAtom } from "./components/Sort";

interface GridViewProps {
  defaultPageSize?: number;
  dataSource: CustomStore | Array<any> | any;
  columns: ColumnOptions[];
  allowSelection: boolean;
  ref: ForwardedRef<any>;
  onReady?: (ref: any) => void;
  allowInlineEdit?: boolean;
  onEditorPreparing?: (e: EditorPreparingEvent<any, any>) => void;
  onSaveRow?: (option: any) => void;
  isLoading?: boolean;
  keyExpr?: string | string[];
  onDeleteRows?: (rows: string[]) => void;
  onSelectionChanged: (rowKeys: string[]) => void;
  popupSettings?: IPopupOptions;
  formSettings?: IFormOptions;
  toolbarItems?: ToolbarItemProps[];
  customToolbarItems?: any[];
  onEditRowChanges?: (changes: any) => void;
  onEditingStart?: (e: EditingStartEvent) => void;
  stateStoring?: IStateStoringProps;
  storeKey: string;
  onEditRow?: (e: any) => void;
  customCard: (item: any) => ReactNode;
  sortData?: any[];
  sortProcess?: any;
}

export const BaseCardView = ({
  ref,
  onEditorPreparing,
  onSaveRow,
  isLoading = false,
  keyExpr,
  onDeleteRows,
  onSelectionChanged,
  dataSource,
  columns,
  onReady,
  allowInlineEdit = true,
  popupSettings,
  formSettings,
  toolbarItems,
  onEditRowChanges,
  onEditingStart,
  storeKey,
  onEditRow,
  customToolbarItems,
  customCard,
  sortData,
  sortProcess,
}: GridViewProps) => {
  const listOption = [
    {
      display: "Card View",
      value: "card",
    },
    {
      display: "Table View",
      value: "table",
    },
  ];

  return (
    <div>
      {isLoading ? (
        <LoadPanel visible={isLoading} />
      ) : (
        <PaginationCardView
          dataSource={dataSource}
          customCard={customCard}
          sortData={sortData}
          sortProcess={sortProcess}
        />
      )}
    </div>
  );
};

export const PaginationCardView = ({
  dataSource,
  customCard,
  sortData,
  sortProcess,
}: {
  dataSource: any;
  customCard: any;
  sortData: any;
  sortProcess: any;
}) => {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const currentSort = useAtomValue(sortAtom);
  const currentSortType = useAtomValue(sortTypeAtom);

  const setCurrentSort = useSetAtom(sortAtom);

  const defaultDataSource = [10, 20, 50, 100];

  const handleNext = () => {
    if (pageIndex * pageSize + pageSize >= dataSource?.length) {
      return;
    }
    setPageIndex(pageIndex + 1);
  };

  const handlePrev = () => {
    if (pageIndex <= 0) {
      return;
    }
    setPageIndex(pageIndex - 1);
  };

  useEffect(() => {
    setCurrentSort("default");
  }, []);

  const render = useMemo(() => {
    return (
      <>
        {dataSource && dataSource.length > 0 ? (
          dataSource
            .sort((a: any, b: any) =>
              sortProcess(a, b, currentSort, currentSortType)
            )
            .map((item: any, index: any) => {
              if (
                index >= pageIndex * pageSize &&
                index < pageIndex * pageSize + pageSize
              ) {
                return (
                  <div key={nanoid()}>
                    {customCard(item)}
                    <div className="separator"></div>
                  </div>
                );
              }
            })
        ) : (
          <div className="w-full flex items-center justify-center h-[300px]">
            Không có dữ liệu!
          </div>
        )}
      </>
    );
  }, [dataSource, currentSort, currentSortType, pageIndex, pageSize]);

  // console.log(
  //   dataSource
  //     .sort((a: any, b: any) => sortProcess(a, b, currentSort, currentSortType))
  //     .map((item: any) => {
  //       return {
  //         idx: item.Idx,
  //         time: item.CreateDTimeUTC,
  //         type: item.BizType,
  //       };
  //     })
  // );

  return (
    <div className="h-full">
      {dataSource && dataSource.length > 0 && (
        <>
          <div className="flex justify-between px-2 items-center grid-header-filter">
            <div className="">
              <Sort sortData={sortData} />
            </div>

            <div className="flex items-center gap-1 justify-end my-2">
              <div>Hiển thị</div>
              <SelectBox
                dataSource={defaultDataSource}
                value={pageSize}
                width={100}
                onValueChanged={(e: any) => setPageSize(e?.value)}
              />
              <div>
                {pageIndex * pageSize + 1} -{" "}
                {pageIndex * pageSize + pageSize > dataSource?.length
                  ? dataSource?.length
                  : pageIndex * pageSize + pageSize}{" "}
                trong số {dataSource?.length ?? 0}
              </div>
              <div
                className={
                  pageIndex == 0 ? "cursor-not-allowed" : "cursor-pointer"
                }
                onClick={handlePrev}
              >
                <svg
                  width="7"
                  height="11"
                  viewBox="0 0 7 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.01402 5.36107C0.912094 5.46469 0.85498 5.60422 0.85498 5.74957C0.85498 5.89492 0.912094 6.03445 1.01402 6.13807L5.41403 10.5901C5.46434 10.6409 5.52421 10.6812 5.59021 10.7088C5.65621 10.7363 5.72701 10.7505 5.79852 10.7505C5.87003 10.7505 5.94084 10.7363 6.00684 10.7088C6.07283 10.6812 6.13272 10.6409 6.18303 10.5901L6.69403 10.0701C6.79596 9.96645 6.85307 9.82692 6.85307 9.68157C6.85307 9.53622 6.79596 9.39669 6.69403 9.29307L3.21002 5.75007L6.69603 2.20507C6.79736 2.10154 6.8541 1.96244 6.8541 1.81757C6.8541 1.6727 6.79736 1.5336 6.69603 1.43007L6.18303 0.911069C6.13281 0.860275 6.07301 0.819949 6.0071 0.792427C5.94118 0.764904 5.87046 0.750732 5.79903 0.750732C5.7276 0.750732 5.65687 0.764904 5.59096 0.792427C5.52504 0.819949 5.46524 0.860275 5.41502 0.911069L1.01402 5.36107Z"
                    fill={pageIndex == 0 ? "#5F7D95" : "#0E223D"}
                  />
                </svg>
              </div>
              <div
                className={
                  pageIndex * pageSize + pageSize >= dataSource?.length
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }
                onClick={handleNext}
              >
                <svg
                  width="7"
                  height="11"
                  viewBox="0 0 7 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.69601 6.13893C6.79794 6.03531 6.85507 5.89578 6.85507 5.75043C6.85507 5.60508 6.79794 5.46555 6.69601 5.36193L2.29602 0.909932C2.24571 0.859107 2.18581 0.81876 2.11981 0.791225C2.05381 0.763689 1.98301 0.749512 1.9115 0.749512C1.83999 0.749512 1.76918 0.763689 1.70319 0.791225C1.63719 0.81876 1.57731 0.859107 1.52701 0.909932L1.01602 1.42993C0.914093 1.53355 0.856964 1.67308 0.856964 1.81843C0.856964 1.96378 0.914093 2.10331 1.01602 2.20693L4.5 5.74993L1.01401 9.29493C0.912916 9.39859 0.856323 9.53764 0.856323 9.68243C0.856323 9.82722 0.912916 9.96628 1.01401 10.0699L1.52701 10.5889C1.57723 10.6397 1.63703 10.6801 1.70294 10.7076C1.76886 10.7351 1.83958 10.7493 1.91101 10.7493C1.98244 10.7493 2.05316 10.7351 2.11908 10.7076C2.18499 10.6801 2.24479 10.6397 2.29501 10.5889L6.69601 6.13893Z"
                    fill={
                      pageIndex * pageSize + pageSize >= dataSource?.length
                        ? "#5F7D95"
                        : "#0E223D"
                    }
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="separator separate-before-list-column mb-2 mt-2"></div>{" "}
        </>
      )}

      <div className="list-column">
        {dataSource && dataSource.length > 0 ? (
          dataSource.map((item: any, index: any) => {
            if (
              index >= pageIndex * pageSize &&
              index < pageIndex * pageSize + pageSize
            ) {
              return (
                <div className="column-item" key={nanoid()}>
                  {customCard(item)}
                  <div className="separator"></div>
                </div>
              );
            }
          })
        ) : (
          <div className="w-full flex items-center justify-center h-[300px]">
            Không có dữ liệu!
          </div>
        )}
      </div>
    </div>
  );
};
