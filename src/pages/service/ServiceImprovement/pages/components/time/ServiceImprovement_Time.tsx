import { useI18n } from "@/i18n/useI18n";
import { DateBox } from "devextreme-react";
import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import { forwardRef } from "react";
import { Lst_SvImp_SvImprvCallTalkTimeAtom } from "../../ServiceImprovementPage";

const ServiceImprovement_Time = forwardRef(({ readOnly }: any, ref: any) => {
  const { t } = useI18n("ServiceImprovement_Time");
  const { t: validateMsg } = useI18n("Validate");

  const [listData, setListData] = useAtom(Lst_SvImp_SvImprvCallTalkTimeAtom);

  const onChange = ({ SvImprvItCode, Field, Value }: any) => {
    const result = listData?.map((item: any) => {
      if (item?.SvImprvItCode == SvImprvItCode) {
        return {
          ...item,
          [Field]: Value,
        };
      }
      return item;
    });

    setListData(result);
  };

  return (
    <div className="flex flex-col gap-4 border-[1px] p-2 w-[700px] pb-4">
      <div className="flex">
        <div className="w-[300px] font-semibold">{t("SvImprvItCode")}</div>
        <div className="w-[200px] font-semibold">{t("TalkTimeMinValue")}</div>
        <div className="w-[200px] ml-4 font-semibold">
          {t("TalkTimeMaxValue")}
        </div>
      </div>
      {listData.map((item: any) => {
        return (
          <div className="flex items-center" key={nanoid()}>
            <div className="w-[300px] font-semibold">
              {t(item.SvImprvItCode)}
            </div>
            <div className="w-[200px] relative">
              <DateBox
                type="time"
                pickerType="rollers"
                displayFormat="HHHH:mm:ss"
                placeholder="HH:mm:ss"
                onValueChanged={(e: any) =>
                  onChange({
                    SvImprvItCode: item?.SvImprvItCode,
                    Field: "TalkTimeMinValue",
                    Value: e.value,
                  })
                }
                showClearButton
                defaultValue={item?.TalkTimeMinValue}
                readOnly={readOnly}
              />
              {!item.TalkTimeMinValue && (
                <div className="absolute text-[11px] text-red-500">
                  {validateMsg("TalkTimeMinValue is required!")}
                </div>
              )}
              {item.TalkTimeMinValue > item.TalkTimeMaxValue && (
                <div className="absolute text-[11px] text-red-500">
                  {validateMsg("TalkTimeMinValue is invalid!")}
                </div>
              )}
            </div>
            <div className="w-[200px] ml-4 required:">
              <DateBox
                type="time"
                pickerType="rollers"
                displayFormat="HHHH:mm:ss"
                placeholder="HH:mm:ss"
                onValueChanged={(e: any) =>
                  onChange({
                    SvImprvItCode: item?.SvImprvItCode,
                    Field: "TalkTimeMaxValue",
                    Value: e.value,
                  })
                }
                showClearButton
                defaultValue={item?.TalkTimeMaxValue}
                readOnly={readOnly}
              />
              {!item.TalkTimeMaxValue && (
                <div className="absolute text-[11px] text-red-500">
                  {validateMsg("TalkTimeMaxValue is required!")}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default ServiceImprovement_Time;
