import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import { useI18n } from "@/i18n/useI18n";
import { IItemProps } from "devextreme-react/form";
import List from "devextreme-react/list";
import ScrollView from "devextreme-react/scroll-view";
import { SelectedColumn } from "@packages/ui/column-toggler/selected-column";
import { useCallback, useMemo, useRef, useState } from "react";
import { ColumnOptions } from "@packages/ui/base-gridview";
import { ItemReorderedEvent } from "devextreme/ui/list";

interface SearchPanelSettingsProps {
  visible: boolean;
  onClose: () => void;
  container: string;
  button: string;
  items: IItemProps[];
  onApply: (items: IItemProps[]) => void;
}

export const SearchPanelSettings = ({
  visible,
  onClose,
  items,
  container,
  button,
  onApply,
}: SearchPanelSettingsProps) => {
  const { t } = useI18n("Common");
  const [selectedItems, setSelectedItems] = useState<ColumnOptions[]>(items);
  const removeSelectedItem = (item: ColumnOptions) => {
    // I need remove item from the selectedItems array
    const changes = [...selectedItems];
    changes.splice(changes.indexOf(item), 1);
    setSelectedItems(changes);
  };
  const listRef = useRef<List>(null);

  const applyButtonOptions = useMemo(() => {
    return {
      text: t("Apply"),
      stylingMode: "contained",
      onClick: () => {
        const selectedItems =
          listRef.current?.instance?.option("selectedItems");
        let value = selectedItems ?? [];
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
        onApply(value!);
      },
    };
  }, [listRef, items, onApply]);

  const cancelButtonOptions = useMemo(() => {
    return {
      text: t("Cancel"),
      stylingMode: "outlined",
      onClick: () => {
        // setSelectedItems(backUpColumns.current);
        onClose();
      },
    };
  }, [items, setSelectedItems]);
  const removeAllSelectedItem = useCallback(() => {
    // I need remove all items from the selectedItems array
    setSelectedItems([]);
  }, []);

  const onSelectionChanged = useCallback(
    (e: any) => {
      setSelectedItems(e.component.option("selectedItems"));
    },
    [setSelectedItems]
  );
  const handleChangeOrder = useCallback(
    ({ toIndex, fromIndex, component, itemData }: ItemReorderedEvent) => {
      const changes = [...selectedItems];
      changes.splice(toIndex, 0, changes.splice(fromIndex, 1)[0]);
      setSelectedItems(changes.map((item, idx) => ({ ...item, order: idx })));
    },
    []
  );

  return (
    <Popup
      visible={visible}
      showCloseButton={true}
      width={700}
      height={580}
      title={t("SearchPanelSettings")}
      onHiding={onClose}
    >
      <Position at="left top" my="left top" of={`${container} ${button}`} />
      <div className={"w-full flex flex-row max-h-[400px]"}>
        <ScrollView className={"flex-1"} height={350} showScrollbar={"always"}>
          <List
            ref={listRef}
            dataSource={items}
            displayExpr={"caption"}
            keyExpr={"dataField"}
            searchEnabled={true}
            searchExpr={"dataField"}
            selectionMode="all"
            selectAllText={t("SelectAll")}
            showSelectionControls={true}
            selectedItems={selectedItems}
            selectedItemKeys={selectedItems.map((item) => item.dataField)}
            onSelectionChanged={onSelectionChanged}
            pageLoadMode={"scrollBottom"}
          />
        </ScrollView>
        <ScrollView className={"flex-1"} height={350} showScrollbar={"always"}>
          <div className="px-4 py-2 flex  items-center justify-center">
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
        options={applyButtonOptions}
      />

      <ToolbarItem
        widget="dxButton"
        location="center"
        toolbar="bottom"
        options={cancelButtonOptions}
      />
    </Popup>
  );
};
