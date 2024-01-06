import { useSlot, withSlot } from "@packages/hooks/useSlot";
import React from "react";

import "./page-header-layout.scss";
const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  const BeforeTemplate = useSlot({
    children,
    name: "Before",
  });
  const CenterTemplate = useSlot({
    children,
    name: "Center",
  });
  const AfterTemplate = useSlot({
    children,
    name: "After",
  });

  return (
    <>
      <div className={"page-header w-full flex items-center"}>
        <div className={"before px-4"}>
          <BeforeTemplate />
        </div>
        <div className={"center flex flex-grow justify-center ml-5"}>
          <CenterTemplate />
        </div>
        <div className={"center flex flex-grow justify-end"}>
          <AfterTemplate />
        </div>
      </div>
      <div className={"bg-[#F5F5F5] h-[8px]"} />
    </>
  );
};
export const PageHeaderLayout = withSlot(Layout);
