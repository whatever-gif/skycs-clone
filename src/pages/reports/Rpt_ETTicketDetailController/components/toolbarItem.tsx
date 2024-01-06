import { compareDates, getDateNow } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import FilterDropdown from "@/packages/ui/base-gridview/FilterDropdown";
import { GridCustomerToolBarItem } from "@/packages/ui/base-gridview/components/grid-custom-toolbar";
import { Button, CheckBox } from "devextreme-react";
import DropDownButton, {
  Item as DropDownButtonItem,
} from "devextreme-react/drop-down-button";
import { useMemo } from "react";
import { CheckFilterHeader } from "./CheckFilterHeader";

interface PropsToolBar {
  data: any[];
  onSetStatus: (title: string, ref: any, check: any) => void;
  gridRef: any;
}

interface DropDownInferface {
  title: string;
  onclick: any;
}

export const useToolbar = ({
  gridRef,
  data,
  onSetStatus,
}: PropsToolBar): GridCustomerToolBarItem[] => {
  const { t } = useI18n("Rpt_ETTicketDetailController");
  return [
    {
      text: "",
      onClick: () => {},
      shouldShow: (ref: any) => {
        return true;
      },
      widget: "customize",
      customize: (ref: any) => (
        <div className=" ml-[290px]">
          <CheckFilterHeader dataRef={ref} onSetStatus={onSetStatus} />
        </div>
      ),
    },
  ];
};
