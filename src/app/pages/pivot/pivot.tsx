import { PivotGrid } from "devextreme-react";
import ODataStore from "devextreme/data/odata/store";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";

export const Pivot = () => {
  return (
    <div>
      Pivot
      <PivotGrid
        dataSource={dataSource}
        allowSortingBySummary={true}
        allowFiltering={true}
        showBorders={true}
        showColumnTotals={false}
        showColumnGrandTotals={false}
        showRowTotals={false}
        showRowGrandTotals={false}
      />
    </div>

  );
};
const productsStore = new ODataStore({
  url: '/odata/staffs',
  key: 'id',
  version: 3,
  onLoaded: () => {
    // Event handling commands go here
  }
});
const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Country',
    width: 120,
    dataField: 'country',
    area: 'row',
    sortBySummaryField: 'Total',
  }, {
    caption: 'City',
    dataField: 'city',
    width: 150,
    area: 'row',
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column',
  }, {
    groupName: 'date',
    groupInterval: 'month',
    visible: false,
  }, {
    caption: 'Total',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
  }],
  store: productsStore,
});
export default Pivot;