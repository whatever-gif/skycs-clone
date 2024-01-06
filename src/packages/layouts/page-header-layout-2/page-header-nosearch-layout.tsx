import { useSlot, withSlot } from "@packages/hooks/useSlot";
import React from "react";

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  const BeforeTemplate = useSlot({
    children,
    name: "Before",
  });
  const AfterTemplate = useSlot({
    children,
    name: "After",
  });

  return (
    <div className={"w-full flex flex-col"}>
      <div className={"page-header w-full flex items-center p-2"}>
        <div className={"before pr-4 mr-auto"}>
          <BeforeTemplate />
        </div>
        <div className={"center flex flex-grow justify-end ml-auto"}>
          <AfterTemplate />
        </div>
      </div>
    </div>
  );
};
export const PageHeaderNoSearchLayout = withSlot(Layout);
