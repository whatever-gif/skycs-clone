import {
  Button,
  CheckBox,
  DataGrid,
  LoadPanel,
  Tooltip,
} from "devextreme-react";
import {
  Column,
  ColumnChooser,
  Button as DxButton,
  Editing,
  LoadPanel as GridLoadPanel,
  HeaderFilter,
  IStateStoringProps,
  Pager,
  Paging,
  Scrolling,
  Search,
  Selection,
  Texts,
  Toolbar,
  Item as ToolbarItem,
} from "devextreme-react/data-grid";

import CustomStore from "devextreme/data/custom_store";
import {
  ForwardedRef,
  forwardRef,
  memo,
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
import {
  EditingStartEvent,
  EditorPreparingEvent,
} from "devextreme/ui/data_grid";
import { differenceBy } from "lodash-es";

import { checkPermision } from "@/components/PermissionContainer";
import { headerFilterAllowTranslate } from "@/packages/common";
import {
  GridCustomerToolBarItem,
  GridCustomToolbar,
} from "@packages/ui/base-gridview/components/grid-custom-toolbar";
import { useSavedState } from "@packages/ui/base-gridview/components/use-saved-state";
import { popupGridStandardStateAtom } from "@packages/ui/base-gridview/store/popup-grid-store";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { Icon } from "../icons";
import PageStandardSizeComponent, {
  Config,
} from "./components/PageStandardSize";
import { PopupGridStandardPageNavigator } from "./components/popup-grid-page-navigator-standard";
import { PopupGridStandardPageSummary } from "./components/popup-grid-page-summary-standard";
import {
  customizeGridSelectionKeysAtom,
  dataGridAtom,
  hidenMoreAtom,
  loadingColumnAtom,
  SelectionKeyAtom,
} from "./store/normal-grid-store";
import { ColumnOptions, ToolbarItemProps } from "./types";
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

interface GridViewProps {
  id?: string;
  isHiddenCheckBox?: boolean;
  isHidenHeaderFilter?: boolean;
  defaultPageSize?: number;
  dataSource: CustomStore | Array<any> | any;
  columns: ColumnOptions[];
  allowSelection: boolean;
  ref: ForwardedRef<any>;
  onReady?: (ref: any) => void;
  allowInlineEdit?: boolean;
  isShowIconEdit?: boolean;
  onEditorPreparing?: (e: EditorPreparingEvent<any, any>) => void;
  onSaveRow?: (option: any) => void;
  isLoading?: boolean;
  fetchData?: any;
  autoFetchData?: boolean;
  keyExpr?: string | string[];
  widthPopUp?: number;
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
  isShowEditting?: boolean;
  isShowEditCard?: boolean;
  hidenTick?: boolean;
  cssClass?: string;
  locationCustomToolbar?: "center" | "before" | "after";
  customerHeight?: number;
  permissionEdit?: string;
  permissionDelete?: string;
  permissionDeleteMulti?: string;
  translateFilter?: string[];
  isSingleSelection?: boolean;
}

const GridViewRaw = memo(
  ({
    permissionEdit = "",
    permissionDelete = "",
    permissionDeleteMulti = "",
    cssClass,
    onEditorPreparing,
    isLoading = false,
    fetchData,
    autoFetchData = true,
    keyExpr,
    onDeleteRows,
    onSelectionChanged,
    dataSource,
    widthPopUp,
    columns,
    isHidenHeaderFilter = false,
    onReady,
    allowInlineEdit = false,
    isShowIconEdit = true,
    popupSettings,
    formSettings,
    toolbarItems,
    onEditRowChanges,
    onEditingStart,
    storeKey,
    onEditRow,
    isShowEditting = false,
    customToolbarItems,
    isHiddenCheckBox = false,
    isSingleSelection = false,
    locationCustomToolbar,
    customerHeight = 0,
    id = "gridContainer",
    translateFilter = [],
  }: GridViewProps) => {
    const setHidenMore = useSetAtom(hidenMoreAtom);
    let dataGridRef = useRef<DataGrid | null>(null);
    const setDataGrid = useSetAtom(dataGridAtom);
    const setSelectionKey = useSetAtom(SelectionKeyAtom);
    const popupSettingsMemo = useMemo(() => popupSettings, [popupSettings]);
    const [config, setConfig] = useState<Config>({
      pageIndex: 0,
      pageSize: 100,
      pageCount: 0,
      totalCount: 0,
    });

    const formSettingsPopup = useRef<any>();
    useEffect(() => {
      formSettingsPopup.current = { ...formSettings };
      setDataGrid(dataGridRef);
    });
    const windowSize = useWindowSize();
    const onChangePageSize = (pageSize: number) => {
      dataGridRef.current?.instance.pageSize(pageSize);
      dataGridRef.current?.instance.pageIndex(0);
      doFetchData();
    };
    const [visible, setVisible] = useState(false);
    const { saveState, loadState } = useSavedState<ColumnOptions[]>({
      storeKey,
    });
    const chooserVisible = useVisibilityControl({ defaultVisible: false });
    const [realColumn, setRealColumn] = useReducer(
      (state: any, changes: any) => {
        // save changes into localStorage
        saveState(changes);
        return changes;
      },
      columns
    );

    const [isLoadingState, setIsLoadingState] = useState(true);
    // I want to restore columns from localStorage if it exists
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

    const onToolbarPreparing = useCallback((e: any) => {
      e.toolbarOptions.items.push({
        widget: "dxButton",
        location: "after",
        options: {
          icon: "/images/icons/settings.svg",
          elementAttr: {
            id: "myColumnChooser",
          },
          onClick: () => setVisible(!visible),
        },
      });
    }, []);
    const setSelectionKeysAtom = useSetAtom(customizeGridSelectionKeysAtom);
    const setLoadingColumn = useSetAtom(loadingColumnAtom);
    const handleSelectionChanged = useCallback((e: any) => {
      // setHidenMore(e.selectedRowKeys);
      // ----
      setLoadingColumn(e.selectedRowKeys);
      setSelectionKey(e.selectedRowKeys);
      setSelectionKeysAtom(e.selectedRowKeys);
      onSelectionChanged?.(e.selectedRowKeys);
    }, []);
    const handleEditingStart = useCallback((e: EditingStartEvent) => {
      onEditingStart?.(e);
    }, []);
    const handleEditCancelled = useCallback(() => {}, []);
    const switchEditMode = (e: any, isOn: boolean) => {
      if (isOn) {
        e.component.option("sorting.mode", "none");
        e.component.option("headerFilter.visible", false);
      } else {
        e.component.option("sorting.mode", "single");
        e.component.option("headerFilter.visible", true);
      }
    };
    const handleSaved = useCallback((e: any) => {
      logger.debug("saved event:", e);
      switchEditMode(e, false);
    }, []);
    const handleAddingNewRow = () => {};

    const { t, tf } = useI18n("Common");

    // const onCancelDelete = useCallback(() => {}, []);
    // const onDelete = useCallback(() => {
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
    const handlePageChanged = useCallback((pageIndex: number) => {
      dataGridRef.current?.instance.pageIndex(pageIndex);
      doFetchData();
    }, []);

    const allToolbarItems: ToolbarItemProps[] = [
      ...(toolbarItems || []),
      {
        location: "before",
        render: () => {
          return (
            <GridCustomToolbar items={customToolbarItems} ref={dataGridRef} />
          );
        },
      },
      !isHidenHeaderFilter
        ? {
            location: "after",
            render: () => {
              return (
                <PageStandardSizeComponent
                  // config={config}
                  onChangePageSize={onChangePageSize}
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
                <PopupGridStandardPageNavigator
                  // config={config}
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
              // return <PopupGridStandardPageSummary config={config} />;
              return <PopupGridStandardPageSummary />;
            },
          }
        : {},
    ];

    const setGridAtom = useSetAtom(popupGridStandardStateAtom);

    const [data, setData] = useState(dataSource);

    const doFetchData = async () => {
      const clearAtom = () => {
        setHidenMore([]);
        setSelectionKeysAtom([]);
        setSelectionKey([]);
        setLoadingColumn([]);
        // setSelectionKeys([]);
        onSelectionChanged([]);
      };
      clearAtom();
      if (!fetchData) return false;
      setIsLoadingState(true);
      fetchData(dataGridRef?.current?.instance?.pageIndex).then((resp: any) => {
        setGridAtom({
          pageIndex: resp.PageIndex ?? 0,
          pageSize: resp.PageSize ?? 0,
          pageCount: resp.PageCount ?? 0,
          totalCount: resp.ItemCount ?? 0,
          ref: dataGridRef.current,
        });

        // setConfig({
        //   pageIndex: resp.PageIndex ?? 0,
        //   pageSize: resp.PageSize ?? 0,
        //   pageCount: resp.PageCount ?? 0,
        //   totalCount: resp.ItemCount ?? 0,
        // });
        if (resp?.DataList) {
          setData(resp.DataList);
        }
        setIsLoadingState(false);
      });
    };

    useEffect(() => {
      let cr = dataGridRef.current as any;
      if (!cr?.refetchData && cr) {
        cr.refetchData = (pageIndex?: number) => {
          if (!pageIndex) pageIndex = 0;
          dataGridRef.current?.instance.pageIndex(pageIndex);
          doFetchData();
        };
      }
      if (autoFetchData)
        setTimeout(() => {
          doFetchData();
        }, 0);
    }, []);

    const setRef = (ref: any) => {
      dataGridRef.current = ref;
      // innerGridRef = ref;
      onReady?.(ref);
    };

    const searchEditorOptions = {
      placeholder: "Search value",
      mode: "text",
      onValueChanged: (e: any) => {
        // handle the value change here
      },
    };

    return (
      <div className={"base-gridview grid-view-customize bg-white"}>
        <ScrollView showScrollbar={"always"}>
          <LoadPanel
            visible={
              dataSource.length >= 0 ? false : isLoading || isLoadingState
            }
            position={{ of: `#${id}` }}
          />
          <DataGrid
            className={cssClass}
            keyExpr={keyExpr}
            errorRowEnabled={false}
            cacheEnabled={false}
            id={id}
            height={`${
              customerHeight ? customerHeight : windowSize.height - 125
            }px`}
            width={"100%"}
            ref={(r) => setRef(r)}
            dataSource={data}
            noDataText={t("There is no data")}
            remoteOperations={false}
            columnAutoWidth={true}
            repaintChangesOnly
            showBorders
            onInitialized={() => {
              // if (dataGridRef.current) {
              //   let cr = dataGridRef.current as any;
              //   cr.refetchData = () => {
              //     doFetchData();
              //   };
              // }
              onReady?.(dataGridRef);
            }}
            // onContentReady={() => {
            // setGridAtom({
            //   pageIndex: dataGridRef.current?.instance.pageIndex() ?? 0,
            //   pageSize: dataGridRef.current?.instance.pageSize() ?? 0,
            //   pageCount: dataGridRef.current?.instance.pageCount() ?? 0,
            //   totalCount: dataGridRef.current?.instance.totalCount() ?? 0,
            //   ref: dataGridRef.current,
            // });
            // }}
            allowColumnResizing
            showColumnLines
            showRowLines
            columnResizingMode={"widget"}
            // onToolbarPreparing={onToolbarPreparing}
            onSelectionChanged={handleSelectionChanged}
            onEditorPreparing={onEditorPreparing}
            onEditingStart={handleEditingStart}
            onEditCanceled={handleEditCancelled}
            onSaved={handleSaved}
            onInitNewRow={handleAddingNewRow}
            onSaving={() => {}}
            onRowRemoved={(e: any) => {
              // to support custom delete confirmation
              e.cancel = true;
            }}
            onRowRemoving={(e: any) => {
              // to support custom delete confirmation
              e.cancel = true;
            }}
            defaultSelectionFilter={undefined}
            defaultSelectedRowKeys={[]}
            // selection={{
            //   mode: "multiple",
            //   showCheckBoxesMode: "always",
            // }}
            // stateStoring={stateStoring}
          >
            <Selection
              mode={!isHiddenCheckBox ? "multiple" : "none"}
              selectAllMode="page"
              showCheckBoxesMode="always"
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
            <ColumnChooser enabled={true} mode={"select"}>
              <Search
                enabled={true}
                editorOptions={searchEditorOptions}
              ></Search>
            </ColumnChooser>
            <Pager visible={false} />
            <Paging enabled={true} defaultPageSize={100} />
            <HeaderFilter visible={true}>
              <Search enabled={true}></Search>
            </HeaderFilter>
            <Toolbar>
              {!!allToolbarItems &&
                allToolbarItems.map((item, index) => {
                  return (
                    <ToolbarItem
                      key={index}
                      location={item.location}
                      visible={item.visible ?? true}
                    >
                      {item.widget === "dxButton" && (
                        <Button {...item.options} />
                      )}
                      {!!item.render && item.render()}
                    </ToolbarItem>
                  );
                })}

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
                  applyText={t("Apply")}
                  cancelText={t("Cancel")}
                  selectAllText={t("SelectAll")}
                  container={`#${id}`}
                  widthPopUp={widthPopUp}
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
            {isShowEditting && checkPermision(permissionDeleteMulti) && (
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

            <Column
              visible={allowInlineEdit}
              type="buttons"
              width={110}
              fixed={false}
              allowResizing={false}
            >
              {isShowIconEdit && (
                <DxButton
                  cssClass={"mx-1 cursor-pointer"}
                  name="edit"
                  icon={"/images/icons/edit.svg"}
                  onClick={(e: any) => {
                    onEditRow?.(e);
                  }}
                  visible={checkPermision(permissionEdit)}
                />
              )}
              <DxButton
                cssClass={"mx-1 cursor-pointer"}
                name="delete"
                icon={"/images/icons/trash.svg"}
                onClick={(e: any) => {
                  onDeleteRows?.(e);
                }}
                visible={checkPermision(permissionDelete)}
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
              const obj: any = {
                ...col,
                filterType: "exclude",
              };

              if (translateFilter.includes(obj.dataField)) {
                return (
                  <Column
                    key={nanoid()}
                    {...obj}
                    headerFilter={headerFilterAllowTranslate(
                      data,
                      obj.dataField,
                      t("( Empty )"),
                      storeKey + "-filter"
                    )}
                  />
                );
              }

              return (
                <Column
                  headerFilter={{
                    allowSearch: true,
                    search: {
                      enabled: true,
                    },
                  }}
                  key={nanoid()}
                  {...obj}
                />
              );
            })}
          </DataGrid>
        </ScrollView>
      </div>
    );
  }
);

export const GridViewStandard = forwardRef(
  (props: Omit<GridViewProps, "ref">, ref: any) => {
    if (props.isLoading) {
      return null;
    } else {
      return <GridViewRaw ref={ref} {...props} />;
    }
  }
);
GridViewStandard.displayName = "GridViewStandard";
