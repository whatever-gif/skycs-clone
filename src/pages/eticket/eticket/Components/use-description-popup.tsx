import { useI18n } from "@/i18n/useI18n";
import { FormOptions } from "@/types";
import { Popup } from "devextreme-react";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { popupDescAtom } from "./use-columns";

export interface PopupViewProps {
  onEdit: (rowIndex: number) => void;
  formSettings: FormOptions;
}

export const DescriptionPopup = () => {
  const { t } = useI18n("Eticket_Manager_Column");
  const { t: desc } = useI18n("Eticket_Description");

  const [popupDesc, setPopupDesc] = useAtom(popupDescAtom);

  function isJsonObject(parsed: any) {
    try {
      return typeof parsed === "object" && parsed !== null;
    } catch (error) {
      return false;
    }
  }

  const result =
    popupDesc && popupDesc.Description
      ? String(popupDesc.Description).charAt(0) == "{"
        ? JSON.parse(popupDesc.Description)
        : popupDesc.Description
      : "";

  const render = useMemo(() => {
    return isJsonObject(result) ? (
      <div className="flex flex-col gap-1 w-full ">
        {Object.entries(result).map(([key, value]: any) => {
          if (
            [
              "Id",
              "AgentId",
              "FromNumber",
              "ToNumber",
              "StartDTime",
              "EndDTime",
              "TalkTime",
            ].includes(key)
          ) {
            return (
              <div className="flex gap-1 w-full ">
                <strong>{desc(key)}:</strong>
                <div
                  className="break-words"
                  style={{
                    wordBreak: "break-word",
                  }}
                >
                  {JSON.stringify(value)}
                </div>
              </div>
            );
          }
        })}
      </div>
    ) : (
      <div dangerouslySetInnerHTML={{ __html: result }}></div>
    );
  }, [result]);

  return (
    <Popup
      visible={popupDesc?.TicketID}
      width={500}
      height={400}
      title={`${t("Description")} (${t("TicketID")}: ${popupDesc?.TicketID})`}
      hideOnOutsideClick
      showCloseButton
      onHidden={() => setPopupDesc(null)}
    >
      {render}
    </Popup>
  );
};
