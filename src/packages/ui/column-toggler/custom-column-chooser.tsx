import { useI18n } from "@/i18n/useI18n";
import { ColumnOptions } from "@packages/ui/base-gridview";
import List from "devextreme-react/list";
import Popup, { Position, ToolbarItem } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import { ItemReorderedEvent } from "devextreme/ui/list";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SelectedColumn } from "./selected-column";
import { compact, sortBy } from "lodash-es";
interface CustomColumnChooserProps {
  title: string;
  applyText: string;
  cancelText: string;
  selectAllText: string;
  container: any;
  button: any;
  visible: boolean;
  widthPopUp?: number;
  columns: ColumnOptions[];
  actualColumns: ColumnOptions[];
  onHiding: () => void;
  onApply: (columns: any[]) => void;
  storeKey?: string;
  position?: "left" | "right";
  getColumnOptionCallback:
    | ((dataField: string) => any)
    | ((dataField: string, option: string) => any);
}

export default function CustomColumnChooser(props: CustomColumnChooserProps) {
  const {
    container,
    button,
    visible,
    columns,
    actualColumns = [],
    onHiding,
    onApply,
    applyText,
    cancelText,
    widthPopUp,
    title,
    selectAllText,
    position = "right",
    getColumnOptionCallback,
  } = props;
  const { t } = useI18n("Common");
  const listRef = useRef<List>(null);
  const backUpColumns = useRef<ColumnOptions[]>(actualColumns);
  const onPopupHiding = useCallback(() => {
    // setSelectedItems(backUpColumns.current);
    onHiding();
  }, [onHiding]);
  const [selectedItems, setSelectedItems] = useState<ColumnOptions[]>(
    actualColumns.filter((c) => c.visible)
  );

  useEffect(() => {
    if (!getColumnOptionCallback) {
      return;
    }
    // selected columns are not the same as actual columns
    // setSelectedItems(actualColumns.filter((c) => c.visible));
    const realColumn = columns.map((item) => {
      const check = actualColumns.find((ac) => ac.dataField === item.dataField);
      if (check) {
        return {
          ...item,
          visible: true,
        };
      } else {
        return item;
      }
    });

    const currentVisibleColumns = compact(
      realColumn.filter((c: ColumnOptions) => {
        const isVisible = getColumnOptionCallback(c.dataField!, "visible");
        if (isVisible) {
          return c;
        }
        return undefined;
      })
    );
    //order columns
    const orderedColumns = sortBy(currentVisibleColumns, (c: ColumnOptions) => {
      const order = getColumnOptionCallback(c.dataField!, "visibleIndex");
      if (order) {
        return order;
      }
      return undefined;
    });

    setSelectedItems(orderedColumns);
    backUpColumns.current = orderedColumns;
  }, [actualColumns, getColumnOptionCallback]);

  const onSelectionChanged = useCallback(
    (e: any) => {
      setSelectedItems(e.component.option("selectedItems"));
    },
    [setSelectedItems]
  );
  const applyButtonOptions = useMemo(() => {
    return {
      text: applyText,
      stylingMode: "contained",
      onClick: () => {
        const data = listRef.current?.instance?.option("selectedItems");
        backUpColumns.current = data!;
        onApply(data!);
      },
    };
  }, [listRef, columns, onApply]);

  const cancelButtonOptions = useMemo(() => {
    return {
      text: cancelText,
      stylingMode: "outlined",
      onClick: () => {
        setSelectedItems(backUpColumns.current);
        onHiding();
      },
    };
  }, [columns, onHiding, setSelectedItems]);
  const handleChangeOrder = ({
    toIndex,
    fromIndex,
    component,
    itemData,
  }: ItemReorderedEvent) => {
    const changes = [...selectedItems];
    changes.splice(toIndex, 0, changes.splice(fromIndex, 1)[0]);
    setSelectedItems(changes);
  };
  const removeSelectedItem = (item: ColumnOptions) => {
    // I need remove item from the selectedItems array
    const changes = [...selectedItems];
    changes.splice(changes.indexOf(item), 1);
    setSelectedItems(changes);
  };

  const removeAllSelectedItem = () => {
    // I need remove all items from the selectedItems array
    setSelectedItems([]);
  };
  const availableColumns = useMemo(() => {
    return columns.map((c) => ({
      ...c,
      visible: true,
    }));
  }, [columns]);

  return (
    <Popup
      container={container}
      title={title}
      className={"column-chooser"}
      width={widthPopUp ?? 700}
      height={470}
      resizeEnabled={false}
      shading={false}
      showCloseButton={true}
      dragEnabled={false}
      visible={visible}
      onHiding={onPopupHiding}
    >
      <Position
        at={`${position} top`}
        my={`${position} top`}
        of={`${container} ${button}`}
      />
      <div className={"w-full flex flex-row max-h-[350]"}>
        <ScrollView className={"flex-1"} height={350} showScrollbar={"always"}>
          <List
            ref={listRef}
            dataSource={availableColumns}
            displayExpr={"caption"}
            keyExpr={"dataField"}
            searchEnabled={true}
            searchExpr={"caption"}
            selectionMode="all"
            selectAllText={selectAllText}
            showSelectionControls={true}
            selectedItems={selectedItems}
            selectedItemKeys={selectedItems.map((item) => item.dataField)}
            onSelectionChanged={onSelectionChanged}
            pageLoadMode={"scrollBottom"}
          />
        </ScrollView>
        <ScrollView className={"flex-1"} height={350} showScrollbar={"always"}>
          <div className="px-4 py-2 flex  items-center justify-center">
            <div
              className="font-bold"
              style={{
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {`${t("Selected")} (${
                !!selectedItems ? selectedItems.length : 0
              })`}
            </div>
            <div className="ml-auto cursor-pointer text-[#FF0000]">
              <span
                className="text-red"
                style={{
                  color: "#FF0000",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                onClick={() => removeAllSelectedItem()}
              >
                {t("RemoveAll")}
              </span>
            </div>
          </div>
          <List
            dataSource={selectedItems}
            itemDragging={{
              allowReordering: true,
              rtlEnabled: true,
            }}
            style={{
              height: "auto",
            }}
            scrollByContent={true}
            pageLoadMode={"scrollBottom"}
            itemRender={(item: any) => {
              return (
                <SelectedColumn
                  onClick={() => removeSelectedItem(item)}
                  item={item}
                />
              );
            }}
            onItemReordered={handleChangeOrder}
          />
        </ScrollView>
      </div>
      <ToolbarItem
        widget="dxButton"
        location="center"
        toolbar="bottom"
        cssClass="button-default "
        options={applyButtonOptions}
      />
      <ToolbarItem
        widget="dxButton"
        location="center"
        toolbar="bottom"
        cssClass="button-green"
        options={cancelButtonOptions}
      />
    </Popup>
  );
}
