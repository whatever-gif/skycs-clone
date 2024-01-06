import { LinkCell } from "@/packages/ui/link-cell";
import { CheckBox } from "devextreme-react";
import React from "react";
const fakeData = {
  TicketID: "DAG.53493",
  OrgID: "7206207001",
  NetworkID: "7206207001",
  TicketStatus: "CLOSED",
  CustomerCodeSys: "CTMCS.D8M.23705",
  TicketName:
    'strJson: {"ET_Ticket":{"TicketStatus":"OPEN","OrgID":"7206207001","CustomerCodeSys":"CTMCS.D8M.23705","TicketName',
  TicketDetail: null,
  AgentCode: "USER03@SKYCS.VN",
  DepartmentCode: "HQ1900",
  TicketType: "TKTYPE.DAB.10033",
  TicketDeadline: "2023-10-31 16:10:00",
  TicketPriority: "NORMAL",
  TicketJsonInfo:
    '{"TKCCFGCODESYS.DAD.10330":[],"TKCCFGCODESYS.DAE.10340":[],"TKCCFGCODESYS.DAD.10331":[],"CreateBy":"user03@skycs.vn","CreateDTimeUTC":"2023-10-16 16:11:28","TKCCFGCODESYS.DAD.10297":"2023-10-16","UserCodeMng":["USER03@SKYCS.VN"],"CustomerType":"CANHAN","PartnerType":["CUSTOMER"]}',
  ReceptionDTimeUTC: "2023-10-16 16:12:01",
  TicketCustomType: null,
  TicketSource: null,
  ReceptionChannel: null,
  ContactChannel: null,
  Tags: null,
  SLAID: null,
  RemindWork: null,
  TicketEvaluate: null,
  RemindDTimeUTC: "2023-10-16 16:10:40",
  ChannelId: "0",
  MsgDTime: "2023-10-18 14:29:07",
  Description:
    "<b>tienminhanh@skycs.vn</b> đã <b>Gộp</b> với eTicket: DAG.53491 vào lúc 2023-10-18 14:29:07",
  CreateDTimeUTC: "2023-10-16 16:11:28",
  CreateBy: "user03@skycs.vn",
  LUDTimeUTC: "2023-10-18 14:29:07",
  LUBy: "tienminhanh@skycs.vn",
  ProcessDTimeUTC: "",
  ProcessBy: null,
  CloseDTimeUTC: "2023-10-18 14:28:08",
  CloseBy: "tienminhanh@skycs.vn",
  LogLUDTimeUTC: "2023-10-18 14:29:07",
  LogLUBy: "tienminhanh@skycs.vn",
  AgentTicketStatusName: "Closed",
  CustomerTicketStatusName: "Closed",
  AgentName: "Phương Ánh",
  CustomerName: "Phương Ánh 123",
  CustomerCode: "CTMCS.D9S.35821",
  AgentTicketPriorityName: "Normal ",
  CustomerTicketPriorityName: "Trung bình ",
  DepartmentName: "CSC HQ",
  AgentTicketCustomTypeName: null,
  CustomerTicketCustomTypeName: null,
  AgentTicketSourceName: null,
  CustomerTicketSourceName: null,
  AgentReceptionChannelName: null,
  CustomerReceptionChannelName: null,
  AgentTicketTypeName: "Thêm01",
  CustomerTicketTypeName: "Thêm01",
  AgentContactChannelName: null,
  CustomerContactChannelName: null,
  SLALevel: null,
  NNTFullName: "CÔNG TY CỔ PHẦN QUỐC TẾ LONG QUANG",
  ProcessTime: null,
  TicketWarning: null,
  DTimeSys: "2023-10-31 18:28:53",
  FirstResTime: null,
  FistTicketMessage: "2023-10-16 16:12:01",
  ResolutionTime: null,
  CustomerPhoneNo: "0358915210",
  CustomerEmail: "phah201@gmail.com",
  ZaloUserFollowerId: "5096012349365109417",
  ListFollowerAgentCode: "USER03@SKYCS.VN",
  ListFollowerAgentName: "Phương Ánh",
  QtyMissCall: 0,
  TKCCFGCODESYSDAD10330: [],
  TKCCFGCODESYSDAE10340: [],
  TKCCFGCODESYSDAD10331: [],
  TKCCFGCODESYSDAD10297: "2023-10-16",
  UserCodeMng: ["USER03@SKYCS.VN"],
  CustomerType: "CANHAN",
  PartnerType: ["CUSTOMER"],
};
const Rowcustomize = () => {
  return (
    <tr>
      <td className="text-center">
        <CheckBox />
      </td>
      <td colSpan={7}>
        <div className="eticket-row-container" style={{ flex: 1 }}>
          <img src="" alt="" />
          <div className="eticket-row-item-content">
            <div className="eticket-row-item-content-top">
              <LinkCell onClick={() => {}} value="Hỗ trợ tạo đơn hàng DH001-22003" />
              <div className="eticket-row-item-content-top-right">
                <div className="status">
                  <div className="color"></div>
                  <div className="text">Closed</div>
                </div>
              </div>
            </div>
            <div className="eticket-row-item-content-bottom">
              <div className="eticket-row-item-content-bottom-left">
                <h4 className="name">Nguyễn Phương Linh</h4>
                <div className="separate">.</div>
                <div className="inchangeof flex align-item-center">
                  Phụ trách: <span>Trần Thị Hòa</span>
                </div>
                <div className="separate">.</div>
                <div className="inchangeof">
                  Phân loại: <span>Hỗ trợ khách hàng</span>
                </div>
              </div>
              <div className="eticket-row-item-content-bottom-right">time</div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default Rowcustomize;
