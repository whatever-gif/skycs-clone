import { useI18n } from "@/i18n/useI18n";
import { SwitchField } from "@/pages/admin/custom-field/components/switch-field";
import { nanoid } from "nanoid";
import { Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import RangeTimeSlider from "./RangeTimeSlider";
import "./style.scss";

const WorkingTime = ({ control, setValue, watch }: any) => {
  const { t } = useI18n("SLA_WorkingTime");

  const { type } = useParams();

  const list = watch("Lst_Mst_SLAWorkingDay");

  return (
    <div className="mt-5 p-2">
      <div className="flex gap-3 ">
        <Controller
          name={"Flag247"}
          control={control}
          render={({ field }) => {
            return (
              <SwitchField
                field={field}
                label={t("Working 24/7")}
                readOnly={type == "detail"}
                onValueChange={(e: any) => {
                  if (e.value) {
                    const result = list.map((item: any) => {
                      return {
                        ...item,
                        Check: true,
                        hasMoreSlide: true,
                        Slider: item.Slider.map((c: any) => {
                          return {
                            ...c,
                            TimeStart: 0,
                            TimeEnd: 1440,
                          };
                        }),
                      };
                    });

                    setValue("Lst_Mst_SLAWorkingDay", result);
                  }
                }}
              />
            );
          }}
        />
      </div>

      {list.map((item: any, index: any) => {
        return (
          <RangeTimeSlider
            item={item}
            key={nanoid()}
            control={control}
            watch={watch}
            setValue={setValue}
          />
        );
      })}
    </div>
  );
};

export default WorkingTime;
