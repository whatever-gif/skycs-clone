import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { useQuery } from "@tanstack/react-query";
import { LoadPanel, Popup } from "devextreme-react";
import { useAtomValue, useSetAtom } from "jotai";
import { visibleEmailAtom } from "./store";

interface Props {
  onClose: () => void;
  code: string;
}

const Email_Popup = ({ onClose, code }: Props) => {
  const visible = useAtomValue(visibleEmailAtom);
  const { t } = useI18n("BlackList");
  const showError = useSetAtom(showErrorAtom);
  const api = useClientgateApi();
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "MstSubmissionForm_CalcBySubFormCodeForEmail",
      code ?? "",
      visible,
    ],
    queryFn: async () => {
      if (visible && code) {
        const obj = {
          TicketID: "",
          SubFormCode: code,
        };
        const response = await api.MstSubmissionForm_CalcBySubFormCodeForEmail(
          obj
        );
        if (response.isSuccess) {
          if (response.Data) {
            if (response?.Data?.Lst_Mst_SubmissionFormMessage?.[0]) {
              return response.Data.Lst_Mst_SubmissionFormMessage[0];
            }
          }
          return response.Data;
        } else {
          showError({
            message: response._strErrCode,
            _strErrCode: response._strErrCode,
            _strTId: response._strTId,
            _strAppTId: response._strAppTId,
            _objTTime: response._objTTime,
            _strType: response._strType,
            _dicDebug: response._dicDebug,
            _dicExcs: response._dicExcs,
          });
        }
      } else {
        return null;
      }
    },
  });

  return (
    <Popup
      visible={visible}
      onHidden={onClose}
      hideOnOutsideClick
      width={600}
      height={400}
      title={t("BlackList Email Popup")}
      showCloseButton
    >
      <div className="popup-container">
        {!isLoading && data && (
          <div
            className="format-text-html w-full pl-2 text-bold"
            dangerouslySetInnerHTML={{
              __html: data?.Message ?? "--------------------",
            }}
          />
        )}
        <LoadPanel
          container={".popup-container"}
          visible={isLoading && visible}
        />
      </div>
    </Popup>
  );
};

export default Email_Popup;
