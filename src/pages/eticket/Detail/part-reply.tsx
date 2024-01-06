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
import { PartReplyZalo } from "./part-reply-zalo";
import { PartReplyEmail } from "./part-reply-email";
import { PartReplyCall } from "./part-reply-call";
import { PartReplyNote } from "./part-reply-note";

export const PartReply = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const onItemClick = (e: any) => {
    setCurrentTab(e.itemIndex);
  };

  const getReplyContent = () => {
    if (currentTab == 0) return <PartReplyZalo />;
    if (currentTab == 1) return <PartReplyEmail />;
    if (currentTab == 2) return <PartReplyCall />;
    if (currentTab == 3) return <PartReplyNote />;
  };

  return (
    <div className={"w-full sep-bottom-5 mb-5"}>
      <div className={"w-full pt-0 sep-bottom-1 tab-ctn-2"}>
        <Tabs
          style={{ maxWidth: 400 }}
          onItemClick={onItemClick}
          selectedIndex={currentTab}
        >
          <TabItem text="Zalo" />

          <TabItem text="Email" />

          <TabItem text="Call" />

          <TabItem text="Ghi chú" />
        </Tabs>
      </div>

      {getReplyContent()}

      {/* <div className={'w-full'}>
                <div className="flex float-right">
                    <DropDownBox
                        label="Lựa chọn xử lý"
                        style={{ width: 160 }}
                    >
                        <List>

                        </List>

                    </DropDownBox>
                    <Button
                        stylingMode={"contained"}
                        type="default"
                        icon="email"
                        text="Gửi"
                        className='mr-1'

                    />
                </div>
                <div className="flex float-left">
                    <Button
                        stylingMode={"contained"}
                        type="default"
                        icon="tel"
                        text="Shortcut"
                        className='mr-1'

                    />
                </div>
            </div> */}
    </div>
  );
};
