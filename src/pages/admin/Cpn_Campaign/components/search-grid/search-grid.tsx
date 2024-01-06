import DataGrid, {
  Column,
  ColumnChooser,
  ColumnFixing,
  HeaderFilter,
  Item as ToolbarItem,
  Pager,
  Paging,
  Scrolling,
  Selection,
  Toolbar,
} from "devextreme-react/data-grid";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useConfiguration, useVisibilityControl } from "@packages/hooks";
import { ColumnOptions, ToolbarItemProps } from "@packages/ui/base-gridview";
import { useSavedState } from "@packages/ui/base-gridview/components";
import { PageSize } from "@packages/ui/page-size";
import { useI18n } from "@/i18n/useI18n";
import { Button, ScrollView } from "devextreme-react";
import CustomColumnChooser from "@packages/ui/column-toggler/custom-column-chooser";
import { PagerSummary } from "@packages/ui/pager-summary";
import { atom, useAtom } from "jotai";
import { PageNavigator } from "@packages/ui/page-navigator";
import { toast } from "react-toastify";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
interface GridState {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
}
interface SearchDataGridProps {
  columns: ColumnOptions[];
  dataSource: any[];
  keyExpr?: string[];
  onSelectionChanged?: (e: any) => void;
  toolbarItems?: ToolbarItemProps[];
  storeKey?: string;
  customizeClass?: string;
}
export const gridStateAtom = atom<GridState>({
  pageIndex: 0,
  pageSize: 100,
  pageCount: 0,
  totalCount: 0,
});
export const SearchDataGrid = forwardRef(
  (
    {
      columns,
      dataSource,
      keyExpr,
      onSelectionChanged,
      toolbarItems,
      storeKey,
      customizeClass,
    }: SearchDataGridProps,
    ref: any
  ) => {
    const { t } = useI18n("Common");
    const summaryText = t("{0}-{1} in {2}");
    let innerRef = useRef<DataGrid | null>(null);
    const config = useConfiguration();
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [gridState, setGridAtom] = useAtom(gridStateAtom);
    const { pageIndex, pageSize, pageCount, totalCount } = gridState;
    const windowSize = useWindowSize();
    const handleSelectionChanged = ({
      selectedRowKeys,
      selectedRowsData,
    }: any) => {
      // console.log(innerRef);
      setSelectedRows(selectedRowKeys);
      onSelectionChanged?.({ selectedRowKeys, selectedRowsData });
    };

    const { saveState, loadState } = useSavedState<ColumnOptions[]>({
      storeKey: storeKey ?? "empty",
    });

    const [realColumns, setColumnsState] = useReducer(
      (state: ColumnOptions[], changes: ColumnOptions[]) => {
        // save changes into localStorage
        saveState(changes);
        return changes;
      },
      columns
    );

    useEffect(() => {
      const savedState = loadState();
      if (savedState) {
        const columnOrders = savedState.map(
          (column: ColumnOptions) => column.dataField
        );
        const outputColumns = columns.map((column: ColumnOptions) => {
          const filterResult = savedState.find(
            (c: ColumnOptions) => c.dataField === column.dataField
          );
          column.visible = filterResult ? filterResult.visible : false;
          return column;
        });
        outputColumns.sort(
          (a, b) =>
            columnOrders.indexOf(a.dataField) -
            columnOrders.indexOf(b.dataField)
        );
        setColumnsState(outputColumns);
      }
    }, []);

    const onChangePageSize = (pageSize: number) => {
      innerRef.current?.instance.pageSize(pageSize);
    };

    const onChangePageIndex = (pageIndex: number) => {
      innerRef.current?.instance.pageIndex(pageIndex);
    };

    const chooserVisible = useVisibilityControl({ defaultVisible: false });
    const onHiding = useCallback(() => {
      chooserVisible.close();
    }, []);

    const onApply = useCallback(
      (changes: any) => {
        // we need check the order of column from changes set
        const latest = [...changes];
        realColumns.forEach((column: ColumnOptions) => {
          const found = changes.find(
            (c: ColumnOptions) => c.dataField === column.dataField
          );
          if (!found) {
            column.visible = false;
            latest.push(column);
          }
        });
        setColumnsState(latest);
        chooserVisible.close();
      },
      [setColumnsState]
    );

    const onToolbarPreparing = useCallback((e: any) => {
      e.toolbarOptions.items.push({
        widget: "dxButton",
        location: "after",
        options: {
          icon: "/images/icons/settings.svg",
          elementAttr: {
            id: "myColumnChooser",
          },
          onClick: () => chooserVisible.toggle(),
        },
      });
    }, []);

    const renderPageSize = useCallback(() => {
      return (
        <PageSize
          title={t("Showing")}
          onChangePageSize={onChangePageSize}
          allowdPageSizes={[100, 200, 500, 1000, 3000, 5000]}
          showAllOption={true}
          showAllOptionText={t("ShowAll")}
          defaultPageSize={innerRef.current?.instance.pageSize()}
        />
      );
    }, []);

    const renderPageNavigator = useCallback(() => {
      return (
        <PageNavigator
          itemCount={totalCount ?? 0}
          currentPage={pageIndex}
          onPageChanged={onChangePageIndex}
          pageSize={pageSize}
          pageCount={pageCount ?? 0}
        />
      );
    }, []);

    const renderPageSummary = useCallback(() => {
      return (
        <PagerSummary
          summaryTemplate={summaryText}
          currentPage={pageIndex}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      );
    }, [pageSize, totalCount, pageIndex, gridState]);

    const renderColumnChooser = useCallback(() => {
      return (
        <CustomColumnChooser
          title={t("ToggleColum")}
          applyText={t("Apply")}
          cancelText={t("Cancel")}
          selectAllText={t("SelectAll")}
          container={"#gridContainer-searchGrid"}
          button={"#myColumnChooser"}
          visible={chooserVisible.visible}
          columns={columns}
          onHiding={onHiding}
          onApply={onApply}
          actualColumns={realColumns}
        />
      );
    }, [chooserVisible, realColumns, columns]);

    const allToolbarItems: ToolbarItemProps[] = useMemo(() => {
      return [
        ...(toolbarItems || []),
        {
          location: "after",
          render: renderPageSize,
        },
        {
          location: "after",
          render: renderPageNavigator,
        },
        {
          location: "after",
          render: renderPageSummary,
        },
        {
          location: "after",
          render: renderColumnChooser,
        },
      ];
    }, [chooserVisible, realColumns, columns, gridState]);
    // console.log(
    //   "windowSize.height - (windowSize.height - 630) ",
    //   windowSize.height,
    //   windowSize.height - (windowSize.height - 500)
    // );
    return (
      <DataGrid
        keyExpr={keyExpr}
        className={customizeClass ? customizeClass : ""}
        ref={(r) => {
          if (r) {
            innerRef.current = r;
          }
          ref.current = r;
        }}
        id="gridContainer-searchGrid"
        dataSource={dataSource}
        showBorders
        showColumnLines
        showRowLines
        columnResizingMode={"widget"}
        allowColumnReordering={false}
        allowColumnResizing
        height={windowSize.height - (windowSize.height - 400)}
        columnAutoWidth={true}
        selectedRowKeys={selectedRows}
        onSelectionChanged={handleSelectionChanged}
        onToolbarPreparing={onToolbarPreparing}
        onContentReady={(e) => {
          setGridAtom({
            pageIndex: e.component.pageIndex() ?? 0,
            pageSize: e.component.pageSize() ?? 0,
            pageCount: e.component.pageCount() ?? 0,
            totalCount: e.component.totalCount() ?? 0,
          });
        }}
      >
        <ColumnFixing enabled={true} />
        <Paging enabled={true} defaultPageSize={config.PAGE_SIZE} />
        <Pager visible={false} />
        <ColumnChooser enabled={true} />
        <HeaderFilter allowSearch={true} visible={true} />
        <Scrolling
          renderAsync={true}
          mode={"standard"}
          showScrollbar={"always"}
        />
        <Selection
          mode="multiple"
          selectAllMode="page"
          showCheckBoxesMode={"always"}
        />
        <Toolbar>
          {!!allToolbarItems &&
            allToolbarItems.map((item, index) => {
              return (
                <ToolbarItem key={index} location={item.location}>
                  {item.widget === "dxButton" && <Button {...item.options} />}
                  {!!item.render && item.render()}
                </ToolbarItem>
              );
            })}
        </Toolbar>

        {realColumns.map((item, index) => {
          return <Column key={index} {...item} />;
        })}
      </DataGrid>
      // <ScrollView
      //   showScrollbar={"always"}
      //   height={windowSize.height - (windowSize.height - 600)}
      //   className={"mb-5"}
      // >

      // </ScrollView>
    );
  }
);
