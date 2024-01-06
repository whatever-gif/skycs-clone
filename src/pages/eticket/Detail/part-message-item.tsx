import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import {
  Button,
  ScrollView,
  TabPanel,
  Tabs,
  TextArea,
  DropDownBox,
  List,
  ButtonGroup,
} from "devextreme-react";
import { Item as TabItem } from "devextreme-react/tabs";
import { Avatar } from "../components/avatar";
import { Height } from "devextreme-react/chart";
import { Email, EticketMessage, Call } from "@/packages/types";
import { Attachment } from "../components/attachment";
import { useMemo } from "react";

export const PartMessageItem = ({ data }: { data: EticketMessage }) => {
  const AttachmentList = () => {
    if (!data.Attachments || data.Attachments.length == 0) return <></>;

    return (
      <div className="w-full pl-5 pr-5">
        <div className="flex pl-2 pt-1">
          {data.Attachments.map((att, idx) => {
            return <Attachment file={att}></Attachment>;
          })}
        </div>
      </div>
    );
  };
  const EmailDetail = ({ email }: { email: Email }) => {
    return (
      <div className="w-full pl-5 pr-5">
        <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2">Email gửi đi: </span>
          <span>{email.From}</span>
        </div>
        <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2">Tiêu đề: </span>
          <span>{email.Subject}</span>
        </div>
        <div className="flex pl-2 pt-1">
          <span
            className="text-gray mr-2"
            style={{ width: "200px", display: "block" }}
          >
            Nội dung:{" "}
          </span>
          <div className="inline-block">{email.Detail}</div>
        </div>
      </div>
    );
  };

  const CallDetail = ({ call }: { call: Call }) => {
    return (
      <div className="w-full pl-5 pr-5">
        <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2">SĐT gọi: </span>
          <span>{call.FromNumber}</span>
        </div>
        <div className="flex pl-2 pt-1">
          <span className="text-gray mr-2">SĐT nhận: </span>
          <span>{call.ToNumber}</span>
        </div>
      </div>
    );
  };

  const EventDetail = ({ data }: { data: EticketMessage }) => {
    return (
      <div className="w-full pl-5 pr-5 pt-1">
        <center>{data.Detail ?? ""}</center>
      </div>
    );
  };

  const InfoDetail = ({ data }: { data: EticketMessage }) => {
    if (data.Type == "Email" && data.Email != null)
      return <EmailDetail email={data.Email}></EmailDetail>;
    else if (data.Type == "Call" && data.Call != null)
      return <CallDetail call={data.Call}></CallDetail>;
    else if (data.Type == "Event")
      return <EventDetail data={data}></EventDetail>;
    //...
    return <></>;
  };

  const messageTypeCss = useMemo(() => {
    var type1 = data.Type ? data.Type.toLowerCase() : "";

    if (type1 == "email") {
      return `${type1} ${data.Email?.Type?.toLocaleLowerCase()}`;
    }
    if (type1 == "call") {
      return `${type1} ${data.Call?.Type?.toLocaleLowerCase()}`;
    }

    return type1;
  }, [data]);

  console.log("messages", data);

  return (
    <div
      className={`w-full position-relative bg-white mb-3 pb-3 message-item ${
        data.Type ? data.Type.toLocaleLowerCase() : ""
      }`}
    >
      {data.Type != "Event" ? (
        <>
          <div className="flex p-2">
            <div className=" avatar-name mr-5">
              <Avatar
                name={data.AuthorName}
                img={data.AuthorImage}
                size={"sx"}
                className="mr-1"
              />
              <strong className="name">{data.AuthorName}</strong>
            </div>
            <span className="text-gray" style={{ lineHeight: "32px" }}>
              {" "}
              <i className="dx-icon-clock mr-1"></i>
              {data.CreateDtime}
            </span>
          </div>

          <div className="position-absolute" style={{ top: 0, right: 0 }}>
            <Button
              stylingMode="outlined"
              type="default"
              className="btn-msg-action"
              icon="custom-reply"
            />
            <Button
              stylingMode="outlined"
              type="default"
              className="btn-msg-action"
              icon="pin"
            />
            <Button
              stylingMode="outlined"
              type="danger"
              className="btn-msg-action"
              icon="trash"
            />
          </div>

          <span className={`message-type ${messageTypeCss}`}>
            <i></i>
          </span>
        </>
      ) : (
        <></>
      )}

      <InfoDetail data={data}></InfoDetail>
      <AttachmentList></AttachmentList>
    </div>
  );
};
