import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { Icon } from "@packages/ui/icons";
import { Button, CheckBox } from "devextreme-react";
import DataGrid, {
  Column,
  Button as DxButton,
  Editing,
  Selection,
  Toolbar,
  Item as ToolbarItem,
} from "devextreme-react/data-grid";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { RefObject, useRef } from "react";

const selectionAtom = atom<string[]>([]);

export const DeleteButton = ({
  onClick,
}: {
  onClick: (keys: string[]) => void;
}) => {
  const { t } = useI18n("Common");
  const selectionKeys = useAtomValue(selectionAtom);
  const handleClick = (e: any) => {
    onClick(selectionKeys);
  };
  if (selectionKeys.length === 0) return null;
  return (
    <Button
      stylingMode={"contained"}
      type={"default"}
      text={t("Delete")}
      onClick={handleClick}
    />
  );
};

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
          gridRef.current?.instance.refresh();
        }
      }}
    />
  );
};
export const TestGridPage = () => {
  const data = [
    {
      id: nanoid(),
      name: "Node 1",
      level: 1,
      path: "/1",
      hasChildren: true,
    },
    {
      id: nanoid(),
      name: "Node 1.1",
      level: 2,
      path: "/1/1",
      hasChildren: true,
    },
    {
      id: nanoid(),
      name: "Node 1.1.1",
      level: 3,
      path: "/1/1/1",
    },
    {
      id: nanoid(),
      name: "Node 1.1.1",
      level: 3,
      path: "/1/1/1",
    },
    {
      id: nanoid(),
      name: "Node 1",
      level: 1,
      path: "/1",
      hasChildren: true,
    },
    {
      id: nanoid(),
      name: "Node 1.1",
      level: 2,
      path: "/1/1",
      hasChildren: true,
    },
    {
      id: nanoid(),
      name: "Node 1.1.1",
      level: 3,
      path: "/1/1/1",
    },
  ];
  const columns = [
    {
      dataField: "name",
      cellRender: ({ row: { data }, value }: any) => {
        return (
          <div className={"flex items-center"}>
            {data.level > 1 && (
              <span style={{ marginLeft: `${(data.level - 1) * 20}px` }}></span>
            )}
            <div className={"flex items-center"}>
              {data.hasChildren && <Icon className={""} name="expandDown" />}
              <span className={data.hasChildren ? "ml-1" : ""}>
                {data.name}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      dataField: "Abc",
    },
    {
      dataField: "id",
    },
  ];
  const gridRef = useRef<DataGrid>(null);
  const setSelectionKeysAtom = useSetAtom(selectionAtom);
  const handleSelectionChanged = (e: any) => {
    setSelectionKeysAtom(e.selectedRowKeys as string[]);
    // onSelectionChanged?.(e.selectedRowKeys);
  };

  return (
    <AdminContentLayout>
      <AdminContentLayout.Slot name="Header">Test Grid</AdminContentLayout.Slot>
      <AdminContentLayout.Slot name="Content">
        <DataGrid
          dataSource={data}
          showBorders
          showColumnLines
          showRowLines
          keyExpr={"id"}
          ref={gridRef}
          onSelectionChanged={handleSelectionChanged}
          onRowClick={(e: any) => {
            e.event.preventDefault();
            e.event.stopPropagation();
          }}
        >
          <Selection mode="none" />
          <Column
            dataField={"fake"}
            caption={"dxCheckBox"}
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
                  gridRef={gridRef}
                  rowIndex={rowIndex}
                />
              );
            }}
            dataType={"boolean"}
          ></Column>
          <Editing
            mode={"row"}
            useIcons={true}
            allowUpdating={true}
            allowDeleting={true}
          ></Editing>
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
          <Toolbar>
            <ToolbarItem
              location={"before"}
              render={(e: any) => {
                return (
                  <DeleteButton
                    onClick={(keys: string[]) => console.log(keys)}
                  />
                );
              }}
            />
          </Toolbar>

          {columns.map((column: any) => {
            return <Column key={column.dataField} {...column} />;
          })}
        </DataGrid>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
