import { Button, DataGrid, LoadPanel } from "devextreme-react";
import {
  Column,
  ColumnChooser,
  ColumnFixing,
  Button as DxButton,
  Editing,
  HeaderFilter,
  IStateStoringProps,
  Pager,
  Paging,
  Scrolling,
  Selection,
  Toolbar,
  Item as ToolbarItem,
} from "devextreme-react/data-grid";

import { PageSize } from "@packages/ui/page-size";
import CustomStore from "devextreme/data/custom_store";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

import { useI18n } from "@/i18n/useI18n";
import { useVisibilityControl } from "@packages/hooks";
import { useWindowSize } from "@packages/hooks/useWindowSize";
import {
  gridStateAtom,
  normalGridDeleteMultipleConfirmationBoxAtom,
  normalGridDeleteSingleConfirmationBoxAtom,
  normalGridSelectionKeysAtom,
  normalGridSingleDeleteItemAtom,
} from "@packages/ui/base-gridview/store/normal-grid-store";
import CustomColumnChooser from "@packages/ui/column-toggler/custom-column-chooser";
import { IFormOptions } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useSetAtom } from "jotai";
import { differenceBy } from "lodash-es";
import "./base-gridview.scss";
import {
  DeleteMultipleConfirmationBox,
  DeleteSingleConfirmationBox,
  NormalGridPageNavigator,
  NormalGridPageSummary,
  useSavedState,
} from "./components";
import { ColumnOptions, ToolbarItemProps } from "./types";

interface GridViewProps {
  defaultPageSize?: number;
  dataSource: CustomStore | Array<any>;
  columns: ColumnOptions[];
  allowSelection: boolean;
  ref: ForwardedRef<any>;
  onReady?: (ref: any) => void;
  allowInlineEdit?: boolean;
  height?: number | string;
  inlineEditMode?: "row" | "popup" | "form";
  onEditorPreparing?: (e: EditorPreparingEvent<any, any>) => void;
  onSaveRow?: (option: any) => void;
  isLoading?: boolean;
  keyExpr?: string | string[];
  onDeleteRows?: (rows: string[]) => void;
  onSelectionChanged: (rowKeys: string[]) => void;
  popupSettings?: IPopupOptions;
  formSettings?: IFormOptions;
  toolbarItems?: ToolbarItemProps[];
  onEditRowChanges?: (changes: any) => void;
  storeKey?: string;
  isHidenPaging?: boolean;
  stateStoring?: IStateStoringProps;
  onCustomerEditing?: Function;
  showButton?: boolean;
}

