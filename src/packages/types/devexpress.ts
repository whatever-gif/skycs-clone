import { NativeEventInfo } from "devextreme/events";
import { LoadOptions as DxLoadOptions } from "devextreme/data";

export interface Row {
  readonly rowIndex: number;
  readonly rowType: string;
  readonly isAltRow: boolean;
  readonly isSelected: boolean;
  readonly isExpanded: boolean;
  readonly isEditing: boolean;
  readonly isNewRow: boolean;
  readonly key: any;
  readonly data: any;
  readonly values: Array<any>;
  readonly cells: Array<Cell>;
}

export interface Cell {
  readonly rowType: string;
  readonly column: Column;
  readonly value: any;
  readonly displayValue: string;
}

export interface Column {
  readonly index: number;
  readonly caption: string;
  readonly calculateCellValue?: (rowData: any) => any;
  readonly calculateDisplayValue?: (rowData: any) => string;
  readonly calculateFilterExpression?: (filterValue: any, selectedFilterOperation: string, target: string) => string | Array<any> | Function;
  readonly calculateSortValue?: (rowData: any) => any;
  readonly calculateGroupValue?: (rowData: any) => any;
  readonly dataType: string;
  readonly alignment: string;
  readonly visible: boolean;
  readonly allowEditing: boolean;
  readonly allowSorting: boolean;
  readonly allowFiltering: boolean;
  readonly allowGrouping: boolean;
  readonly allowReordering: boolean;
  readonly allowResizing: boolean;
  readonly allowHiding: boolean;
  readonly sortOrder: string;
  readonly sortIndex: number;
  readonly filterValue: any;
  readonly selectedFilterOperation: string;
  readonly groupIndex: number;
  readonly width: number;
  readonly minWidth: number;
  readonly maxWidth: number;
  readonly cssClass: string;
  readonly editCellTemplate?: string | Function;
  readonly filterCellTemplate?: string | Function;
  readonly groupCellTemplate?: string | Function;
  readonly headerCellTemplate?: string | Function;
  readonly lookup?: {
    readonly dataSource?: Array<any> | Function | string;
    readonly valueExpr?: string | Function;
    readonly displayExpr?: string | Function;
  };
}

export interface ValueChangedEvent<T extends any, E> extends NativeEventInfo<T, E> {
  previousValue?: any;
  value?: any;

}

export interface RowInsertingEvent<T> {
  cancel: boolean;
  data: T;
}
export interface SavingInfo<T> {
  cancel: boolean;
  changes: {
    data?: T & { __KEY__?: string; };
    key?: any;
    type?: "remove" | "insert" | "update";
  }[];
  promise: Promise<void>;
}