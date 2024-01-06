import React from 'react';
import 'devextreme/data/odata/store';
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  Lookup,
  Selection, ColumnChooser
} from 'devextreme-react/data-grid';
import SimpleSearchForm from "@x/simple-search-form/SimpleSearchForm";
import ODataStore from 'devextreme/data/odata/store';

export default function TablePage() {
  return (
    <React.Fragment>
      <h2 className={'content-block'}>Tasks</h2>
      <SimpleSearchForm />
      <DataGrid
        className={'dx-card wide-card'}
        dataSource={dataSource as any}
        showBorders={false}
        allowColumnReordering
        columnHidingEnabled={true}
        columnFixing={{ enabled: true }}
        selection={{ mode: 'single', showCheckBoxesMode: 'always', allowSelectAll: true }}
      >
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <FilterRow visible={true} />
        <ColumnChooser enabled={true} mode="select" />

        <Column dataField={'Task_ID'} width={90} hidingPriority={2} />
        <Column
          dataField={'Task_Subject'}
          width={190}
          caption={'Subject'}
          hidingPriority={8}
        />
        <Column
          dataField={'Task_Status'}
          caption={'Status'}
          hidingPriority={6}
        />
        <Column
          dataField={'Task_Priority'}
          caption={'Priority'}
          hidingPriority={5}
        >
          <Lookup
            dataSource={prioritiesStore}
            valueExpr={'value'}
            displayExpr={'name'}
          />
        </Column>
        <Column
          dataField={'ResponsibleEmployee.Employee_Full_Name'}
          caption={'Assigned To'}
          allowSorting={false}
          hidingPriority={7}
        />
        <Column
          dataField={'Task_Start_Date'}
          caption={'Start Date'}
          dataType={'date'}
          hidingPriority={3}
        />
        <Column
          dataField={'Task_Due_Date'}
          caption={'Due Date'}
          dataType={'date'}
          hidingPriority={4}
        />
        <Column
          dataField={'Task_Priority'}
          caption={'Priority'}
          name={'Priority'}
          hidingPriority={1}
        />
        <Column
          dataField={'Task_Completion'}
          caption={'Completion'}
          hidingPriority={0}
        />
      </DataGrid>
      <DataGrid
        dataSource={productsStore}
        showBorders={false}
        allowColumnReordering
        columnHidingEnabled={true}
        columnFixing={{ enabled: true }}
        selection={{ mode: 'single', showCheckBoxesMode: 'always', allowSelectAll: true }}
      >
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <FilterRow visible={true} />
        <ColumnChooser enabled={true} mode="select" />
        <Column dataField={'name'} caption='Name' />
        <Column dataField={'email'} caption='Email' />
        <Column
          dataField={'priority'}
          caption={'Priority'}
          hidingPriority={5}
        >
          <Lookup
            dataSource={prioritiesStore}
            valueExpr={'value'}
            displayExpr={'name'}
          />
        </Column>
      </DataGrid>
    </React.Fragment>
  );
}
const productsStore = new ODataStore({
  url: '/odata/staffs',
  key: 'id',
  version: 3,
  onLoaded: () => {
    // Event handling commands go here
  }
});

const prioritiesStore = new ODataStore({
  url: '/odata/priorities',
  key: 'id',
  version: 3,
});
const dataSource = {
  store: {
    type: 'odata',
    key: 'Task_ID',
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks'
  },
  expand: 'ResponsibleEmployee',
  select: [
    'Task_ID',
    'Task_Subject',
    'Task_Start_Date',
    'Task_Due_Date',
    'Task_Status',
    'Task_Priority',
    'Task_Completion',
    'ResponsibleEmployee/Employee_Full_Name'
  ]
};
