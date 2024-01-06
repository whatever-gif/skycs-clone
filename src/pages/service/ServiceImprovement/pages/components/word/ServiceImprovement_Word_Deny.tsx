import { useI18n } from "@/i18n/useI18n";
import { NumberBox, TextBox } from "devextreme-react";
import { useAtom } from "jotai";
import { forwardRef } from "react";
import { Lst_SvImp_SvImprvDenyWordAtom } from "../../ServiceImprovementPage";

export const DeleteButton = () => (
  <svg
    width="15"
    height="16"
    viewBox="0 0 15 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="cursor-pointer"
  >
    <path
      d="M1 3.79883H13.6"
      stroke="#FF0000"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.1999 3.8V13.6C12.1999 13.7839 12.1637 13.9659 12.0933 14.1358C12.023 14.3056 11.9199 14.4599 11.7899 14.5899C11.6599 14.72 11.5055 14.8231 11.3357 14.8934C11.1658 14.9638 10.9838 15 10.7999 15H3.7999C3.4286 15 3.0725 14.8525 2.80995 14.5899C2.5474 14.3274 2.3999 13.9713 2.3999 13.6V3.8M4.4999 3.8V2.4C4.4999 2.0287 4.6474 1.6726 4.90995 1.41005C5.1725 1.1475 5.5286 1 5.8999 1H8.6999C9.07121 1 9.4273 1.1475 9.68985 1.41005C9.9524 1.6726 10.0999 2.0287 10.0999 2.4V3.8"
      stroke="#FF0000"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const AddBtn = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.75 0.25C8.08502 0.25 9.39007 0.645881 10.5001 1.38758C11.6101 2.12928 12.4753 3.18349 12.9862 4.41689C13.4971 5.65029 13.6308 7.00749 13.3703 8.31686C13.1098 9.62623 12.467 10.829 11.523 11.773C10.579 12.717 9.37623 13.3598 8.06686 13.6203C6.75749 13.8808 5.40029 13.7471 4.16689 13.2362C2.93349 12.7253 1.87928 11.8601 1.13758 10.7501C0.395881 9.64007 0 8.33502 0 7C0.0021172 5.21044 0.713956 3.49478 1.97937 2.22937C3.24478 0.963956 4.96044 0.252117 6.75 0.25ZM6.75 12.25C7.78835 12.25 8.80338 11.9421 9.66674 11.3652C10.5301 10.7883 11.203 9.9684 11.6004 9.00909C11.9977 8.04978 12.1017 6.99418 11.8991 5.97578C11.6966 4.95738 11.1965 4.02192 10.4623 3.28769C9.72809 2.55346 8.79262 2.05345 7.77422 1.85088C6.75582 1.6483 5.70022 1.75227 4.74091 2.14963C3.7816 2.54699 2.96166 3.2199 2.38478 4.08326C1.80791 4.94661 1.5 5.96165 1.5 7C1.50159 8.3919 2.05522 9.72634 3.03944 10.7106C4.02367 11.6948 5.3581 12.2484 6.75 12.25Z"
      fill="#00703C"
    />
    <path
      d="M6.75 9.75C6.55109 9.75 6.36032 9.67098 6.21967 9.53033C6.07902 9.38968 6 9.19891 6 9V5C6 4.80109 6.07902 4.61032 6.21967 4.46967C6.36032 4.32902 6.55109 4.25 6.75 4.25C6.94891 4.25 7.13968 4.32902 7.28033 4.46967C7.42098 4.61032 7.5 4.80109 7.5 5V9C7.5 9.19891 7.42098 9.38968 7.28033 9.53033C7.13968 9.67098 6.94891 9.75 6.75 9.75Z"
      fill="#00703C"
    />
    <path
      d="M8.75 7.75H4.75C4.55109 7.75 4.36032 7.67098 4.21967 7.53033C4.07902 7.38968 4 7.19891 4 7C4 6.80109 4.07902 6.61032 4.21967 6.46967C4.36032 6.32902 4.55109 6.25 4.75 6.25H8.75C8.94891 6.25 9.13968 6.32902 9.28033 6.46967C9.42098 6.61032 9.5 6.80109 9.5 7C9.5 7.19891 9.42098 7.38968 9.28033 7.53033C9.13968 7.67098 8.94891 7.75 8.75 7.75Z"
      fill="#00703C"
    />
  </svg>
);

