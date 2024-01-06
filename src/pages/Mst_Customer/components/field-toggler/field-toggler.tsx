import { useI18n } from "@/i18n/useI18n";
import { ColumnOptions } from "@/types";
import List from "devextreme-react/list";
import Popup, { Position, ToolbarItem } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import { ItemReorderedEvent } from "devextreme/ui/list";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SelectedField } from "./selected-field";
import { CheckBox } from "devextreme-react";
import Toolbar from "devextreme-react/toolbar";

interface FieldTogglerProps {
  title: string;
  applyText: string;
  cancelText: string;
  selectAllText: string;
  container: any;
  button: any;
  visible: boolean;
  columns: ColumnOptions[];
  actualColumns: ColumnOptions[];
  onHiding: () => void;
  onApply: (columns: any[]) => void;
  storeKey?: string;
  position?: "left" | "right";
}

export default function FieldTogglerCustomize(props: FieldTogglerProps) {
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
    title,
    selectAllText,
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
    // selected columns are not the same as actual columns
    setSelectedItems(actualColumns.filter((c) => c.visible));
    backUpColumns.current = actualColumns.filter((c) => c.visible);
  }, [actualColumns]);

  const onSelectionChanged = useCallback(
    (e: any) => {
      setSelectedItems(e.component.option("selectedItems"));
      const selectedItems = e.component.option("selectedItems");
      if (selectedItems.length === 0) {
        setSelectAllValue(false);
      } else if (selectedItems.length < availableColumns.length) {
        setSelectAllValue(undefined);
      } else if (selectedItems.length === availableColumns.length) {
        setSelectAllValue(true);
      }
    },
    [setSelectedItems]
  );
  const applyButtonOptions = useMemo(() => {
    return {
      text: applyText,
      stylingMode: "contained",
      elementAttr: {
        class: "popup-button apply-button",
      },
      onClick: () => {
        const data = listRef.current?.instance?.option("selectedItems");
        // console.log("1111: on apply columns changes:", data)
        let value = data ?? [];
        if (value) {
          const customize = value.map((item) => {
            return {
              ...item,
              label: {
                text: item?.caption ?? "",
              },
            };
          });

          value = customize;
        }
        console.log("value ", value);
        onApply(value!);
      },
    };
  }, [listRef, columns, onApply]);

  const cancelButtonOptions = useMemo(() => {
    return {
      text: cancelText,
      stylingMode: "outlined",
      elementAttr: {
        class: "popup-button cancel-button",
      },
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
    if (changes.length === 0) {
      setSelectAllValue(false);
    } else if (changes.length < availableColumns.length) {
      setSelectAllValue(undefined);
    } else if (changes.length === availableColumns.length) {
      setSelectAllValue(true);
    }
  };

  const removeAllSelectedItem = () => {
    // I need remove all items from the selectedItems array
    setSelectedItems([]);
    setSelectAllValue(false);
  };
  const availableColumns = useMemo(() => {
    return columns.map((c) => ({
      ...c,
      visible: true,
    }));
  }, [columns]);
  const handleSelectAllChanged = (e: any) => {
    if (listRef.current) {
      if (e.value === true) {
        listRef.current.instance.selectAll();
        setSelectAllValue(true);
      } else if (e.value === false) {
        listRef.current.instance.unselectAll();
        setSelectAllValue(false);
      }
    }
  };
  const [selectAllValue, setSelectAllValue] = useState<any>(true);
  const selectAllItemMemo = useMemo(() => {
    return (
      <CheckBox
        className={"column-toggle__selectAll"}
        value={selectAllValue}
        onValueChanged={handleSelectAllChanged}
        text={`${selectAllText} (${availableColumns.length})`}
      />
    );
  }, [selectAllValue, availableColumns, actualColumns]);
  return (
    <Popup
      container={container}
      title={title}
      className={"column-chooser"}
      width={700}
      wrapperAttr={{
        class: "column-chooser",
      }}
      height={470}
      resizeEnabled={false}
      showCloseButton={true}
      dragEnabled={false}
      visible={visible}
      onHiding={onPopupHiding}
    >
      <Position at={"center"} my={"center"} of={`${container}`} />
      <div className={"w-full flex flex-row max-h-[350px]"}>
        <ScrollView className={"flex-1"} height={350} showScrollbar={"always"}>
          <List
            ref={listRef}
            dataSource={availableColumns}
            displayExpr={"caption"}
            keyExpr={"dataField"}
            searchEnabled={true}
            searchExpr={["caption"]}
            searchEditorOptions={{
              elementAttr: {
                class: "column-toggle__search",
              },
            }}
            className={"column-toggle__source"}
            selectionMode="multiple"
            // selectAllText={selectAllText}
            showSelectionControls={true}
            selectedItems={selectedItems}
            selectedItemKeys={selectedItems.map((item) => item.dataField)}
            onSelectionChanged={onSelectionChanged}
            pageLoadMode={"scrollBottom"}
          />
        </ScrollView>
        <div className={"separator-horizontal"} />
        <ScrollView
          className={"flex-1 column-toggle__dest"}
          height={350}
          showScrollbar={"always"}
        >
          <div className="pl-4 pt-1 flex  items-center justify-center dest-summary">
            <div className="font-bold">
              {`${t("Selected")} (${
                !!selectedItems ? selectedItems.length : 0
              })`}
            </div>
            <div className="ml-auto cursor-pointer text-[#FF0000]">
              <span
                className="text-red"
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
            className={""}
            pageLoadMode={"scrollBottom"}
            itemRender={(item: any) => {
              return (
                <SelectedField
                  onClick={() => removeSelectedItem(item)}
                  item={item}
                />
              );
            }}
            onItemReordered={handleChangeOrder}
          />
        </ScrollView>
      </div>

      <ToolbarItem location="before" toolbar="bottom">
        {selectAllItemMemo}
        {/*<CheckBox */}
        {/*  className={"column-toggle__selectAll"} */}
        {/*  defaultValue={selectedItems.length === availableColumns.length}*/}
        {/*  onValueChanged={handleSelectAllChanged} text={`${selectAllText} (${availableColumns.length})`} />*/}
      </ToolbarItem>
      <ToolbarItem
        widget="dxButton"
        location="after"
        toolbar="bottom"
        options={applyButtonOptions}
      />

      <ToolbarItem
        widget="dxButton"
        location="after"
        toolbar="bottom"
        options={cancelButtonOptions}
      />
    </Popup>
  );
}
