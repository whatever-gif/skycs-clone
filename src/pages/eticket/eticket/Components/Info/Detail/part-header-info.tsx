import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import { Avatar } from "../../../../components/avatar";

import NavNetworkLink from "@/components/Navigate";
import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { usePhone } from "@/packages/hooks/usePhone";
import { showErrorAtom } from "@/packages/store";
import { CcCall, EticketT } from "@/packages/types";
import { listColor } from "@/pages/eticket/add-demo/components/list-color";
import { useQuery } from "@tanstack/react-query";
import { Button, SelectBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import { ReactNode, memo, useEffect, useRef } from "react";
import { toast } from "react-toastify";
const PartHeaderInfo = ({
  data,
  onReload,
}: {
  data: EticketT;
  onReload: () => void;
}) => {
  const { t } = useI18n("Eticket_Detail");
  const { t: e } = useI18n("ErrorMessage");
  const { t: common } = useI18n("common");
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const phone = usePhone();
  const useRefPhoneNo = useRef("");
  // const hanldleOnChangePhoneNo = (_value: any, index: string) => {
  //   const _index = _value?.component?._dataSource?._items?.findIndex(
  //     (x: any) => x.phoneCode === _value.value
  //   );

  //   //setPhoneCode(_value.value || "");
  // };

  const { Lst_ET_Ticket, Lst_ET_TicketCustomer } = data;

  const hanldleChangePhoneNo = (event: any) => {
    useRefPhoneNo.current = event.value;
    const _index = event?.component?._dataSource?._items?.findIndex(
      (x: any) => x.phoneCode === event.value
    );
  };

  const { data: MstTicketEstablishInfo } = useQuery(
    ["MstTicketEstablishInfoType"],
    api.Mst_TicketEstablishInfoApi_GetAllInfo
  );

  useEffect(() => {
    if (
      Lst_ET_TicketCustomer !== undefined &&
      Lst_ET_TicketCustomer !== null &&
      Lst_ET_TicketCustomer.length
    ) {
      useRefPhoneNo.current = Lst_ET_TicketCustomer[0].CustomerPhoneNo;
    }
  }, []);

  const addCall = async (objRQ_ET_Ticket: any) => {
    const response = await api.AddCall(objRQ_ET_Ticket);
    if (response.isSuccess) {
      toast.success(t("Add Call Successfully"));
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

  const doCall = (phoneNo: any) => {
    phone.call(phoneNo, (call: CcCall) => {
      if (
        Lst_ET_Ticket !== undefined &&
        Lst_ET_Ticket !== null &&
        call !== undefined &&
        call !== null
      ) {
        const objET_Ticket = Lst_ET_Ticket[0];
        const objRQ_ET_Ticket = {
          TicketID: objET_Ticket.TicketID ?? "",
          OrgID: objET_Ticket.OrgID ?? "",
          ActionType: "0",
          List_ET_TicketMessageCall: [
            {
              CallID: call.Id,
            },
          ],
        };
        addCall(objRQ_ET_Ticket);
      }
    });
  };

  const spliceString = (string: string): ReactNode => {
    console.log("string ", string.split(","));

    const getLength = string.length;
    let arr: string[] = string.split(",").sort((a, b) => b.length - a.length);
    // for (let i = 0; i < Math.ceil(getLength / 50); i++) {
    //   arr = [...arr, string.slice(i * 50, (i + 1) * 50)];
    // }
    let count = 0;
    return arr.map((item: any, idx: any) => {
      if (count == listColor.length - 1) {
        count = 0;
      } else {
        count++;
      }

      return (
        <p
          key={idx}
          className={`tag mx-1`}
          style={{
            padding: "4px",
            marginBottom: "5px",
            marginRight: "5px",
            borderRadius: "10px",
            color: "#ff004a",
            backgroundColor: "#ffdcdc",
          }}
        >
          <i className="dx-icon-warning"></i> {item}
        </p>
      );
    });
  };

  const handleUpdateStatus = async (ticket: any, value: any) => {
    const resp: any = await api.ETTicket_UpdateStatus({
      TicketID: ticket.TicketID,
      TicketStatus: value,
    });

    if (resp?.isSuccess) {
      toast.success(common("Update successfully!"));
    } else {
      showError({
        message: e(resp._strErrCode),
        _strErrCode: resp._strErrCode,
        _strTId: resp._strTId,
        _strAppTId: resp._strAppTId,
        _objTTime: resp._objTTime,
        _strType: resp._strType,
        _dicDebug: resp._dicDebug,
        _dicExcs: resp._dicExcs,
      });
    }
  };

  return (
    <div className={"w-full flex flex-col detail-header "}>
      {Lst_ET_Ticket.map((item: any, index: number) => {
        const objMst_Customer = Lst_ET_TicketCustomer.find(
          (it: any) => it.CustomerCodeSys === item.CustomerCodeSys
        );

        console.log(item);

        // item.CustomerName = objMst_Customer?.CustomerName;
        return (
          <div key={index}>
            <div className={"w-full header-title position-relative mb-2"}>
              <div className="font-weight-bold w-[66%] break-all">
                {objMst_Customer
                  ? Lst_ET_Ticket[0].TicketName +
                    " - " +
                    objMst_Customer.TicketID
                  : ""}
              </div>
              {item?.TicketWarning && (
                <div
                  className={"position-absolute break-all text-right"}
                  style={{ top: "-10px", right: "-16px" }}
                >
                  <p className={"sp-warning mr-2 flex align-items-center"}>
                    {/* {item?.TicketWarning ?? ""} */}
                    {/* {spliceString(item?.TicketWarning ?? "")} */}
                    {spliceString(item?.TicketWarning ?? "")}
                  </p>
                </div>
              )}
            </div>

            <div className={"w-full"}>
              <ResponsiveBox className={"w-full"}>
                <Row></Row>
                <Col ratio={1}></Col>
                <Col ratio={1}></Col>
                <Col ratio={1}></Col>
                <Col ratio={1}></Col>
                <Item>
                  <Location row={0} col={0} />
                  {Lst_ET_TicketCustomer.length && (
                    <div className="flex items-center">
                      <Avatar
                        name={Lst_ET_TicketCustomer[index].CustomerName}
                        img={Lst_ET_TicketCustomer[index].CustomerAvatarPath}
                        size={"sm"}
                        className="detail-avatar mr-1"
                      />
                      <div>
                        <NavNetworkLink
                          className="detail-customer-name"
                          to={`/customer/detail/${Lst_ET_TicketCustomer[index].CustomerCodeSys}`}
                        >
                          {Lst_ET_TicketCustomer[index].CustomerName}
                        </NavNetworkLink>

                        <br></br>
                        <div className="flex mt-1 select-phone">
                          <SelectBox
                            value={
                              Lst_ET_TicketCustomer[index]
                                ?.Lst_CustomerPhoneNo?.[0] ?? ""
                            }
                            style={{ width: 150, height: 30 }}
                            searchEnabled={true} // hiển thị chức năng tìm kiếm trong selectbox
                            dataSource={
                              Lst_ET_TicketCustomer[index].Lst_CustomerPhoneNo
                            }
                            onValueChanged={hanldleChangePhoneNo}
                            onSelectionChanged={(_value: any) => {}}
                          ></SelectBox>
                          <PermissionContainer permission="BTN_ETICKET_DTLETICKET_CALL">
                            <Button
                              height={30}
                              stylingMode={"contained"}
                              type="default"
                              icon="tel"
                              className="phone-button ml-1"
                              onClick={() => {
                                const phoneNo = useRefPhoneNo.current;
                                doCall(phoneNo);
                              }}
                            />
                          </PermissionContainer>
                        </div>
                      </div>
                    </div>
                  )}
                </Item>
                <Item>
                  <Location row={0} col={1} />
                  <div className="flex">
                    <span className="text-gray mr-1">{t("ProcessTime")}:</span>
                    <strong className="detail-header-value">
                      {item.ProcessTime ?? "--"}
                    </strong>
                  </div>

                  <div className="flex mt-2">
                    <span className="text-gray mr-1">
                      {t("AgentContactChannelName")}:
                    </span>
                    <strong className="detail-header-value">
                      {item.AgentContactChannelName ?? "--"}
                    </strong>
                  </div>
                </Item>

                <Item>
                  <Location row={0} col={2} />
                  <div className="flex align-items-center" id="status">
                    <span className="text-gray mr-1">{t("TicketStatus")}:</span>
                    {item.TicketStatus ? (
                      <SelectBox
                        width={120}
                        items={
                          MstTicketEstablishInfo?.Data?.Lst_Mst_TicketStatus
                        }
                        displayExpr={"AgentTicketStatusName"}
                        valueExpr={"TicketStatus"}
                        defaultValue={item.TicketStatus}
                        onValueChanged={(e: any) =>
                          handleUpdateStatus(item, e.value)
                        }
                      />
                    ) : (
                      <strong
                        className={`detail-header-value status ${item?.TicketStatus?.toLowerCase()}`}
                      >
                        {"--"}
                      </strong>
                    )}
                  </div>

                  <div className="flex mt-2">
                    <span className="text-gray mr-1">
                      {t("AgentTicketTypeName")}:
                    </span>
                    <strong className="detail-header-value">
                      {item.AgentTicketTypeName ?? "--"}
                    </strong>
                  </div>
                </Item>
                <Item></Item>
              </ResponsiveBox>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(PartHeaderInfo);
