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
  DropDownBox,
  List,
} from "devextreme-react";
import { Item as TabItem } from "devextreme-react/tabs";
import { useState } from "react";

export const PartReplyZalo = () => {
  return (
    <div className={"w-full message-reply mb-2"}>
      <div className="w-full p-2 mb-3">
        <div className="flex float-left ml-5">
          <span className="text-gray mr-2">
            Địa chỉ nhận <span className="text-red">*</span>
          </span>
          <DropDownBox label="091234567" style={{ width: 200 }}>
            <List></List>
          </DropDownBox>
        </div>
        <div className="flex float-right mr-5">
          <span className="text-gray mr-2">
            Mẫu tin nhắn Zalo <span className="text-red">*</span>
          </span>
          <DropDownBox label="091234567" style={{ width: 200 }}>
            <List></List>
          </DropDownBox>
        </div>
      </div>
      <div className="input-area">
        <textarea placeholder="Nhập..."></textarea>
        <div className="w-full" style={{ height: 20 }}>
          <div className="flex float-right mr-2 buttons"></div>
        </div>
      </div>

      <div className={"w-full box-button-eticket"}>
        <div className="flex float-right">
          <DropDownBox label="Lựa chọn xử lý" style={{ width: 160 }}>
            <List></List>
          </DropDownBox>
          <Button
            stylingMode={"contained"}
            type="default"
            icon="email"
            text="Gửi"
            className="mr-1"
          />
        </div>
      </div>
    </div>
  );
};
