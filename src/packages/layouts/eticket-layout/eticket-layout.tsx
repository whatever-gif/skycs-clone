import { useSlot, withSlot } from "@packages/hooks/useSlot";
import { ToggleSidebarButton } from "@packages/ui/toggle-sidebar-button";
import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import React, { memo } from "react";

function screen(width: number) {
  return width < 700 ? "sm" : "lg";
}
interface AdminContentLayoutProps {
  className?: string;
}
const Layout = ({
  children,
  className,
}: React.PropsWithChildren<AdminContentLayoutProps>) => {
  const HeaderTemplate = useSlot({
    children,
    name: "Header",
  });
  const ContentTemplate = useSlot({
    children,
    name: "Content",
  });
  return (
    <ResponsiveBox
      className={`w-full ${className} `}
      singleColumnScreen="sm"
      screenByWidth={screen}
      height={"100%"}
    >
      <Row ratio={0} baseSize={1} shrink={1}></Row>
      <Row ratio={9} baseSize={9}></Row>

      <Col ratio={2}></Col>
      <Item>
        <Location row={0} col={0} />
        <div className={"w-full flex items-center"}>
          <ToggleSidebarButton />
          <HeaderTemplate />
        </div>
        <div className={"separator"} />
      </Item>
      <Item>
        <Location row={1} col={0}></Location>
        <div className={`h-full w-full`}>
          <ContentTemplate />
        </div>
      </Item>
    </ResponsiveBox>
  );
};

export const EticketLayout = withSlot(memo(Layout));