export const GridViewRaw = forwardRef(
  (
    {
      defaultPageSize = 100,
      onEditorPreparing,
      onSaveRow,
      isHidenPaging = false,
      isLoading = false,
      keyExpr,
      onDeleteRows,
      onSelectionChanged,
      dataSource,
      columns,
      onReady,
      inlineEditMode = "form",
      popupSettings,
      formSettings,
      toolbarItems,
      onEditRowChanges,
      storeKey,
      stateStoring,
      height,
      onCustomerEditing,
      showButton = true,
    }: GridViewProps,
    ref: any
  ) => {
    const datagridRef = useRef<DataGrid | null>(null);
    const windowSize = useWindowSize();
    const onChangePageSize = (pageSize: number) => {
      datagridRef?.current?.instance.pageSize(pageSize);
    };
    const onChangePageIndex = (pageIndex: number) => {
      datagridRef?.current?.instance.pageIndex(pageIndex);
    };

    const chooserVisible = useVisibilityControl({ defaultVisible: false });

    const { saveState, loadState } = useSavedState<ColumnOptions[]>({
      storeKey: storeKey ?? "empty",
    });

    const [realColumns, setColumnsState] = useReducer(
      (state: any, changes: any) => {
        // save changes into localStorage
        saveState(changes);
        return changes;
      },
      columns
    );
    useEffect(() => {
      const savedState = loadState();
      if (savedState) {
        // we need check the order of column from changes set
        const shouldHideColumns = differenceBy<ColumnOptions, ColumnOptions>(
          columns,
          savedState,
          "dataField"
        );
        for (let i = 0; i < shouldHideColumns.length; i++) {
          const column = shouldHideColumns[i];
          datagridRef.current?.instance.columnOption(
            column.dataField!,
            "visible",
            false
          );
        }
        // update column with new index
        savedState.forEach((column: ColumnOptions, index: number) => {
          datagridRef.current?.instance.columnOption(
            column.dataField!,
            "visibleIndex",
            index + 1
          );
          datagridRef.current?.instance.columnOption(
            column.dataField!,
            "visible",
            true
          );
        });
        // setColumnsState(outputColumns);
      } else {
        const output = columns.map((c: ColumnOptions) => {
          return {
            ...c,
            visible: true,
          };
        });
        // console.log("setup init state:", output)
        saveState(output);
        setColumnsState(output);
      }
    }, [columns]);

    const onHiding = useCallback(() => {
      chooserVisible.close();
    }, []);

    const onApply = useCallback(
      (changes: any) => {
        // we need check the order of column from changes set
        const shouldHideColumns = differenceBy<ColumnOptions, ColumnOptions>(
          columns,
          changes,
          "dataField"
        );
        for (let i = 0; i < shouldHideColumns.length; i++) {
          const column = shouldHideColumns[i];
          datagridRef.current?.instance.columnOption(
            column.dataField!,
            "visible",
            false
          );
        }
        // update column with new index
        changes.forEach((column: ColumnOptions, index: number) => {
          datagridRef.current?.instance.columnOption(
            column.dataField!,
            "visibleIndex",
            index + 1
          );
          datagridRef.current?.instance.columnOption(
            column.dataField!,
            "visible",
            true
          );
        });
        saveState(changes);
        chooserVisible.close();
      },
      [chooserVisible, saveState]
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
    const setSelectionKeysAtom = useSetAtom(normalGridSelectionKeysAtom);
    const handleSelectionChanged = (e: any) => {
      setSelectionKeysAtom(e.selectedRowKeys);
      onSelectionChanged?.(e.selectedRowKeys);
    };

    const switchEditMode = (e: any, isOn: boolean) => {
      if (isOn) {
        e.component.option("sorting.mode", "none");
        e.component.option("headerFilter.visible", false);
      } else {
        e.component.option("sorting.mode", "single");
        e.component.option("headerFilter.visible", true);
      }
    };

    const handleEditingStart = (e: any) => {
      if (onCustomerEditing) {
        onCustomerEditing(e);
      } else {
        switchEditMode(e, true);
      }
    };

    const handleEditCancelled = (e: any) => {
      switchEditMode(e, false);
    };

    const handleSaved = (e: any) => {
      // logger.debug("saved event:", e);
      switchEditMode(e, false);
    };

    const handleNewRow = (e: any) => {
      switchEditMode(e, true);
    };
    const { t } = useI18n("Common");
    let innerGridRef = useRef<DataGrid>(null);

    const setRef = (r: any) => {
      datagridRef.current = r;
      innerGridRef = r;
      if (r) {
        ref.current = r;
        onReady?.(r);
      }
    };

    const onCancelDelete = () => {
      setConfirmBoxVisible(false);
      setDeleteSingleConfirmBoxVisible(false);
    };

    const onDeleteSingle = async (key: string) => {
      setDeleteSingleConfirmBoxVisible(false);
      const result = await onDeleteRows?.([key]);
      if (result) {
        setDeletingId("");
      }
    };

    const onDeleteMultiple = async (keys: string[]) => {
      setConfirmBoxVisible(false);
      const result = await onDeleteRows?.(keys);
      if (result) {
        setSelectionKeysAtom([]);
      }
    };

    const setConfirmBoxVisible = useSetAtom(
      normalGridDeleteMultipleConfirmationBoxAtom
    );
    const handleConfirmDelete = () => {
      setConfirmBoxVisible(true);
    };

    const renderPageSize = useCallback(() => {
      return (
        <PageSize
          title={t("Showing")}
          onChangePageSize={onChangePageSize}
          allowdPageSizes={[100, 200, 500, 1000, 3000, 5000]}
          showAllOption={true}
          showAllOptionText={t("ShowAll")}
          defaultPageSize={datagridRef.current?.instance.pageSize()}
        />
      );
    }, []);

    const renderPageNavigator = useCallback(() => {
      return <NormalGridPageNavigator onPageChanged={onChangePageIndex} />;
    }, []);

    const renderColumnChooser = useCallback(() => {
      return (
        <CustomColumnChooser
          title={t("ToggleColum")}
          applyText={t("Apply")}
          cancelText={t("Cancel")}
          selectAllText={t("SelectAll")}
          container={"#gridContainer"}
          button={"#myColumnChooser"}
          visible={chooserVisible.visible}
          columns={columns}
          onHiding={onHiding}
          onApply={onApply}
          actualColumns={realColumns}
          getColumnOptionCallback={
            datagridRef.current?.instance.columnOption || (() => {})
          }
        />
      );
    }, [chooserVisible, realColumns, columns]);
    const allToolbarItems: ToolbarItemProps[] = useMemo(() => {
      return [
        ...(toolbarItems || []),
        // {
        //   location: "before",
        //   render: () => {
        //     return <DeleteButton onClick={handleConfirmDelete} />;
        //   },
        // },
        !isHidenPaging && {
          ...[
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
              render: () => {
                return <NormalGridPageSummary />;
              },
            },
            {
              location: "after",
              render: renderColumnChooser,
            },
          ],
        },
      ];
    }, [chooserVisible, realColumns, columns]);

    const handleEditorPreparing = (e: any) => {
      onEditorPreparing?.(e);
    };
    const setGridAtom = useSetAtom(gridStateAtom);
    const setDeletingId = useSetAtom(normalGridSingleDeleteItemAtom);
    const setDeleteSingleConfirmBoxVisible = useSetAtom(
      normalGridDeleteSingleConfirmationBoxAtom
    );

    const innerSavingRowHandler = useCallback((e: any) => {
      if (e.changes && e.changes.length > 0) {
        // we don't enable batch mode, so only 1 change at a time.
        const { type } = e.changes[0];
        if (type === "insert" || type === "update") {
          // pass handle to parent page
          onSaveRow?.(e);
        } else {
          // set selected keys, then open the confirmation
          setDeletingId(e.changes[0].key);
          // show the confirmation box of Delete single case
          setDeleteSingleConfirmBoxVisible(true);

          // this one to clear `changes` set from grid.
          datagridRef.current?.instance.cancelEditData();
        }
      }
      // e.cancel = true;
    }, []);
    const handleRowRemoving = (e: any) => {};

    return (
      <div className={"base-gridview bg-white"}>
        <ScrollView showScrollbar={"always"}>
          <LoadPanel visible={isLoading} position={{ of: "#gridContainer" }} />
          <DataGrid
            keyExpr={keyExpr}
            errorRowEnabled={false}
            cacheEnabled={false}
            id="gridContainer"
            height={height ?? `${windowSize.height - 115}px`}
            width={"100%"}
            ref={(r) => setRef(r)}
            dataSource={dataSource}
            noDataText={t("ThereIsNoData")}
            remoteOperations={false}
            columnAutoWidth={true}
            repaintChangesOnly
            showBorders
            renderAsync={true}
            onContentReady={(e) => {
              setGridAtom({
                pageIndex: e.component.pageIndex() ?? 0,
                pageSize: e.component.pageSize() ?? 0,
                pageCount: e.component.pageCount() ?? 0,
                totalCount: e.component.totalCount() ?? 0,
              });
            }}
            onInitialized={(e) => {
              e.component?.option("headerFilter.visible", true);
              onReady?.(datagridRef.current);
            }}
            allowColumnResizing
            showColumnLines
            showRowLines
            columnResizingMode={"widget"}
            allowColumnReordering={false}
            onToolbarPreparing={onToolbarPreparing}
            onSelectionChanged={handleSelectionChanged}
            onEditorPreparing={handleEditorPreparing}
            onEditCanceled={handleEditCancelled}
            onEditingStart={handleEditingStart}
            onSaved={handleSaved}
            onInitNewRow={handleNewRow}
            onSaving={innerSavingRowHandler}
            stateStoring={stateStoring}
            onRowRemoving={handleRowRemoving}
          >
            <ColumnChooser enabled={true} />
            <ColumnFixing enabled={true} />
            <Paging enabled={true} defaultPageSize={defaultPageSize} />
            <Pager
              visible={false}
              showInfo={true}
              displayMode={"adaptive"}
              showPageSizeSelector
            />
            <ColumnChooser enabled={true} />
            <ColumnFixing enabled={true} />
            <HeaderFilter allowSearch={true} />
            <Scrolling
              renderAsync={true}
              mode={"standard"}
              showScrollbar={"always"}
            />
            <Toolbar>
              {!!allToolbarItems &&
                allToolbarItems.map((item, index) => {
                  return (
                    <ToolbarItem key={index} location={item.location}>
                      {item.widget === "dxButton" && (
                        <Button {...item.options} />
                      )}
                      {!!item.render && item.render()}
                    </ToolbarItem>
                  );
                })}
            </Toolbar>
            {showButton && (
              <Editing
                mode={"batch"}
                startEditAction={"click"}
                useIcons={true}
                allowUpdating={true}
                allowDeleting={true}
                allowAdding={true}
                confirmDelete={false}
                onChangesChange={onEditRowChanges ? onEditRowChanges : () => {}}
              ></Editing>
            )}

            {showButton && (
              <Column
                visible
                type="buttons"
                width={100}
                fixed={false}
                allowResizing={false}
              >
                <DxButton
                  cssClass={"mx-1 cursor-pointer"}
                  name="edit"
                  icon={"/images/icons/edit.svg"}
                />
                <DxButton
                  cssClass={"mx-1 cursor-pointer"}
                  name="delete"
                  icon={"/images/icons/trash.svg"}
                />
                <DxButton
                  cssClass={"mx-1 cursor-pointer"}
                  name="save"
                  icon={"/images/icons/save.svg"}
                />
                <DxButton
                  cssClass={"mx-1 cursor-pointer"}
                  name="cancel"
                  icon={"/images/icons/refresh.svg"}
                />
              </Column>
            )}
            <Selection mode="multiple" selectAllMode="page" />
            {columns.map((col: any) => {
              return <Column key={col.dataField} {...col} />;
            })}
          </DataGrid>
        </ScrollView>
        <DeleteMultipleConfirmationBox
          title={t("Delete")}
          message={t("DeleteMultipleConfirmationMessage")}
          onYesClick={onDeleteMultiple}
          onNoClick={onCancelDelete}
        />
        <DeleteSingleConfirmationBox
          title={t("Delete")}
          message={t("DeleteSingleItemConfirmationMessage")}
          onYesClick={onDeleteSingle}
          onNoClick={onCancelDelete}
        />
      </div>
    );
  }
);
