import { Button, DataGrid, LoadPanel, Tooltip } from "devextreme-react";
import {
  Column,
  ColumnChooser,
  ColumnFixing,
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
  useState,
} from "react";

import ScrollView from "devextreme-react/scroll-view";
import "./base-gridview.scss";

import { checkPermision } from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { logger } from "@/packages/logger";
import { useVisibilityControl } from "@packages/hooks";
import { useWindowSize } from "@packages/hooks/useWindowSize";
import { GridCustomToolbar } from "@packages/ui/base-gridview/components/grid-custom-toolbar";
import { PopupGridPageNavigator } from "@packages/ui/base-gridview/components/popup-grid-page-navigator";
import { PopupGridPageSummary } from "@packages/ui/base-gridview/components/popup-grid-page-summary";
import { useSavedState } from "@packages/ui/base-gridview/components/use-saved-state";
import { popupGridStateAtom } from "@packages/ui/base-gridview/store/popup-grid-store";
import CustomColumnChooser from "@packages/ui/column-toggler/custom-column-chooser";
import { IFormOptions } from "devextreme-react/form";
import { IPopupOptions } from "devextreme-react/popup";
import {
  EditingStartEvent,
  EditorPreparingEvent,
} from "devextreme/ui/data_grid";
import { useSetAtom } from "jotai";
import { differenceBy } from "lodash-es";
import { Icon } from "../icons";
import { DeleteConfirmationBox } from "../modal";
import { ColumnOptions, ToolbarItemProps } from "./types";
import { PopupGridPageNavigatorPopUp } from "./components/popup-grid-page-navigator-PopUp";
import { PopUpGridPageSummary } from "./components/popup-grid-page-summary-PopUp";

interface GridViewProps {
  permissionEdit?: string;
  permissionDelete?: string;
  permissionDeleteMulti?: string;
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
  checkboxMode?: "always" | "none" | "onClick" | "onLongTap";
  height?: number;
  defaultSelectionFilter?: any;
  defaultSelectedRowKeys?: any;
  editable?: boolean;
  showSelected?: boolean;
  handleExport?: any;
}

