import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { Icon } from "@/packages/ui/icons";
import { Button, DropDownBox, List, SelectBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { Attachment } from "../../../../components/attachment";

export const PartReplySms = ({
  dataValue,
  listMedia,
  onReload,
}: {
  dataValue: any;
  listMedia: any;
  onReload: any;
}) => {
  const [condition, setCondition] = useState({
    EmailCode: "",
    SubFormCode: "",
    ObjCode: "",
  });
  const { t } = useI18n("Eticket_Detail_SMS");
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const dataSource = dataValue.Lst_ET_TicketCustomer[0]
    ? dataValue.Lst_ET_TicketCustomer[0].Lst_CustomerPhoneNo
    : [];

  // const {
  //   data: dataZaloApi,
  //   isLoading: isLoadingDataZalo,
  //   refetch,
  // } = useQuery({
  //   queryKey: ["CalcBySubFormCodeForZaloMessage", JSON.stringify(condition)],
  //   queryFn: async () => {
  //     if (condition.SubFormCode !== "") {
  //       const obj = {
  //         SubFormCode: condition.SubFormCode,
  //         TicketID: dataValue.Lst_ET_Ticket[0].TicketID,
  //       };

  //       const response = await api.MstSubmissionForm_CalcBySubFormCodeForZNS(
  //         obj
  //       );
  //       if (response.isSuccess) {
  //         return response;
  //       } else {
  //         showError({
  //           message: (response.errorCode),
  //           debugInfo: response.debugInfo,
  //           errorInfo: response.errorInfo,
  //         });
  //       }

  //       return "";
  //     } else {
  //       return "";
  //     }
  //   },
  // });

  return (
    <div className={"w-full message-reply mb-2"}>
      <div className="w-full p-2 mb-3">
        <div className="flex float-left ml-5">
          <span className="text-gray mr-2">
            Địa chỉ nhận <span className="text-red">*</span>
          </span>
          <SelectBox
            value={condition.ObjCode}
            onSelectionChanged={(value: any) => {
              setCondition((prev: any) => {
                return {
                  ...prev,
                  ObjCode: value.selectedItem,
                };
              });
            }}
            dataSource={dataSource}
            // displayExpr="ObjType"
            // valueExpr="ObjCode"
          />
        </div>
        <div className="flex float-right mr-5">
          <span className="text-gray mr-2">
            Mẫu tin nhắn SMS <span className="text-red">*</span>
          </span>
          <SelectBox
            value={condition.SubFormCode}
            onSelectionChanged={(value: any) => {
              setCondition((prev: any) => {
                return {
                  ...prev,
                  ...value.selectedItem,
                };
              });
            }}
            dataSource={listMedia.SMS}
            displayExpr="SubFormName"
            valueExpr="SubFormCode"
          />
        </div>
      </div>
      <div className="input-area">
        <textarea placeholder="Nhập..."></textarea>
        <div className="w-full" style={{ height: 20 }}>
          <div className="flex">
            <Attachment
              file={{ Url: "/content/test.pdf" }}
              onRemoveClick={() => {
                alert("removed");
              }}
            />
          </div>
        </div>
        <div className="w-full p-3">
          <div className="flex float-right mr-2 buttons">
            <span>
              <i className="dx-icon-attach"></i>
            </span>
          </div>
        </div>
      </div>

      <div className={"w-full box-button-eticket"}>
        <div className="flex">
          <DropDownBox
            label="Lựa chọn xử lý"
            style={{ width: 160, marginRight: 8 }}
          >
            <List></List>
          </DropDownBox>
          <Button
            stylingMode={"contained"}
            type="default"
            style={{}}
            icon="email"
            text={t("Send")}
            height={30}
            className="eticket-button-send"
          >
            {t("Send")}
            <Icon style={{ marginLeft: "10px" }} name="send"></Icon>
          </Button>
        </div>
      </div>
    </div>
  );
};
