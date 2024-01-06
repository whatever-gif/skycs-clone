import { Icon } from "@packages/ui/icons";
import DataGrid, {
  Column,
  Button as DxButton,
  Editing,
  Selection,
} from "devextreme-react/data-grid";
import { nanoid } from "nanoid";

export const TreeLikeGridPage = () => {
  const data = [
    {
      id: 1,
      name: "Node 1",
      level: 1,
      path: "/1",
      hasChildren: true,
    },
    {
      id: 2,
      name: "Node 1.1",
      level: 2,
      path: "/1/1",
      hasChildren: true,
    },
    {
      id: 3,
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
      id: 4,
      name: "Node 1",
      level: 1,
      path: "/1",
      hasChildren: true,
    },
    {
      id: 5,
      name: "Node 1.1",
      level: 2,
      path: "/1/1",
      hasChildren: true,
    },
    {
      id: 6,
      name: "Node 1.1.1",
      level: 3,
      path: "/1/1/1",
    },
    {
      id: 7,
      name: "Node 1.1.1",
      level: 4,
      path: "1//1/1/1",
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
  ];
  return (
    <div>
      <DataGrid
        dataSource={data}
        showBorders
        showColumnLines
        showRowLines
        keyExpr={"id"}
      >
        <Selection mode={"multiple"} selectAllMode={"page"} />
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

        {columns.map((column: any) => {
          return <Column key={column.dataField} {...column} />;
        })}
      </DataGrid>
    </div>
  );
};