const GridViewRaw = ({
  ref,
  permissionEdit,
  permissionDelete,
  permissionDeleteMulti,
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
  checkboxMode = "always",
  height,
  defaultSelectionFilter,
  defaultSelectedRowKeys = [],
  editable = true,
  showSelected = false,
  handleExport,
}: GridViewProps) => {
  const dataGridRef = useRef<DataGrid | null>(null);
  const popupSettingsMemo = useMemo(() => popupSettings, [popupSettings]);
  const formSettingsPopup = useRef<any>();
  useEffect(() => {
    formSettingsPopup.current = { ...formSettings };
  });
  const chooserVisible = useVisibilityControl({ defaultVisible: false });
  const windowSize = useWindowSize();
  const onChangePageSize = (pageSize: number) => {
    dataGridRef.current?.instance.pageSize(pageSize);
  };
  const [visible, setVisible] = useState(false);

  const { t: common } = useI18n("Common");

  const { saveState, loadState } = useSavedState<ColumnOptions[]>({ storeKey });

  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
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
  }, [chooserVisible, saveState]);

  const onHiding = useCallback(() => {
    chooserVisible.close();
  }, []);

  const [realColumn, setRealColumn] = useReducer((state: any, changes: any) => {
    // save changes into localStorage
    saveState(changes);
    return changes;
  }, columns);

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
  const [selectionKeys, setSelectionKeys] = useState<string[]>(
    defaultSelectedRowKeys ?? []
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const handleSelectionChanged = useCallback((e: any) => {
    setSelectionKeys(e.selectedRowKeys);
    onSelectionChanged?.(e.selectedRowKeys);
  }, []);

  const handleEditingStart = useCallback((e: EditingStartEvent) => {
    logger.debug("e:", e);
    onEditingStart?.(e);
  }, []);
  const handleEditCancelled = useCallback(() => {}, []);

  const handleSaved = useCallback((e: any) => {}, []);
  const handleAddingNewRow = () => {};

  const { t, tf } = useI18n("Common");
  // let innerGridRef = useRef<DataGrid>(null);

  const setRef = (ref: any) => {
    dataGridRef.current = ref;
    // innerGridRef = ref;
  };

  const onCancelDelete = useCallback(() => {}, []);
  const onDelete = useCallback(() => {
    onDeleteRows?.(selectionKeys);
  }, [selectionKeys]);
  const onDeleteSingle = useCallback(() => {
    if (deletingId) {
      onDeleteRows?.([deletingId]);
    }
  }, [deletingId]);
  const controlConfirmBoxVisible = useVisibilityControl({
    defaultVisible: false,
  });
  const controlDeleteSingleConfirmBox = useVisibilityControl({
    defaultVisible: false,
  });
  const handleConfirmDelete = useCallback(() => {
    controlConfirmBoxVisible.open();
  }, []);
  const handlePageChanged = useCallback((pageIndex: number) => {
    dataGridRef.current?.instance.pageIndex(pageIndex);
  }, []);

  const allToolbarItems: ToolbarItemProps[] = [
    ...(toolbarItems || []),
    {
      location: "before",
      render: () => <GridCustomToolbar items={customToolbarItems} />,
    },
    {
      visible: checkPermision(permissionDeleteMulti) && editable,
      location: "before",
      widget: "dxButton",
      options: {
        text: t("Delete"),
        onClick: handleConfirmDelete,
        visible: selectionKeys.length >= 1,
        stylingMode: "contained",
        type: "default",
      },
    },
    {
      location: "after",
      render: () => {
        return (
          <PageSize
            title={t("Showing")}
            onChangePageSize={onChangePageSize}
            allowdPageSizes={[100, 200, 500, 1000, 3000, 5000]}
            showAllOption={true}
            showAllOptionText={t("ShowAll")}
            defaultPageSize={100}
          />
        );
      },
    },
    {
      location: "after",
      render: () => {
        return <PopupGridPageNavigatorPopUp onPageChanged={handlePageChanged} />;
      },
    },
    {
      location: "after",
      render: () => {
        return <PopUpGridPageSummary />;
      },
    },
  ];

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
        controlDeleteSingleConfirmBox.open();

        // this one to clear `changes` set from grid.
        dataGridRef.current?.instance.cancelEditData();
      }
    }
    e.cancel = true;
  }, []);
  const setGridAtom = useSetAtom(popupGridStateAtom);

  return (
    <div className={"base-gridview grid-view-customize bg-white h-full"}>
      <ScrollView
        showScrollbar={"always"}
        // height={windowSize.height - 50}
        // className={"mb-5"}
      >
        <LoadPanel visible={isLoading} position={{ of: "#gridContainer" }} />
        <DataGrid
          onExporting={handleExport}
          keyExpr={keyExpr}
          errorRowEnabled={false}
          cacheEnabled={false}
          id="gridContainer"
          height={`${height ? height : windowSize.height - 130}px`}
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
            setGridAtom({
              pageIndex: dataGridRef.current?.instance.pageIndex() ?? 0,
              pageSize: dataGridRef.current?.instance.pageSize() ?? 0,
              pageCount: dataGridRef.current?.instance.pageCount() ?? 0,
              totalCount: dataGridRef.current?.instance.totalCount() ?? 0,
              ref: dataGridRef.current,
            });
          }}
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
          onSaving={innerSavingRowHandler}
          onRowRemoved={(e: any) => {
            // to support custom delete confirmation
            e.cancel = true;
          }}
          onRowRemoving={(e: any) => {
            // to support custom delete confirmation
            e.cancel = true;
          }}
          selection={{
            mode: "multiple",
            showCheckBoxesMode: checkboxMode,
          }}
          defaultSelectionFilter={defaultSelectionFilter}
          defaultSelectedRowKeys={defaultSelectedRowKeys}
          // stateStoring={stateStoring}
        >
          <ColumnChooser enabled={true} mode={"select"}>
            <Search enabled={true}></Search>
          </ColumnChooser>
          {/* <ColumnFixing enabled={true} /> */}
          <Pager visible={false} />
          <Paging enabled={true} defaultPageSize={100} />
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

            {showSelected && (
              <ToolbarItem location="before">
                <div className="font-semibold">
                  {common("Selected")}: {selectionKeys?.length}
                </div>
              </ToolbarItem>
            )}
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
                  {/*&nbsp; is required to make it display at top level*/}
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
                container={"#root"}
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
              confirmDeleteMessage={t("Are you sure to delete those records?")}
              ok={t("OK")}
              cancel={t("Cancel")}
            />
          </Editing>
          <Column
            visible={allowInlineEdit}
            type="buttons"
            width={110}
            fixed={false}
            allowResizing={false}
          >
            <DxButton
              visible={checkPermision(permissionEdit) && editable}
              cssClass={"mx-1 cursor-pointer"}
              name="edit"
              icon={"/images/icons/edit.svg"}
              onClick={(e: any) => {
                onEditRow?.(e);
              }}
            />
            <DxButton
              visible={checkPermision(permissionDelete) && editable}
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
          <Selection mode="multiple" selectAllMode="page" deferred={true} />
          <Scrolling
            renderAsync={true}
            mode={"standard"}
            showScrollbar={"always"}
            rowRenderingMode={"standard"}
          />
          <GridLoadPanel enabled={true} />
          {columns.map((col: any) => (
            <Column key={col.dataField} {...col} allowSorting={true} />
          ))}
        </DataGrid>
      </ScrollView>
      <DeleteConfirmationBox
        control={controlConfirmBoxVisible}
        title={t("Are you sure to delete selected records")}
        onYesClick={onDelete}
        onNoClick={onCancelDelete}
      />
      <DeleteConfirmationBox
        control={controlDeleteSingleConfirmBox}
        title={tf("Are you sure to delete this record?", deletingId)}
        onYesClick={onDeleteSingle}
        onNoClick={onCancelDelete}
      />
    </div>
  );
};

export const GridViewPopup = forwardRef(
  (props: Omit<GridViewProps, "ref">, ref: any) => {
    if (props.isLoading) {
      return null;
    } else {
      return <GridViewRaw ref={ref} {...props} />;
    }
  }
);
GridViewPopup.displayName = "GridViewPopup";
