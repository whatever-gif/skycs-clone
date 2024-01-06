import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import {
  requiredStringType,
  requiredType,
} from "@/packages/common/Validation_Rules";
import { showErrorAtom } from "@/packages/store";
import { Eticket_AddRemark } from "@/packages/types";
import { Icon } from "@/packages/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, SelectBox } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import PartReplyFormItem from "./part-reply-zalo-form-item";
import { currentValueTabAtom, reloadingtabAtom } from "./store";

export const PartReplyZalo = ({
  dataValue,
  listMedia,
  data,
  onReload,
}: {
  dataValue: any;
  listMedia: any;
  onReload: any;
  data: Eticket_AddRemark;
}) => {
  const api = useClientgateApi();
  const { t } = useI18n("Eticket_Detail_ZALO");
  const showError = useSetAtom(showErrorAtom);
  const formRef: any = useRef(null);
  const reloadingtab = useAtomValue(reloadingtabAtom);
  const setReloadingtab = useSetAtom(reloadingtabAtom);
  const currentValueTab = useAtomValue(currentValueTabAtom);
  const { data: listMstBulletinType } = useQuery({
    queryKey: ["listMstSourceData"],
    queryFn: async () => {
      const response = await api.Mst_SourceData_GetAllActive();
      if (response.isSuccess) {
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
    },
  });

  let channel = "";

  const initValue = {
    ActionType: data?.ActionType || "0",
    TicketID: data?.TicketID || "",
    OrgID: data?.OrgID || "",
    Description: data?.Description || "",
    ObjCode: "",
    ObjType: "",
    SubFormCode: "",
    ZNS: [],
  };

  // const { data: listSubmissionForm } = useQuery(["listSubmissionForm"], () =>
  //   api.Mst_SubmissionForm_GetAllActive()
  // );

  const { data: listSubmissionForm } = useQuery({
    queryKey: ["listSubmissionForm"],
    queryFn: async () => {
      const response = await api.Mst_SubmissionForm_GetAllActive();
      if (response.isSuccess) {
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
    },
  });

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

  // const handleChangeValue = (value: any, name: any, valueSelect: any) => {
  //   const obj = {
  //     [name]: {
  //       SourceDataType: valueSelect ? valueSelect : item.SourceDataType,
  //       ParamSFCode: value ? value : item.ParamSFCode,
  //       ParamSFCodeZNS: name ? name : item.ParamSFCodeZNS,
  //     },
  //   };
  //   // onChange(obj);
  //   console.log("obj ", obj);
  // };
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
  const [addRemark, setAddRemark] = useState(initValue);
  const [valueSelect, setValueSelect] = useState(undefined);
  // const { data: dataRender, isLoading } = useQuery({
  //   queryKey: ["", JSON.stringify(addRemark)],
  // });

  const { Lst_CustomerPhoneNo, Lst_CustomerEmail, Lst_ZaloUserFollowerId } =
    dataValue.Lst_ET_TicketCustomer[0] ?? {
      Lst_CustomerPhoneNo: [],
      Lst_ZaloUserFollowerId: [],
      Lst_CustomerEmail: [],
    };
  // console.log("dataValue ", dataValue);

  const phoneList =
    Lst_CustomerPhoneNo?.map((item: string) => {
      return {
        ObjCode: item,
        ObjType: "PhoneNo",
      };
    }) ?? [];

  const zaloList =
    Lst_ZaloUserFollowerId?.map((item: string) => {
      return {
        ObjCode: item,
        ObjType: "ZaloUserId",
      };
    }) ?? [];

  const dataSource = [...phoneList, ...zaloList];

  const dataZalo =
    addRemark.ObjCode === ""
      ? []
      : addRemark.ObjType === "PhoneNo"
      ? listMedia.ZALO.filter((item: any) => {
          return item.IDZNS;
        })
      : listMedia.ZALO.filter((item: any) => {
          return !item.IDZNS;
        });

  const {
    data: dataZaloApi,
    isLoading: isLoadingDataZalo,
    refetch,
  } = useQuery({
    queryKey: ["CalcBySubFormCodeForZaloMessage", addRemark.SubFormCode],
    queryFn: async () => {
      if (addRemark.SubFormCode !== "") {
        const obj = {
          SubFormCode: addRemark.SubFormCode,
          TicketID: dataValue.Lst_ET_Ticket[0].TicketID,
        };

        if (addRemark.ObjType === "PhoneNo") {
          const response = await api.MstSubmissionForm_CalcBySubFormCodeForZNS(
            obj
          );
          if (response.isSuccess) {
            if (response?.Data?.Lst_Mst_SubmissionFormZNS?.length) {
              const messageSend =
                response?.Data?.Lst_Mst_SubmissionFormZNS[0].MessageSend;
              setAddRemark((prev) => {
                return {
                  ...prev,
                  MessageSend: messageSend ?? "",
                  ZNS: response?.Data?.Lst_Mst_SubmissionFormZNS ?? [],
                };
              });
            } else {
              return response;
            }
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

        const response =
          await api.MstSubmissionForm_CalcBySubFormCodeForZaloMessage(obj);
        if (response.isSuccess) {
          const messageSend =
            response.Data.Lst_Mst_SubmissionFormMessage[0].MessageSend;
          const SubTitleSend =
            response.Data.Lst_Mst_SubmissionFormMessage[0].SubTitleSend;
          setAddRemark((prev) => {
            return {
              ...prev,
              MessageSend: messageSend ?? "",
              SubTitleSend: SubTitleSend ?? "",
            };
          });
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

  useEffect(() => {
    if (addRemark.SubFormCode && addRemark.SubFormCode !== "") {
      if (formRef.current) {
        formRef.current.instance.updateData({
          ZNS: [],
        });
      }
    }
  }, [addRemark.SubFormCode]);

  const handleSend = async () => {
    const formData = formRef.current.instance.option("formData");
    const { isValid } = formRef.current.instance.validate();
    if (isValid) {
      if (addRemark.ObjType === "PhoneNo") {
        const obj = {
          ActionType: formData.ActionType ?? "",
          TicketID: formData.TicketID ?? "",
          strJsonZNS: JSON.stringify(formData.ZNS),
          // CtmPhoneNo: formData.ObjCode ?? "",
          CtmPhoneNo: formData.ObjCode ?? "", // 840387250887
          IDZNS: formData.IDZNS, //
        };
        const response = await api.ET_Ticket_SendZNS(obj);
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
      } else {
        const obj = {
          ActionType: formData.ActionType,
          MessageSend: formData.MessageSend,
          TicketID: formData.TicketID,
          ZaloUserFollowerId: formData.ObjCode,
          // CtmEmail: formData.ObjCode,
          // SubTitleSend: formData.SubTitleSend,
        };
        const response = await api.ET_Ticket_SendZaloMessage(obj);
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
    }
  };

  const errorCheck = addRemark.ObjType === "PhoneNo" ? [requiredType] : [];

  return (
    <div className={"w-full message-reply mb-2"}>
      <div className="input-area">
        <Form
          formData={addRemark}
          className="eticekt-form"
          ref={formRef}
          validationGroup="Part-reply-zalo-Form"
        >
          <GroupItem colCount={2} cssClass="group-part" alignItemLabels={true}>
            <SimpleItem
              validationRules={[requiredType]}
              dataField="ObjCode"
              editorType="dxSelectBox"
              label={{
                text: t("ObjCode"),
                alignment: "left",
              }}
              editorOptions={{
                height: 30,
                dataSource: dataSource,
                displayExpr: "ObjCode",
                valueExpr: "ObjCode",
                onValueChanged: (param: any) => {
                  // const listValue = param.component.instance();
                  const newValue = dataSource.find((item) => {
                    return item.ObjCode === param.value;
                  });
                  if (newValue) {
                    setAddRemark((prev: any) => {
                      return {
                        ...prev,
                        ...newValue,
                      };
                    });
                  }
                },
              }}
            />
            <SimpleItem
              validationRules={errorCheck}
              dataField="SubFormCode"
              editorType="dxSelectBox"
              cssClass="justify-content-flex-end"
              label={{
                text:
                  addRemark.ObjType === "PhoneNo"
                    ? t("SubFormCode_Phone")
                    : t("SubFormCode_Zalo"),
              }}
              editorOptions={{
                height: 30,
                dataSource: dataZalo,
                displayExpr: "SubFormName",
                valueExpr: "SubFormCode",
                onValueChanged: (param: any) => {
                  const newData = dataZalo.find(
                    (item: any) => item.SubFormCode === param.value
                  );
                  setAddRemark((prev: any) => {
                    return {
                      ...prev,
                      ...newData,
                    };
                  });
                },
              }}
            />
          </GroupItem>
          {addRemark.ObjType !== "PhoneNo" ? (
            <SimpleItem
              dataField="MessageSend"
              label={{
                text: t("MessageSend"),
                visible: false,
              }}
              editorType="dxTextArea"
              validationRules={[requiredStringType]}
              editorOptions={{
                height: "100px",
                placeholder: t("Input"),
              }}
            />
          ) : (
            <GroupItem cssClass="form-content-zalo">
              {addRemark.ZNS.map((item: any) => {
                const customizeItem: any = {
                  ...item,
                  SubFormCode: item.SubFormCode ?? "",
                  ParamSFCodeZNS: item.ParamSFCodeZNS ?? "",
                  SourceDataType: item.SourceDataType ?? "",
                  ParamSFCode: item.ParamSFCode ?? "",
                  ParamValue: item.ParamValue ?? "",
                  ParamSFName: item.ParamSFName ?? "",
                  ParamSFType: item.ParamSFType ?? "",
                  FlagActive: item.FlagActive,
                };

                return (
                  <PartReplyFormItem
                    item={customizeItem}
                    listMstBulletinType={listMstBulletinType?.DataList ?? []}
                    listSubmissionForm={listSubmissionForm?.DataList ?? []}
                  />
                );
              })}
            </GroupItem>
          )}
        </Form>
      </div>

      <div className={"w-full box-button-eticket"}>
        <div className="flex">
          <SelectBox
            value={addRemark.ActionType} // giá trị khởi tạo
            valueExpr={"ActionTypeCode"} // giá trị được chọn
            displayExpr={"ActionTypeName"} // giá trị hiển thị
            style={{ width: 360, marginRight: 8 }}
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
            text={t("Send")}
            className="eticket-button-send"
            onClick={handleSend}
          >
            {t("Send Zalo")}
            <Icon style={{ marginLeft: "10px" }} name="send"></Icon>
          </Button>
        </div>
      </div>
    </div>
  );
};
