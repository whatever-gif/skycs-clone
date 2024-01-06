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
import { Attachment } from "../components/attachment";
import { UploadFile } from "@/packages/types";

export const PartReplyEmail = () => {
  return (
    <div className={"w-full message-reply mb-2"}>
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
