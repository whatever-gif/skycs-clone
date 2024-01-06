import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { Eticket } from "@/packages/types";
import { ScrollView } from "devextreme-react";
import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import { PartDetailInfo } from "./part-detail-info";
import { PartMessageList } from "./part-message-list";
import { PartReply } from "./part-reply";
export const Tab_Detail = ({ data }: { data: Eticket }) => {
  const windowSize = useWindowSize();
  const scrollHeight = windowSize.height - 100;
  return (
    <ResponsiveBox className={"w-full"}>
      <Row></Row>
      <Col ratio={3}></Col>
      <Col ratio={1}></Col>
      <Item>
        <Location row={0} col={0} />

        <ScrollView style={{ maxHeight: scrollHeight }}>
          <div className="w-full" style={{ background: "#F5F7F9" }}>
            <PartReply></PartReply>
            <PartMessageList data={data} />
          </div>
        </ScrollView>
      </Item>
      <Item>
        <Location row={0} col={1} />
        <PartDetailInfo data={data} />
      </Item>
    </ResponsiveBox>
  );
};
