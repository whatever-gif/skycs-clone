import { useI18n } from "@/i18n/useI18n";
import { NumberBox } from "devextreme-react";
import { useAtom } from "jotai";
import { forwardRef } from "react";
import { Lst_SvImp_SvImprvAudioAtom } from "../../ServiceImprovementPage";

const ServiceImprovement_Audio = forwardRef(({ readOnly }: any, ref: any) => {
  const { t } = useI18n("ServiceImprovement_Audio");
  const { t: validateMsg } = useI18n("Validate");

  const [listData, setListData] = useAtom(Lst_SvImp_SvImprvAudioAtom);

  const onChange = ({ SvImprvItCode, Field, Value }: any) => {
    const result = listData.map((item: any) => {
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
        <div className="w-[200px] font-semibold">{t("MinValue")}</div>
        <div className="w-[200px] ml-4 font-semibold">{t("MaxValue")}</div>
        <div className="w-[200px] ml-4 font-semibold">{t("QtyAllow")}</div>
      </div>
      {listData.map((item: any) => {
        return (
          <div className="flex items-center" key={item?.SvImprvItCode}>
            <div className="w-[300px] font-semibold">
              {t(item.SvImprvItCode)}
            </div>
            <div className="w-[200px] relative">
              <NumberBox
                defaultValue={item.MinValue}
                onValueChanged={(e: any) =>
                  onChange({
                    SvImprvItCode: item?.SvImprvItCode,
                    Field: "MinValue",
                    Value: e.value,
                  })
                }
                readOnly={readOnly}
              />
              {item.MinValue < 0 && (
                <div className="absolute text-[11px] text-red-500">
                  {validateMsg("MinValue is required!")}
                </div>
              )}
              {item.MinValue > item.MaxValue && (
                <div className="absolute text-[11px] text-red-500">
                  {validateMsg("MinValue is invalid!")}
                </div>
              )}
            </div>
            <div className="w-[200px] ml-4 relative">
              <NumberBox
                defaultValue={item.MaxValue}
                onValueChanged={(e: any) =>
                  onChange({
                    SvImprvItCode: item?.SvImprvItCode,
                    Field: "MaxValue",
                    Value: e.value,
                  })
                }
                readOnly={readOnly}
              />
              {item.MaxValue < 0 && (
                <div className="absolute text-[11px] text-red-500">
                  {validateMsg("MaxValue is required!")}
                </div>
              )}
            </div>
            <div className="w-[200px] ml-4 relative">
              <NumberBox
                defaultValue={item.QtyAllow}
                onValueChanged={(e: any) =>
                  onChange({
                    SvImprvItCode: item?.SvImprvItCode,
                    Field: "QtyAllow",
                    Value: e.value,
                  })
                }
                readOnly={readOnly}
              />
              {item.QtyAllow < 0 && (
                <div className="absolute text-[11px] text-red-500">
                  {validateMsg("QtyAllow is required!")}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default ServiceImprovement_Audio;
