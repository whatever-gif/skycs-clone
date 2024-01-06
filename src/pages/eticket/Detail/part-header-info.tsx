import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import { Avatar } from "../components/avatar";

import { Eticket } from "@/packages/types";
import { Button, DropDownBox, List } from "devextreme-react";
export const PartHeaderInfo = ({ data }: { data: Eticket }) => {
  return (
    <div className={"w-full flex flex-col sep-bottom-5 pl-5 pr-5 pt-2 pb-2"}>
      <div className={"w-full position-relative mb-2"}>
        <strong>
          {data.Name} - #{data.Id}
        </strong>
        <div
          className={"position-absolute"}
          style={{ top: "-10px", right: "-30px" }}
        >
          <span className={"sp-warning"}>
            <i className="dx-icon-warning"></i> Quá hạn 233 ngày
          </span>
        </div>
      </div>
      <div className={"w-full"} style={{ minHeight: "60px" }}>
        <ResponsiveBox className={"w-full"}>
          <Row></Row>
          <Col ratio={1}></Col>
          <Col ratio={1}></Col>
          <Col ratio={1}></Col>
          <Item>
            <Location row={0} col={0} />
            <div className="flex">
              <Avatar
                name={data.Customer.Name}
                img={data.Customer.Image}
                size={"sm"}
                className="mr-1"
              />
              <div>
                <a href="#">{data.Customer.Name}</a> <br></br>
                <div className="flex mt-1">
                  <DropDownBox
                    label={data.Customer.Phone ?? ""}
                    style={{ width: 120 }}
                  >
                    <List></List>
                  </DropDownBox>
                  <Button
                    stylingMode={"contained"}
                    type="default"
                    icon="tel"
                    className="mr-1"
                  />
                </div>
              </div>
            </div>
          </Item>
          <Item>
            <Location row={0} col={1} />
            <div className="flex">
              <span className="text-gray mr-1">Thời gian cập nhật:</span>
              <span>{data.UpdateDtime}</span>
            </div>

            <div className="flex mt-2">
              <span className="text-gray mr-1">Kênh phản hổi mong muốn:</span>
              <span>{data.PreferredReplyChannel ?? ""}</span>
            </div>
          </Item>
          <Item>
            <Location row={0} col={2} />
            <div className="flex">
              <span className="text-gray mr-1">Trạng thái:</span>
              <span className={`status ${data.Status.toLowerCase()}`}>
                {data.Status}
              </span>
            </div>

            <div className="flex mt-2">
              <span className="text-gray mr-1">Phân loại:</span>
              <span>{data.Type ?? ""}</span>
            </div>
          </Item>
        </ResponsiveBox>
      </div>
    </div>
  );
};
