import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { showErrorAtom } from "@/packages/store";
import { Icon } from "@/packages/ui/icons";
import { Button, Form, Popup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { memo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { dataRowAtom, popupMergeVisibleAtom } from "../store";
import "./style.scss";
interface Props {
  onCancel: () => void;
  onSave?: () => void;
}

interface data {
  TicketName: string;
  message: string;
  TicketID: string;
  date: string;
  channel:
    | "remove"
    | "add"
    | "edit"
    | "trash"
    | "plus"
    | "pdf"
    | "xlsx"
    | "jpg"
    | "docx"
    | "expandDown"
    | "png"
    | "email"
    | "call"
    | "zalo"
    | "facebook"
    | "sms"
    | "livechat";
}

const index = ({ onCancel, onSave }: Props) => {
  const { t } = useI18n("Eticket_Manager_Merger");
  const popupMergeVisible = useAtomValue(popupMergeVisibleAtom);

  const formRef: any = useRef(null);
  const api = useClientgateApi();
  const { auth } = useAuth();
  const showError = useSetAtom(showErrorAtom);
  const [formData, setFormData] = useState<any>({});
  const handleSave = async () => {
    const { isValid } = formRef.current.instance.validate();
    if (isValid || (formData?.TicketID && formData?.TicketID !== "")) {
      const obj = {
        TicketID: formData?.TicketID ?? "",
        OrgID: auth.orgData?.Id ?? "",
        Lst_ET_Ticket: dataRow
          .filter((item) => {
            return item.TicketID !== formData?.TicketID ?? "";
          })
          .map((item) => {
            return {
              TicketID: item.TicketID,
            };
          }),
      };

      const response = await api.ET_Ticket_Merge(obj);
      if (response.isSuccess) {
        toast.success(t("ET_Ticket_Merge merge success! "));
        onCancel();
        onSave?.();
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
      return;
    }
  };

  const dataRow = useAtomValue(dataRowAtom);
  return (
    <Popup
      className="popup"
      position={"center"}
      showCloseButton={true}
      onHiding={onCancel}
      title={t(`Eticket Merge`)}
      width={700}
      height={575}
      visible={popupMergeVisible}
    >
      {/* <LoadPanel
        visible={popupMergeVisible}
        showIndicator={true}
        showPane={true}
        container={".dx-viewport"}
        shadingColor="rgba(0,0,0,0.4)"
      /> */}
      <div className="popup-content">
        {dataRow.map((item: any) => {
          const flag = null;
          return (
            <div className="flex items-center justify-between mb-2 container-content">
              <div className="left">
                <p className="strong">{item.TicketName}</p>
                <p className="flex items-center ">
                  {flag && (
                    <Icon
                      className="mr-2"
                      size={14}
                      name={flag.toLowerCase()}
                    />
                  )}
                  <span className="w-[400px] ellipsis  ">
                    {item.Description}
                  </span>
                </p>
              </div>
              <div className="right">
                <p>{item.TicketID}</p>
                <p>{item.MsgDTime}</p>
              </div>
            </div>
          );
        })}

        <Form
          formData={formData}
          ref={formRef}
          validationGroup="form-transformCustomer"
          labelLocation="left"
        >
          <SimpleItem
            dataField="TicketID"
            validationRules={[requiredType]}
            editorType={"dxSelectBox"}
            editorOptions={{
              dataSource: dataRow,
              displayExpr: "TicketName",
              valueExpr: "TicketID",
            }}
          />
        </Form>
      </div>

      <ToolbarItem toolbar={"bottom"} location={"after"}>
        <Button
          text={t("Save")}
          type={"default"}
          stylingMode={"contained"}
          onClick={handleSave}
        />
        <Button
          text={t("Close")}
          stylingMode={"contained"}
          onClick={onCancel}
        />
      </ToolbarItem>
    </Popup>
  );
};

export default memo(index);
