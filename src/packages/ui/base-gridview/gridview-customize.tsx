import {
  Button,
  CheckBox,
  DataGrid,
  LoadPanel,
  SelectBox,
  Tooltip,
} from "devextreme-react";
import {
  Button as DxButton,
  Column,
  ColumnChooser,
  ColumnFixing,
  Editing,
  HeaderFilter,
  IStateStoringProps,
  Item as ToolbarItem,
  Pager,
  Paging,
  Scrolling,
  Selection,
  Texts,
  Toolbar,
  LoadPanel as GridLoadPanel,
  Search,
  Export,
} from "devextreme-react/data-grid";

import { PageSize } from "@packages/ui/page-size";
import CustomStore from "devextreme/data/custom_store";
import {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import ScrollView from "devextreme-react/scroll-view";
import "./base-gridview.scss";

import { useI18n } from "@/i18n/useI18n";
import { logger } from "@/packages/logger";
import { useVisibilityControl } from "@packages/hooks";
import { useWindowSize } from "@packages/hooks/useWindowSize";
import CustomColumnChooser from "@packages/ui/column-toggler/custom-column-chooser";
import { IFormOptions } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import { saveAs } from "file-saver-es";
import { Workbook } from "exceljs";

import {
  EditingStartEvent,
  EditorPreparingEvent,
} from "devextreme/ui/data_grid";
import { differenceBy } from "lodash-es";

import { DeleteConfirmationBox } from "../modal";
import { ColumnOptions, ToolbarItemProps } from "./types";
import { useSavedState } from "@packages/ui/base-gridview/components/use-saved-state";
import { PopupGridPageNavigator } from "@packages/ui/base-gridview/components/popup-grid-page-navigator";
import { PopupGridPageSummary } from "@packages/ui/base-gridview/components/popup-grid-page-summary";
import { useAtomValue, useSetAtom } from "jotai";
import { popupGridStateAtom } from "@packages/ui/base-gridview/store/popup-grid-store";
import {
  GridCustomerToolBarItem,
  GridCustomToolbar,
} from "@packages/ui/base-gridview/components/grid-custom-toolbar";
import {
  SelectionKeyAtom,
  customizeGridSelectionKeysAtom,
  dataGridAtom,
  hidenMoreAtom,
  loadingColumnAtom,
  normalGridSelectionKeysAtom,
} from "./store/normal-grid-store";
import { Icon } from "../icons";
import { nanoid } from "nanoid";
import { exportDataGrid } from "devextreme/excel_exporter";
import PermissionContainer, {
  checkPermision,
} from "@/components/PermissionContainer";
import { permissionAtom } from "@/packages/store";

interface GridViewProps {
  id?: string;
  isHiddenCheckBox?: boolean;
  isHidenHeaderFilter?: boolean;
  defaultPageSize?: number;
  dataSource: CustomStore | Array<any> | any;
  widthPopUp?: number;
  columns: ColumnOptions[];
  allowSelection: boolean;
  ref: ForwardedRef<any>;
  nameFile?: string;
  onReady?: (ref: any) => void;
  allowInlineEdit?: boolean;
  isShowIconEdit?: boolean;
  onEditorPreparing?: (e: EditorPreparingEvent<any, any>) => void;
  onSaveRow?: (option: any) => void;
  isLoading?: boolean;
  keyExpr?: string | string[];
  onDeleteRows?: (rows: string[]) => void;
  onSelectionChanged: (rowKeys: string[]) => void;
  popupSettings?: IPopupOptions;
  formSettings?: IFormOptions;
  toolbarItems?: ToolbarItemProps[];
  customToolbarItems?: GridCustomerToolBarItem[];
  onEditRowChanges?: (changes: any) => void;
  onEditingStart?: (e: EditingStartEvent) => void;
  stateStoring?: IStateStoringProps;
  storeKey: string;
  onEditRow?: (e: any) => void;
  isSingleSelection?: boolean;
  isShowEditting?: boolean;
  visibleExport?: boolean;
  isShowEditCard?: boolean;
  permissionExport?: string;
  permissionEdit?: string;
  editable?: boolean;
  permissionDelete?: string;
  hidenTick?: boolean;
  cssClass?: string;
  locationCustomToolbar?: "center" | "before" | "after";
  customerHeight?: number | string;
}

const GridViewRaw = ({
  cssClass,
  ref,
  onEditorPreparing,
  permissionDelete,
  onSaveRow,
  isLoading = false,
  keyExpr,
  onDeleteRows,
  onSelectionChanged,
  permissionEdit,
  dataSource,
  columns,
  widthPopUp,
  editable = true,
  isHidenHeaderFilter = false,
  onReady,
  allowInlineEdit = true,
  isShowIconEdit = true,
  popupSettings,
  formSettings,
  toolbarItems,
  onEditRowChanges,
  onEditingStart,
  storeKey,
  nameFile = "fileExport",
  onEditRow,
  isShowEditting = false,
  customToolbarItems,
  isSingleSelection = false,
  defaultPageSize = 100,
  isShowEditCard = false,
  isHiddenCheckBox = false,
  permissionExport = "",
  visibleExport = false,
  locationCustomToolbar,
  customerHeight = 0,
  id = "gridContainer",
}: GridViewProps) => {
  const { t, tf } = useI18n("Common");
  const setHidenMore = useSetAtom(hidenMoreAtom);
  let dataGridRef = useRef<DataGrid | null>(null);
  const setDataGrid = useSetAtom(dataGridAtom);
  const setSelectionKey = useSetAtom(SelectionKeyAtom);
  const popupSettingsMemo = useMemo(() => popupSettings, [popupSettings]);
  const formSettingsPopup = useRef<any>();
  const windowSize = useWindowSize();

  useEffect(() => {
    formSettingsPopup.current = { ...formSettings };
    setDataGrid(dataGridRef);
  }, []);

  const [config, setConfig] = useState({
    pageIndex: 0,
    pageSize: 0,
    pageCount: 0,
    totalCount: 0,
  });

  const onChangePageSize = (pageSize: number) => {
    dataGridRef.current?.instance.pageSize(pageSize);
  };
  const { saveState, loadState } = useSavedState<ColumnOptions[]>({ storeKey });
  const chooserVisible = useVisibilityControl({ defaultVisible: false });

  const [realColumn, setRealColumn] = useReducer((state: any, changes: any) => {
    // save changes into localStorage
    saveState(changes);
    return changes;
  }, columns);

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
        dataGridRef.current?.instance.columnOption(
          column.dataField!,
          "visible",
          false
        );
      }
      // update column with new index
      savedState.forEach((column: ColumnOptions, index: number) => {
        dataGridRef.current?.instance.columnOption(
          column.dataField!,
          "visibleIndex",
          index + 1
        );
        dataGridRef.current?.instance.columnOption(
          column.dataField!,
          "visible",
          true
        );
      });
      // setColumnsState(outputColumns);
    }
  }, [columns]);

  const onHiding = useCallback(() => {
    chooserVisible.close();
  }, []);

  const onApply = useCallback(
    (changes: any) => {
      chooserVisible.close();
      // we need check the order of column from changes set
      const shouldHideColumns = differenceBy<ColumnOptions, ColumnOptions>(
        columns,
        changes,
        "dataField"
      );
      for (let i = 0; i < shouldHideColumns.length; i++) {
        const column = shouldHideColumns[i];
        dataGridRef.current?.instance.columnOption(
          column.dataField!,
          "visible",
          false
        );
      }
      // update column with new index
      changes.forEach((column: ColumnOptions, index: number) => {
        dataGridRef.current?.instance.columnOption(
          column.dataField!,
          "visibleIndex",
          index + 1
        );
        dataGridRef.current?.instance.columnOption(
          column.dataField!,
          "visible",
          true
        );
      });
      setRealColumn(changes);
    },
    [chooserVisible, saveState]
  );
  const setLoadingColumn = useSetAtom(loadingColumnAtom);
  const onToolbarPreparing = useCallback((e: any) => {}, []);
  const setSelectionKeysAtom = useSetAtom(customizeGridSelectionKeysAtom);
  const handleSelectionChanged = useCallback((e: any) => {
    setHidenMore(e.selectedRowKeys);
    setSelectionKeysAtom(e.selectedRowKeys);
    // console.log("e.isSingleSelection", e.selectedRowKeys);
    setSelectionKey(e.selectedRowKeys);
    setLoadingColumn(e.selectedRowKeys);
    // setSelectionKeys(e.selectedRowKeys);
    onSelectionChanged?.(e.selectedRowKeys);
  }, []);
  const handleEditingStart = useCallback((e: EditingStartEvent) => {
    logger.debug("e:", e);
    onEditingStart?.(e);
  }, []);
  const handleEditCancelled = useCallback(() => {}, []);

  const handleSaved = useCallback((e: any) => {
    logger.debug("saved event:", e);
    switchEditMode(e, false);
  }, []);

  const controlConfirmBoxVisible = useVisibilityControl({
    defaultVisible: false,
  });

  const handlePageChanged = useCallback((pageIndex: number) => {
    dataGridRef.current?.instance.pageIndex(pageIndex);
  }, []);

  const permissionStore = useAtomValue(permissionAtom);

  const switchEditMode = (e: any, isOn: boolean) => {
    if (isOn) {
      e.component.option("sorting.mode", "none");
      e.component.option("headerFilter.visible", false);
    } else {
      e.component.option("sorting.mode", "single");
      e.component.option("headerFilter.visible", true);
    }
  };
  const setRef = (ref: any) => {
    dataGridRef.current = ref;
    onReady?.(ref);
  };

  const handleAddingNewRow = () => {};

  // const onCancelDelete = useCallback(() => {}, []);
  // const onDelete = useCallback(() => {
  //   console.log("coming");
  //   onDeleteRows?.(selectionKeys);
  // }, [selectionKeys]);
  // const onDeleteSingle = useCallback(() => {
  //   if (deletingId) {
  //     onDeleteRows?.([deletingId]);
  //   }
  // }, [deletingId]);

  // const controlDeleteSingleConfirmBox = useVisibilityControl({
  //   defaultVisible: false,
  // });
  const listOption = [
    {
      display: t("Card View"),
      value: "card",
    },
    {
      display: t("Table View"),
      value: "table",
    },
  ];

  const allToolbarItems: ToolbarItemProps[] = [
    ...(toolbarItems || []),
    {
      location: locationCustomToolbar ? locationCustomToolbar : "before",
      render: () => (
        <GridCustomToolbar items={customToolbarItems} ref={dataGridRef} />
      ),
    },
    isShowEditCard === true
      ? {
          location: "after",
          render: () => {
            return (
              <div className="flex items-center">
                {t("Layout")}
                <SelectBox
                  id="custom-templates"
                  dataSource={listOption}
                  displayExpr="display"
                  className="ml-2 w-[120px]"
                  valueExpr="value"
                  defaultValue={listOption[1].value}
                  onValueChanged={(e: any) => {
                    // setCurrentOption(e.value);
                  }}
                />
              </div>
            );
          },
        }
      : {},
    !isHidenHeaderFilter
      ? {
          location: "after",
          render: () => {
            return (
              <PageSize
                title={t("Showing")}
                onChangePageSize={onChangePageSize}
                allowdPageSizes={[100, 200, 500, 1000, 3000, 5000]}
                showAllOption={true}
                showAllOptionText={t("ShowAll")}
                defaultPageSize={defaultPageSize}
              />
            );
          },
        }
      : {},
    !isHidenHeaderFilter
      ? {
          location: "after",
          render: () => {
            return (
              <PopupGridPageNavigator
                config={config}
                onPageChanged={handlePageChanged}
              />
            );
          },
        }
      : {},
    !isHidenHeaderFilter
      ? {
          location: "after",
          render: () => {
            return <PopupGridPageSummary config={config} />;
          },
        }
      : {},
  ];

  const onExporting = (e: any) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Companies");

    worksheet.columns = [
      { width: 5 },
      { width: 30 },
      { width: 25 },
      { width: 15 },
      { width: 25 },
      { width: 40 },
    ];

    exportDataGrid({
      component: e.component,
      worksheet,
      keepColumnWidths: false,
      topLeftCell: { row: 2, column: 2 },
      customizeCell: ({ gridCell, excelCell }: any) => {
        if (gridCell.rowType === "group") {
          excelCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "BEDFE6" },
          };
        }
        if (gridCell.rowType === "totalFooter" && excelCell.value) {
          excelCell.font.italic = true;
        }
      },
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer: any) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          `${nameFile}.xlsx`
        );
      });
    });
  };

  // const setGridAtom = useSetAtom(popupGridStateAtom);
  return (
    <div className={"base-gridview grid-view-customize bg-white"}>
      <ScrollView showScrollbar={"always"}>
        <LoadPanel visible={isLoading} position={{ of: `#${id}` }} />
        <DataGrid
          className={cssClass}
          keyExpr={keyExpr}
          errorRowEnabled={false}
          cacheEnabled={false}
          id={id}
          height={`${
            customerHeight ? customerHeight : windowSize.height - 130
          }px`}
          width={"100%"}
          ref={(r) => setRef(r)}
          dataSource={dataSource}
          noDataText={t("There is no data")}
          remoteOperations={false}
          columnAutoWidth={true}
          repaintChangesOnly
          showBorders
          onInitialized={() => {
            onReady?.(dataGridRef);
          }}
          onContentReady={() => {
            // setGridAtom({
            //   pageIndex: dataGridRef.current?.instance.pageIndex() ?? 0,
            //   pageSize: dataGridRef.current?.instance.pageSize() ?? 0,
            //   pageCount: dataGridRef.current?.instance.pageCount() ?? 0,
            //   totalCount: dataGridRef.current?.instance.totalCount() ?? 0,
            //   ref: dataGridRef.current,
            // });
            setConfig({
              pageIndex: dataGridRef.current?.instance.pageIndex() ?? 0,
              pageSize: dataGridRef.current?.instance.pageSize() ?? 0,
              pageCount: dataGridRef.current?.instance.pageCount() ?? 0,
              totalCount: dataGridRef.current?.instance.totalCount() ?? 0,
            });
          }}
          allowColumnResizing
          showColumnLines
          showRowLines
          columnResizingMode={"widget"}
          onToolbarPreparing={onToolbarPreparing}
          onSelectionChanged={handleSelectionChanged}
          onEditorPreparing={onEditorPreparing}
          onEditingStart={handleEditingStart}
          onEditCanceled={handleEditCancelled}
          onSaved={handleSaved}
          onInitNewRow={handleAddingNewRow}
          onExporting={onExporting}
          onSaving={() => {}}
          onRowRemoved={(e: any) => {
            // to support custom delete confirmation
            e.cancel = true;
          }}
          onRowRemoving={(e: any) => {
            // to support custom delete confirmation
            e.cancel = true;
          }}
        >
          <Export enabled={true} />
          <ColumnChooser enabled={true} mode={"select"}>
            <Search enabled={true}></Search>
          </ColumnChooser>
          <Pager visible={false} />
          <Paging enabled={true} defaultPageSize={defaultPageSize} />
          <HeaderFilter visible={true} dataSource={dataSource}>
            <Search enabled={true}></Search>
          </HeaderFilter>

          <Toolbar>
            {!!allToolbarItems &&
              allToolbarItems.map((item, index) => {
                return (
                  <ToolbarItem
                    key={index}
                    location={item.location}
                    visible={item.visible}
                  >
                    {item.widget === "dxButton" && <Button {...item.options} />}
                    {!!item.render && item.render()}
                  </ToolbarItem>
                );
              })}

            {/* <PermissionContainer permission={""}> */}
            <ToolbarItem
              visible={
                visibleExport &&
                (permissionStore.buttons?.includes(permissionExport) ||
                  permissionExport === "")
              }
              location="before"
              name={"exportButton"}
              showText="always"
              widget="dxButton"
              options={{
                text: t("Export Excel"),
              }}
            ></ToolbarItem>
            {/* </PermissionContainer> */}

            <ToolbarItem location="after">
              <div
                id={"myColumnChooser"}
                className={"search-form__settings cursor-pointer"}
                onClick={() => chooserVisible.toggle()}
              >
                <Icon name={"setting"} width={14} height={14} />
                <Tooltip
                  target="#myColumnChooser"
                  showEvent="dxhoverstart"
                  hideEvent="dxhoverend"
                  container={"#myColumnChooser"}
                >
                  <div className={"z-[9999]"} style={{ zIndex: 9999 }}>
                    {t("ColumnToggleTooltip")}
                  </div>
                  &nbsp;
                </Tooltip>
              </div>
            </ToolbarItem>
            <ToolbarItem location="after">
              <CustomColumnChooser
                title={t("ToggleColum")}
                widthPopUp={widthPopUp}
                applyText={t("Apply")}
                cancelText={t("Cancel")}
                selectAllText={t("SelectAll")}
                container={`#${id}`}
                button={"#myColumnChooser"}
                visible={chooserVisible.visible}
                columns={columns}
                onHiding={onHiding}
                onApply={onApply}
                actualColumns={realColumn}
                getColumnOptionCallback={
                  dataGridRef.current?.instance.columnOption || (() => {})
                }
              />
            </ToolbarItem>
          </Toolbar>
          {isShowEditting && (
            <Editing
              mode={"popup"}
              useIcons={true}
              allowUpdating={true}
              allowDeleting={true}
              allowAdding={true}
              // allowUpdating={false}
              // allowDeleting={false}
              // allowAdding={false}
              popup={popupSettingsMemo}
              form={formSettingsPopup.current ?? {}}
              confirmDelete={false} // custom confirm delete dialog
              onChangesChange={onEditRowChanges}
            >
              <Texts
                confirmDeleteMessage={t(
                  "Are you sure to delete those records?"
                )}
                ok={t("OK")}
                cancel={t("Cancel")}
              />
            </Editing>
          )}

          {isShowEditting && (
            <Column
              visible={allowInlineEdit}
              type="buttons"
              width={110}
              fixed={false}
              allowResizing={false}
            >
              {isShowIconEdit && (
                <DxButton
                  visible={checkPermision(permissionEdit) && editable}
                  cssClass={"mx-1 cursor-pointer"}
                  name="edit"
                  icon={"/images/icons/edit.svg"}
                  onClick={(e: any) => {
                    onEditRow?.(e);
                  }}
                />
              )}
              <DxButton
                visible={checkPermision(permissionDelete) && editable}
                cssClass={"mx-1 cursor-pointer"}
                name="delete"
                icon={"/images/icons/trash.svg"}
                onClick={(e: any) => {
                  onDeleteRows?.(e);
                }}
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
          <Selection
            mode={!isHiddenCheckBox ? "multiple" : "none"}
            selectAllMode="page"
          />
          {isSingleSelection && <Selection mode={"none"} />}
          {isSingleSelection && (
            <Column
              dataField={"fake"}
              width={50}
              caption={t("")}
              showInColumnChooser={false}
              allowFiltering={false}
              allowSearch={false}
              allowResizing={false}
              cellRender={(e: any) => {
                const {
                  data,
                  row: { isSelected, rowIndex },
                  value,
                  key,
                } = e;
                return (
                  <SelectionCheckBox
                    isSelected={isSelected}
                    key={key}
                    gridRef={dataGridRef}
                    rowIndex={rowIndex}
                  />
                );
              }}
              dataType={"boolean"}
            ></Column>
          )}
          {!isHidenHeaderFilter && (
            <Scrolling
              renderAsync={true}
              mode={"standard"}
              showScrollbar={"always"}
              rowRenderingMode={"standard"}
            />
          )}
          <GridLoadPanel enabled={true} />
          {columns.map((col: any) => {
            if (col.columns) {
              const { columns: nestedColumns, ...rest } = col;
              return (
                <Column
                  key={col.dataField}
                  filterType="exclude"
                  headerFilter={{
                    allowSearch: true,
                    search: {
                      enabled: true,
                    },
                  }}
                  {...rest}
                  allowSorting={true}
                >
                  {nestedColumns.map((nestedCol: any) => {
                    return (
                      <Column
                        {...nestedCol}
                        filterType="exclude"
                        headerFilter={{
                          allowSearch: true,
                          search: {
                            enabled: true,
                          },
                        }}
                        cellRender={nestedCol.cellRender}
                      />
                    );
                    // return <Column cellRender={(data: any) => {
                    //   console.log(data)
                    //   return (
                    //     <span>{data.data.detail_TalkDTime?.[0]}</span>
                    //   )
                    // }} />
                  })}
                </Column>
              );
            } else {
              return (
                <Column
                  key={col.dataField}
                  filterType="exclude"
                  headerFilter={{
                    allowSearch: true,
                    search: {
                      enabled: true,
                    },
                  }}
                  {...col}
                  allowSorting={true}
                />
              );
            }
          })}
        </DataGrid>
      </ScrollView>
    </div>
  );
};
5000;
export const GridViewCustomize = forwardRef(
  (props: Omit<GridViewProps, "ref">, ref: any) => {
    if (props.isLoading) {
      return null;
    } else {
      return <GridViewRaw ref={ref} {...props} />;
    }
  }
);
GridViewCustomize.displayName = "GridViewCustomize";

const SelectionCheckBox = ({
  key,
  gridRef,
  rowIndex,
  isSelected,
}: {
  key: string;
  gridRef: RefObject<DataGrid>;
  rowIndex: number;
  isSelected: boolean;
}) => {
  return (
    <CheckBox
      defaultValue={isSelected}
      data-key={key}
      onValueChanged={(e: any) => {
        // console.log("select event:", e, gridRef);
        const { component, value, previousValue } = e;
        if (value) {
          gridRef.current?.instance?.selectRowsByIndexes([rowIndex]);
        } else {
          gridRef.current?.instance?.selectRowsByIndexes([]);
        }
        gridRef.current?.instance.refresh();
      }}
    />
  );
};
