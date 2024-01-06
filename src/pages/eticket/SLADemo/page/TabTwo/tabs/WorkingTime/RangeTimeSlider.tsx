import { useI18n } from "@/i18n/useI18n";
import { calcMinuteToTime } from "@/utils/time";
import { Button, CheckBox, RangeSlider } from "devextreme-react";
import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";

const RangeTimeSlider = ({ item, control, setValue, watch }: any) => {
  const { t: dayTranslate } = useI18n("SLA_Days");

  const { type } = useParams();

  const daysInTheWeek = [
    dayTranslate("Sunday"),
    dayTranslate("Monday"),
    dayTranslate("Tuesday"),
    dayTranslate("Wednesday"),
    dayTranslate("Thursday"),
    dayTranslate("Friday"),
    dayTranslate("Saturday"),
  ];

  const currentFlag247 = watch("Flag247");

  const list = watch("Lst_Mst_SLAWorkingDay");

  const handleCheck = (day: number, checked: boolean) => {
    const result = list.map((item: any) => {
      if (item.Day === day) {
        return {
          ...item,
          Check: checked,
        };
      }
      return item;
    });

    setValue("Lst_Mst_SLAWorkingDay", result);
  };

  const handleAddSlide = (day: number) => {
    const result = list.map((item: any) => {
      if (item.Day === day) {
        return {
          ...item,
          hasMoreSlide: !item.hasMoreSlide,
        };
      }
      return item;
    });

    setValue("Lst_Mst_SLAWorkingDay", result);
  };

  const handleChangeSlide = (idx: number, value: any) => {
    const result = list.map((item: any) => {
      return {
        ...item,
        Slider: item.Slider.map((c: any) => {
          if (c.Idx == idx) {
            return {
              ...c,
              TimeStart: value.start,
              TimeEnd: value.end,
            };
          }
          return c;
        }),
      };
    });

    setValue("Lst_Mst_SLAWorkingDay", result);
  };

  const handleChangeSingleSlide = (idx: number, value: any) => {
    const result = list.map((item: any) => {
      return {
        ...item,
        Slider: item.Slider.map((c: any) => {
          if (c.Idx == idx) {
            return {
              ...c,
              TimeStart: value.start,
              TimeEnd: value.end,
            };
          }
          return c;
        }),
      };
    });

    setValue("Lst_Mst_SLAWorkingDay", result);
  };

  return (
    <div className="flex mt-3 gap-3 items-center" key={nanoid()}>
      <div className="flex gap-3 items-center">
        <CheckBox
          value={item.Check}
          onValueChanged={(props: any) => {
            handleCheck(item.Day, props.value);
          }}
          disabled={type == "detail"}
        />
        <div className="w-[100px]">{daysInTheWeek[item.Day - 1]}</div>
      </div>
      <div className="flex flex-col w-[100px]">
        {item.hasMoreSlide ? (
          item.Slider.map((c: any) => {
            return (
              <div key={nanoid()}>
                {calcMinuteToTime(c.TimeStart)} - {calcMinuteToTime(c.TimeEnd)}
              </div>
            );
          })
        ) : (
          <div key={nanoid()}>
            {calcMinuteToTime(item.Slider[0].TimeStart)} -{" "}
            {calcMinuteToTime(item.Slider[0].TimeEnd)}
          </div>
        )}
      </div>
      <div className="flex-grow flex flex-col justify-center">
        {item.hasMoreSlide ? (
          item.Slider.map((c: any) => {
            return (
              <RangeSlider
                key={c.Idx}
                min={0}
                max={1440}
                start={c.TimeStart}
                end={c.TimeEnd}
                step={5}
                showRange
                tooltip={{
                  enabled: true,
                  showMode: "onHover",
                  format: (text: any) => calcMinuteToTime(text),
                }}
                style={{ padding: 0 }}
                onValueChanged={(value: any) => {
                  handleChangeSlide(c.Idx, value);
                }}
                disabled={!item.Check || currentFlag247 || type == "detail"}
                valueChangeMode="onHandleRelease"
              />
            );
          })
        ) : (
          <RangeSlider
            key={item.Slider[0].Idx}
            min={0}
            max={1440}
            start={item.Slider[0].TimeStart}
            end={item.Slider[0].TimeEnd}
            showRange
            step={5}
            tooltip={{
              enabled: true,
              showMode: "onHover",
              format: (text: any) => calcMinuteToTime(text),
            }}
            style={{ padding: 0 }}
            disabled={!item.Check || currentFlag247 || type == "detail"}
            onValueChanged={(value: any) => {
              handleChangeSingleSlide(item.Slider[0].Idx, value);
            }}
            valueChangeMode="onHandleRelease"
          />
        )}
      </div>
      <Button
        icon={item.hasMoreSlide ? "close" : "add"}
        disabled={!item.Check || currentFlag247 || type == "detail"}
        onClick={() => handleAddSlide(item.Day)}
      ></Button>
    </div>
  );
};

export default RangeTimeSlider;
