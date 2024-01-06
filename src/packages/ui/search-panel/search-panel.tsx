import {Header} from "@packages/ui/search-panel/header";
import Form from "devextreme-react/form";
import {ColumnOptions} from "@packages/ui/base-gridview";

export interface SearchPanelProps {
  onClose: () => void;
  onToggleSettings?: () => void;
  data: any;
  items: ColumnOptions[]
}
export const SearchPanel = ({onClose, onToggleSettings, data, items}: SearchPanelProps) => {
  return (
    <div className={'h-full p-1'}>
      <Header onCollapse={onClose} onToggleSettings={onToggleSettings}/>
      <Form
        formData={data}
        labelLocation={'top'} colCount={1} className={'p-2'} items={items}>
      </Form>
    </div>
  )

}