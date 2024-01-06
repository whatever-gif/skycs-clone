import DataGrid, { Button, Column, Editing } from "devextreme-react/data-grid";
import ODataStore from "devextreme/data/odata/store";

export const ListDealersPage = () => {
  return (
    <div className={"page"}>
      <DataGrid
        id="gridContainer"
        dataSource={dealers}
        columnAutoWidth
        keyExpr="id"
        showBorders
        allowColumnResizing
        columnResizingMode={"widget"}
      >
        <Column
          caption="STT"
          alignment={"center"}
          width={100}
          allowResizing={false}
          allowEditing={false}
          cellRender={({ rowIndex }) => <>{rowIndex}</>}
        />
        <Editing mode="row" useIcons={true} allowUpdating={true} />
        <Column
          caption={"Actions"}
          type="buttons"
          width={110}
          allowResizing={false}
        >
          <Button name="edit" />
          <Button name="delete" />
        </Column>
        <Column dataField={"dealerCode"} width={150} alignment={"center"} />
        <Column dataField={"cityCode"} width={150} alignment={"center"} />
        <Column dataField={"dealerName"} />
        <Column dataField={"size"} width={100} dataType={"number"} />
        <Column dataField={"taxCode"} />
        <Column dataField={"manager"} />
        <Column dataField={"sellingRegion"} />
        <Column dataField={"serviceRegion"} />
      </DataGrid>
    </div>
  );
};

const dealers = new ODataStore({
  url: "/dealers",
  key: "id",
  version: 3,
  beforeSend: (options) => {
    // console.log(options)
  },
  keyType: "Single",
});
export default ListDealersPage;
