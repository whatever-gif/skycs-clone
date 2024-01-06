import { VisibilityControl } from "@packages/hooks";
import Button from "devextreme-react/button";

interface GroupHeaderProps {
  caption: string;
  control: VisibilityControl;
  disableCollapsible?: boolean;
}
export const GroupHeader = ({
  caption,
  control,
  disableCollapsible = false,
}: GroupHeaderProps) => {
  return (
    <div
      className={`form-group-header group-header flex text-xl bg-[#E8F0F6] h-[32px] justify-center items-center ${
        caption ? "" : "hidden"
      } px-2`}
    >
      <div className={`mr-auto text-[14px] font-bold`}>{caption}</div>
      {!disableCollapsible && (
        <Button
          className={`ml-auto expand-icon-${control.visible}`}
          hoverStateEnabled={false}
          style={{
            background: "transparent",
          }}
          icon={"/images/icons/expand.svg"}
          onClick={() => control.toggle()}
        />
      )}
    </div>
  );
};
