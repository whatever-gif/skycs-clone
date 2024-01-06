import { Button, Form, LoadPanel, SelectBox } from "devextreme-react";

import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { showErrorAtom } from "@/packages/store";
import { Eticket_AddRemark } from "@/packages/types";
import { Icon } from "@/packages/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import DataSource from "devextreme/data/data_source";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { currentValueTabAtom, reloadingtabAtom } from "./store";

export const PartReplyEmail = ({
  dataValue,
  listMedia,
  onReload,
  data,
}: {
  dataValue: any;
  listMedia: any;
  onReload: any;
  data: Eticket_AddRemark;
}) => {
  const { t } = useI18n("Eticket_Detail_Email");
  const formRef: any = useRef(null);
  const api = useClientgateApi();
  const reloadingtab = useAtomValue(reloadingtabAtom);
  const setReloadingtab = useSetAtom(reloadingtabAtom);
  const currentValueTab = useAtomValue(currentValueTabAtom);

  const showError = useSetAtom(showErrorAtom);
  const { Lst_CustomerEmail } = dataValue.Lst_ET_TicketCustomer[0] ?? {
    Lst_CustomerEmail: [],
  };

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
    MessageSend: data?.Description || "",
    SubTitleSend: "",
    SubFormCode: "",
    CtmEmail: "",
  };

  const [addRemark, setAddRemark] = useState(initValue);

  const sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
  const fontValues = [
    "Arial",
    "Courier New",
    "Georgia",
    "Impact",
    "Lucida Console",
    "Tahoma",
    "Times New Roman",
    "Verdana",
  ];
  useEffect(() => {
    if (reloadingtab !== "") {
      setAddRemark(currentValueTab);
    }
  }, [reloadingtab]);
  useEffect(() => {
    return () => {
      setReloadingtab("");
    };
  }, []);

  const { data: dataEmailApi, isLoading: isLoadingDataZalo } = useQuery({
    queryKey: ["CalcBySubFormCodeForZaloMessage", JSON.stringify(addRemark)],
    queryFn: async () => {
      if (addRemark.SubFormCode && addRemark.SubFormCode !== "") {
        const obj = {
          SubFormCode: addRemark.SubFormCode,
          TicketID: dataValue.Lst_ET_Ticket[0].TicketID,
        };

        const response = await api.MstSubmissionForm_CalcBySubFormCodeForEmail(
          obj
        );
        if (response.isSuccess) {
          if (response.Data.Lst_Mst_SubmissionFormMessage?.length) {
            const MessageSend =
              response.Data.Lst_Mst_SubmissionFormMessage[0].MessageSend;

            const SubTitleSend =
              response.Data.Lst_Mst_SubmissionFormMessage[0].SubTitleSend;
            setAddRemark((prev) => {
              return {
                ...prev,
                MessageSend: MessageSend ?? "",
                SubTitleSend: SubTitleSend ?? "",
              };
            });
          }
          // if (SubFormCode) {
          //   const responseMessage =
          //     await api.Mst_SubmissionForm_GetBySubFormCode(SubFormCode);
          //   if (responseMessage) {
          //     console.log("responseMessage ", responseMessage);
          //     if (
          //       responseMessage?.Data?.Lst_Mst_SubmissionFormMessage?.length
          //     ) {
          //       const messageValue =
          //         responseMessage?.Data?.Lst_Mst_SubmissionFormMessage[0]
          //           ?.MessageSend;
          //       const titleValue =
          //         responseMessage?.Data?.Lst_Mst_SubmissionFormMessage[0]
          //           ?.SubTitleSend;
          //     }
          //     return responseMessage;
          //   } else {
          //     showError({
          //       message: (responseMessage.errorCode),
          //       debugInfo: responseMessage.debugInfo,
          //       errorInfo: responseMessage.errorInfo,
          //     });
          //   }
          // }
          return response;
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

        return "";
      } else {
        return "";
      }
    },
  });

  if (isLoadingDataZalo) {
    return <LoadPanel visible={isLoadingDataZalo} />;
  }

  const handleSend = async () => {
    const formData = formRef.current.instance.option("formData");
    const { isValid } = formRef.current.instance.validate();
    if (isValid) {
      const obj = {
        ...formData,
      };
      const response = await api.ET_Ticket_SendEmail(obj);
      if (response.isSuccess) {
        toast.success(t("Response success fully"));
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
    }
  };

  const emailDataSource = new DataSource({
    store: {
      data: Lst_CustomerEmail.map((item: string) => {
        return {
          value: item,
          label: item,
        };
      }),
      type: "array",
      key: "value",
    },
  });

  const onCustomItemCreating = (e: any) => {
    if (!e.text) {
      return;
    }

    const objEmailNew = {
      value: e.text,
      label: e.text,
    };
    e.customItem = emailDataSource
      .store()
      .insert(objEmailNew)
      .then(() => emailDataSource.load())
      .then(() => objEmailNew)
      .catch((error) => {
        throw error;
      });
  };
  const onValueChanged = (data: any) => {
    // console.log(component.option("selectedItem"));
  };
  const handleChangeValue = (e: any) => {};
  return (
    <div className={"w-full message-reply mb-2"}>
      {/* <div className="w-full p-2 mb-3">
        <div className="flex float-left ml-5">
          <span className="text-gray mr-2">
            Địa chỉ nhận <span className="text-red">*</span>
          </span>
          <SelectBox
            // value={condition.EmailCode}
            onSelectionChanged={(value: any) => {
              setCondition((prev: any) => {
                return {
                  ...prev,
                  ObjCode: value.selectedItem,
                };
              });
            }}
            dataSource={Lst_CustomerEmail}
            // displayExpr="ObjCode"
            // valueExpr="ObjCode"
          />
        </div>
        <div className="flex float-right mr-5">
          <span className="text-gray mr-2">
            Mẫu tin nhắn Email <span className="text-red">*</span>
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
            dataSource={listMedia.EMAIL}
            displayExpr="SubFormName"
            valueExpr="SubFormCode"
          />
        </div>
      </div> */}
      <div className="input-area">
        <Form
          formData={addRemark}
          onFormDataChange={handleChangeValue}
          ref={formRef}
          className="eticekt-form"
          validationGroup="Form-Email"
        >
          <GroupItem colCount={2} cssClass="group-part" alignItemLabels={true}>
            <SimpleItem
              validationRules={[requiredType]}
              dataField="CtmEmail"
              editorType="dxSelectBox"
              label={{
                text: t("CtmEmail"),
                alignment: "left",
              }}
              editorOptions={{
                height: 30,
                searchEnabled: true,
                showClearButton: true,
                displayExpr: "label",
                valueExpr: "value",
                acceptCustomValue: true,
                onCustomItemCreating: onCustomItemCreating,
                dataSource: emailDataSource,
                onValueChanged: onValueChanged,
              }}
            />
            <SimpleItem
              validationRules={[requiredType]}
              dataField="SubFormCode"
              editorType="dxSelectBox"
              label={{
                text: t("SubFormCode"),
              }}
              cssClass="justify-content-flex-end"
              editorOptions={{
                height: 30,
                dataSource: listMedia.EMAIL,
                displayExpr: "SubFormName",
                valueExpr: "SubFormCode",
                onValueChanged: (param: any) => {
                  setAddRemark((prev: any) => {
                    return {
                      ...prev,
                      SubFormCode: param.value,
                    };
                  });
                },
              }}
            />
          </GroupItem>

          <SimpleItem
            validationRules={[requiredType]}
            dataField="SubTitleSend"
            label={{
              text: t("SubTitleSend"),
              visible: false,
            }}
            editorType="dxHtmlEditor"
            editorOptions={{
              placeholder: t("Input"),
              height: "40px",
            }}
            // render={(param:any) => {
            //   return <HtmlEditor {...param} />
            // }}
          />
          <SimpleItem
            validationRules={[requiredType]}
            dataField="MessageSend"
            label={{
              text: t("MessageSend"),
              visible: false,
            }}
            editorType="dxHtmlEditor"
            editorOptions={{
              enabled: true,
              height: "200px",
              toolbar: {
                multiline: false,
                items: [
                  {
                    name: "undo",
                  },
                  {
                    name: "redo",
                  },
                  {
                    name: "separator",
                  },
                  {
                    name: "size",
                    acceptedValues: sizeValues,
                  },
                  {
                    name: "font",
                    acceptedValues: fontValues,
                  },
                  {
                    name: "separator",
                  },
                  {
                    name: "bold",
                  },
                  {
                    name: "italic",
                  },
                  {
                    name: "strike",
                  },
                  {
                    name: "underline",
                  },
                  {
                    name: "separator",
                  },
                  {
                    name: "alignLeft",
                  },
                  {
                    name: "alignCenter",
                  },
                  {
                    name: "alignRight",
                  },
                  {
                    name: "alignJustify",
                  },
                  {
                    name: "separator",
                  },
                  {
                    name: "orderedList",
                  },
                  {
                    name: "bulletList",
                  },
                  {
                    name: "separator",
                  },
                  {
                    name: "header",
                  },
                  {
                    name: "separator",
                  },
                  {
                    name: "color",
                  },
                  {
                    name: "background",
                  },
                  {
                    name: "separator",
                  },
                  {
                    name: "link",
                  },
                  {
                    name: "image",
                  },
                  {
                    name: "separator",
                  },
                  {
                    name: "clear",
                  },
                  {
                    name: "codeBlock",
                  },
                  {
                    name: "blockquote",
                  },
                  {
                    name: "separator",
                  },
                  {
                    name: "insertTable",
                  },
                  {
                    name: "deleteTable",
                  },
                  {
                    name: "insertRowAbove",
                  },
                  {
                    name: "insertRowBelow",
                  },
                  {
                    name: "deleteRow",
                  },
                  {
                    name: "insertColumnLeft",
                  },
                  {
                    name: "insertColumnRight",
                  },
                  {
                    name: "deleteColumn",
                  },
                ],
              },
            }}
          />
        </Form>
        {/* <div className="w-full" style={{ height: 20 }}>
          <div className="flex">
            <Attachment
              file={{ Url: "/content/test.pdf" }}
              onRemoveClick={() => {
                alert("removed");
              }}
            />
          </div>
        </div> */}
        {/* <div className="w-full p-3">
          <div className="flex float-right mr-2 buttons">
            <span>
              <i className="dx-icon-attach"></i>
            </span>
          </div>
        </div> */}
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
            text={t("Send Email")}
            className="eticket-button-send"
            onClick={handleSend}
          >
            {t("Send Email")}
            <Icon style={{ marginLeft: "10px" }} name="send"></Icon>
          </Button>
        </div>
      </div>
    </div>
  );
};
