import { useI18n } from "@/i18n/useI18n";
import FilterDropdown from "@/packages/ui/base-gridview/FilterDropdown";
import {
  FilterItem,
  HeaderFilterPost,
} from "@/packages/ui/headerFilter/HeaderFilter";

const useCustomToolbar = () => {
  const { t } = useI18n("SLA_Filter");

  const arrayFilter: FilterItem[] = [
    {
      active: true, // thời gian cập nhật
      nameField: "LogLUDTimeUTC",
    },
    {
      active: false, // thời gian tạo
      nameField: "CreateDTimeUTC",
    },
    {
      active: false, // DeadLine
      nameField: "SLALevel",
    },
  ];

  return [
    {
      text: "",
      onClick: () => {},
      shouldShow: (ref: any) => {
        return true;
      },
      widget: "customize",
      customize: (ref: any) => (
        <div className="px-1">
          <FilterDropdown
            buttonTemplate={<img src="/images/icons/filterHeader.png" />}
            genFilterFunction={
              <HeaderFilterPost ref={ref} t={t} listFilter={arrayFilter} />
            }
          />
        </div>
      ),
    },
  ];
};

export default useCustomToolbar;
