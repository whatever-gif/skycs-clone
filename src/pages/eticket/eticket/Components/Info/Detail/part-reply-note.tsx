import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { Eticket_AddRemark } from "@/packages/types";
import { Icon } from "@/packages/ui/icons";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { Button, Form, SelectBox } from "devextreme-react";
import { SimpleItem } from "devextreme-react/form";
import { useSetAtom } from "jotai";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export const PartReplyNote = ({
  data,
  onReload,
}: {
  data: Eticket_AddRemark;
  onReload: any;
}) => {
  const { t } = useI18n("Eticket_Detail_Note");
  const showError = useSetAtom(showErrorAtom);
  const Lst_Eticket_ActionType = [
    {
      ActionTypeCode: "0",
      ActionTypeName: t("Send"),
    },
    {
      ActionTypeCode: "1",
      ActionTypeName: t("Send and mark eTicket as Closed"),
    },
    {
      ActionTypeCode: "2",
      ActionTypeName: t("Send and mark eTicket as Processing"),
    },
  ];
  const initValue = {
    ActionType: data?.ActionType || "0",
    TicketID: data?.TicketID || "",
    OrgID: data?.OrgID || "",
    Description: data?.Description || "",
  };
  const [addRemark, setAddRemark] = useState(initValue);
  const api = useClientgateApi();
  const formRef = useRef();
  const hanldleChangeActionType = (event: any) => {
    const _index = event?.component?._dataSource?._items?.findIndex(
      (x: any) => x.phoneCode === event.value
    );
  };

  const hanldleAddRemark = async () => {
    const obj = {
      ...addRemark,
    };

    const response = await api.ET_Ticket_AddRemark(obj);
    if (response.isSuccess) {
      toast.success(t("Add remark successfully"));
      // window.location.reload();
      onReload();
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
  };

  return (
    <div className={"w-full message-reply mb-2"}>
      <div className="input-area">
        {/* <textarea
          className="input-area-content"
          value={addRemark.Description}
          placeholder="Nhập ghi chú..."
          maxLength={2000}
          onChange={(event) => {
            const dataCur = {
              ...addRemark,
              Description: event.target.value,
            };
            setAddRemark(dataCur);
          }}
        ></textarea> */}
        <Form formData={addRemark} ref={formRef}>
          <SimpleItem
            dataField="Description"
            label={{
              visible: false,
              text: "Description",
            }}
            editorType="dxTextArea"
            editorOptions={{
              height: 200,
            }}
          />
          {/* file */}
          <SimpleItem
            dataField="uploadFiles"
            label={{
              text: t("uploadFiles"),
              visible: false,
            }}
            editorType="dxHtmlEditor"
            editorOptions={{
              placeholder: t("Input"),
              height: "40px",
            }}
            render={(paramValue: any) => {
              const { component: formComponent, dataField } = paramValue;
              return (
                <UploadFilesField
                  className={"flex align-items-center part-email"}
                  formInstance={formComponent}
                  controlFileInput={[
                    "DOCX",
                    "PDF",
                    "JPG",
                    "PNG",
                    "XLSX",
                    "TXT",
                    "PPTX",
                    "DOC",
                    "XLS",
                    "XLSM",
                    "JPEG",
                    "GIF",
                    "SVG",
                    "XML",
                  ]}
                  onValueChanged={(files: any) => {
                    formComponent.updateData(dataField, files);
                  }}
                />
              );
            }}
          />
        </Form>
      </div>

      <div className={"w-full box-button-eticket"}>
        <div className="flex">
          <SelectBox
            value={addRemark.ActionType} // giá trị khởi tạo
            valueExpr={"ActionTypeCode"} // giá trị được chọn
            displayExpr={"ActionTypeName"} // giá trị hiển thị
            style={{ width: 320, marginRight: 8 }}
            height={30}
            searchEnabled={true} // hiển thị chức năng tìm kiếm trong selectbox
            minSearchLength={3} // số lượng ký tự bắt đầu tìm kiếm
            searchExpr={["ActionTypeCode", "ActionTypeName"]} // tìm kiếm theo trường dữ liệu nào
            searchTimeout={10} // độ trễ thời điểm người dùng nhập xong và thời điểm tìm kiếm được thực hiện
            showDataBeforeSearch={false} // true: luôn hiển thị tất cả danh sách dữ liệu kể cả chưa nhập tới minSearchLength; false: không hiển thị dữ liệu cho đến khi nhập số ký tự bằng minSearchLength
            //showClearButton={true} // hiển thị item xóa dữ liệu
            dataSource={Lst_Eticket_ActionType} // nguồn dữ liệu
            onValueChanged={(event: any) => {
              const dataCur = {
                ...addRemark,
                ActionType: event.value,
              };
              setAddRemark(dataCur);
            }}
          ></SelectBox>
          <Button
            stylingMode={"contained"}
            type="default"
            icon="email"
            text={t("Send Note")}
            className="eticket-button-send"
            onClick={hanldleAddRemark}
          >
            {t("Send Note")}
            <Icon style={{ marginLeft: "10px" }} name="send"></Icon>
          </Button>
        </div>
      </div>
    </div>
  );
};
