import { IColumnProps, IToolbarItemProps } from "devextreme-react/data-grid";

export interface ColumnOptions extends IColumnProps {
  editorType?: string;
  columnIndex?: number;
  groupKey?: string;
  isSearchable?: boolean;
  order?: number;
}
export interface FormDepartmentControl {
  departmentCode?: string;
  departmentName?: string;
  flagActive?: string;
}

export interface ToolbarItemProps extends IToolbarItemProps {
  widget?: string;
  location?: any;
  render?: any;
}