const ServiceImprovement_Word_Deny = forwardRef(
  ({ readOnly }: any, ref: any) => {
    const { t: common } = useI18n("Common");
    const { t } = useI18n("SvImprvWord");

    const { t: p } = useI18n("Placeholder");

    const { t: validateMsg } = useI18n("Validate");

    const [listData, setListData] = useAtom(Lst_SvImp_SvImprvDenyWordAtom);

    const getMaxIdx =
      listData?.length > 0
        ? Math.max(...listData?.map((item: any) => item.Idx))
        : 0;

    const handleAdd = () => {
      setListData([
        ...listData,
        {
          Idx: getMaxIdx + 1,
          WordDesc: "",
          FlagIsRequire: 1,
          FlagActive: 1,
          QtyStd: 1,
        },
      ]);
    };

    const onDelete = (idx: any) => {
      const result = listData.filter((item: any) => item.Idx != idx);

      setListData(result);
    };

    const onChange = ({ Idx, Field, Value }: any) => {
      const result = listData?.map((item: any) => {
        if (item?.Idx == Idx) {
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
      <div className="w-[50%] pb-[200px]">
        <div className="flex justify-between">
          <div className="font-semibold">{t("Lst_SvImp_SvImprvDenyWord")}</div>
          {readOnly ? (
            <div className="text-slate-600 flex items-center gap-1 cursor-pointer"></div>
          ) : (
            <div
              className="text-[#00703C] flex items-center gap-1 cursor-pointer"
              onClick={handleAdd}
            >
              <AddBtn />
              {common("Add")}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 py-2 pb-4 px-2 w-full border-[1px] mt-1">
          <div className="flex items-center gap-2">
            <div
              className={`font-semibold ${
                readOnly ? "w-[40px]" : "w-[80px]"
              } flex items-center justify-center`}
            >
              {t("Idx")}
            </div>
            <div className={`font-semibold flex-grow ${readOnly && "pl-2"}`}>
              {t("WordDescDenyWord")}
            </div>
            <div className="font-semibold w-[100px] justify-end">
              {t("QtyStdDenyWord")}
            </div>
          </div>
          {listData?.map((item: any, index: any) => {
            return (
              <div className="flex items-center gap-2" key={item?.Idx}>
                {!readOnly && (
                  <div onClick={() => onDelete(item?.Idx)}>
                    <DeleteButton />
                  </div>
                )}
                <div className="w-[50px] h-[30px] flex items-center justify-center">
                  {index + 1}
                </div>
                <div
                  className={`relative border-[1px] rounded-[5px] flex-grow `}
                >
                  <TextBox
                    defaultValue={item.WordDesc}
                    onValueChanged={(e: any) =>
                      onChange({
                        Idx: item?.Idx,
                        Field: "WordDesc",
                        Value: e.value,
                      })
                    }
                    placeholder={p("Input")}
                    readOnly={readOnly}
                  />
                  {(!item.WordDesc || item?.length <= 0) && (
                    <div className="absolute text-[11px] text-red-500">
                      {validateMsg("WordDescDenyWord is required!")}
                    </div>
                  )}
                </div>

                <div className={`relative border-[1px] rounded-[5px]`}>
                  <NumberBox
                    defaultValue={item.QtyStd}
                    width={50}
                    onValueChanged={(e: any) =>
                      onChange({
                        Idx: item?.Idx,
                        Field: "QtyStd",
                        Value: e.value,
                      })
                    }
                    placeholder={p("Input")}
                    readOnly={readOnly}
                  />
                  {(!item.QtyStd || item.QtyStd <= 0) && (
                    <div className="absolute text-[11px] text-red-500">
                      {validateMsg("QtyStdDenyWord is required!")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

export default ServiceImprovement_Word_Deny;
