import { useI18n } from "@/i18n/useI18n";
import { memo } from "react";

interface StatusButtonProps {
  isActive: boolean;
  contentActive?: string;
  contentInactive?: string;
}
export const StatusButton = memo(function StatusBtn({
  isActive,
  contentActive = "Active",
  contentInactive = "Inactive",
}: StatusButtonProps) {
  const { t } = useI18n("Common");
  return (
    <div
      className={
        "status-button w-[60px] max-h-[20px] h-[20px] justify-center rounded flex items-center text-white"
      }
      style={{ margin: "auto" }}
    >
      <div
        className={`px-[10px] py-[4px] flex-1 flex items-center justify-center rounded status-text ${
          isActive ? "bg-s-active" : "bg-s-inactive"
        }`}
      >{`${isActive ? t(contentActive) : t(contentInactive)}`}</div>
    </div>
  );
});
