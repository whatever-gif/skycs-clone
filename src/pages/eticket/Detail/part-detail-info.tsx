import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import { Button, ScrollView, TabPanel, Tabs } from "devextreme-react";
import { Item as TabItem } from "devextreme-react/tabs";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { Eticket } from "@packages/types";
export const PartDetailInfo = ({ data }: { data: Eticket }) => {
  const windowSize = useWindowSize();
  const scrollHeight = windowSize.height - 100;

  const TagList = (tags: string) => {
    var list = tags.split(",");
    if (!list) list = [];

    return (
      <div className="flex tag-list">
        {list.map((item, idx) => {
          return <span className={`tag ml-1`}>{item}</span>;
        })}
      </div>
    );
  };

  return (
    <>
      <div className={"w-full pt-0 sep-bottom-1 tab-ctn-1 bg-white"}>
        <Tabs>
          <TabItem text="Đơn vị xử lý"></TabItem>

          <TabItem text="HO"></TabItem>
        </Tabs>
      </div>
      <ScrollView style={{ maxHeight: scrollHeight - 30 }}>
        <div className="w-full">
          <div className="w-full p-2">
            <span className="text-gray float-left">Agent phụ trách: </span>
            <span className="float-right">{data.Agent}</span>
          </div>
          <div className="w-full p-2">
            <span className="text-gray float-left">Deadline: </span>
            <span className="float-right">{data.Deadline}</span>
          </div>
          <div className="w-full p-2">
            <span className="text-gray float-left">Tags: </span>
            <span className="float-right">{TagList(data.Tags ?? "")}</span>
          </div>
          <div className="w-full p-2">
            <span className="text-gray float-left">Agent phụ trách: </span>
            <span className="float-right">support@idocnet.com</span>
          </div>
        </div>
      </ScrollView>
    </>
  );
};
