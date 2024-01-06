import { useI18n } from "@/i18n/useI18n";
import { useParams } from "react-router-dom";
import HolidayForm from "./HolidayForm";
import HolidayTable from "./HolidayTable";

const Holiday = ({ control, setValue, watch }: any) => {
  const { type } = useParams();

  const { t } = useI18n("SLA_Holidays");

  return (
    <div className="mt-2 p-2 pb-[100px]">
      <h3 className="pb-2">{t("List of holidays")}</h3>
      {type != "detail" && (
        <HolidayForm control={control} watch={watch} setValue={setValue} />
      )}
      <HolidayTable control={control} watch={watch} setValue={setValue} />
    </div>
  );
};

export default Holiday;
