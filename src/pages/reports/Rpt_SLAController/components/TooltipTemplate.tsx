import React from "react";

export default function TooltipTemplate(info: any) {
  return <div className="state-tooltip">{info.percentText}</div>;
}
