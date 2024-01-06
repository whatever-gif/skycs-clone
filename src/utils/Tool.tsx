import { Button } from "antd";

const Tool = () => {
  const data = [
    "addColumn",
    "addRow",
    "beginCustomLoading",
    "byKey",
    "cancelEditData",
    "cellValue",
    "clearFilter",
    "clearGrouping",
    "clearSelection",
    "clearSorting",
    "closeEditCell",
    "collapseAdaptiveDetailRow",
    "collapseAll",
    "collapseRow",
    "columnCount",
    "columnOption",
    "deleteColumn",
    "deleteRow",
    "deselectAll",
    "deselectRows",
    "editCell",
    "editRow",
    "endCustomLoading",
    "expandAdaptiveDetailRow",
    "expandAll",
    "expandRow",
    "filter",
    "getCellElement",
    "getCombinedFilter",
    "getCustomFilterOperations",
    "getDataByKeys",
    "getDataProvider",
    "getDataSource",
    "getKeyByRowIndex",
    "getRowElement",
    "getRowIndexByKey",
    "getScrollable",
    "getScrollbarWidth",
    "getSelectedRowKeys",
    "getSelectedRowsData",
    "getTopVisibleRowData",
    "getTotalSummaryValue",
    "getVisibleColumnIndex",
    "getVisibleColumns",
    "getVisibleRows",
    "hasEditData",
    "hideColumnChooser",
    "isAdaptiveDetailRowExpanded",
    "isRowExpanded",
    "isRowFocused",
    "isRowSelected",
    "isScrollbarVisible",
    "keyOf",
    "navigateToRow",
    "pageCount",
    "pageIndex",
    "pageSize",
    "refresh",
    "repaintRows",
    "resize",
    "saveEditData",
    "searchByText",
    "selectAll",
    "selectRows",
    "selectRowsByIndexes",
    "showColumnChooser",
    "startSelectionWithCheckboxes",
    "state",
    "stopSelectionWithCheckboxes",
    "totalCount",
    "undeleteRow	",
    "updateDimensions",
  ];

  const getDxInstance = () => {
    const result = data.map((item: any) => {
      return `
      |_**${item}**_|||
      `;
    });

    console.log(JSON.stringify(result));
  };

  return (
    <div>
      <Button onClick={getDxInstance}>Get list dxInstance</Button>
    </div>
  );
};

export default Tool;
