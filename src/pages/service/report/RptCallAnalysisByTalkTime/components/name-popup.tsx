import { useI18n } from "@/i18n/useI18n";
import { format } from "date-fns";
import { Popup, TextArea } from "devextreme-react";
import { atom, useAtom } from "jotai";
import { forwardRef } from "react";

const defaultName = `Báo cáo Phân tích thời gian đàm thoại ${format(
  new Date(),
  "yyyy-MM-dd"
).toString()}`;

export const nameAtom = atom<string>(defaultName);

const SaveNamePopup = forwardRef(
  ({ openPopup, handleClosePopup, handleSave }: any, ref: any) => {
    const { t } = useI18n("RptCallAnalysisByTalkTime");
    const { t: validate } = useI18n("Validate");
    const { t: common } = useI18n("Common");

    const [name, setName] = useAtom(nameAtom);

    const handleSaveName = async () => {
      handleSave();
      setName(defaultName);
      handleClosePopup();
    };

    const handleCancel = () => {
      setName(defaultName);
      handleClosePopup();
    };

    return (
      <Popup
        visible={openPopup}
        title={`${t("RptCallAnalysisByWaitTime Save")}`}
        showCloseButton
        onHidden={handleCancel}
        width={500}
        height={300}
        toolbarItems={[
          {
            toolbar: "bottom",
            location: "after",
            widget: "dxButton",
            visible: name?.length > 0,
            options: {
              text: common("Save"),
              stylingMode: "contained",
              type: "default",
              onClick: handleSaveName,
            },
          },
          {
            toolbar: "bottom",
            location: "after",
            widget: "dxButton",
            visible: true,
            options: {
              text: common("Cancel"),
              stylingMode: "contained",
              type: "default",
              onClick: handleCancel,
            },
          },
        ]}
      >
        <div className="flex flex-col gap-1">
          <label>{t("RptCallAnalysisName")}</label>
          <TextArea
            onValueChanged={(e: any) => setName(e.value)}
            defaultValue={name}
            ref={ref}
          ></TextArea>
          {!name && (
            <p className="text-red-500 text-[11px] mt-1">
              {validate("RptCallAnalysisName is required!")}
            </p>
          )}
        </div>
      </Popup>
    );
  }
);

export default SaveNamePopup;
