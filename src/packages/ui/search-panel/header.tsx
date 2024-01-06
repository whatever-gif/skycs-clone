import { useI18n } from "@/i18n/useI18n";
import { Button } from "devextreme-react";

interface HeaderProps {
  className?: string;
  onToggleSettings?: () => void;
  onCollapse?: () => void;
  enableColumnToggler?: boolean;
}
export const Header = ({
  onCollapse,
  onToggleSettings,
  enableColumnToggler = true,
  className,
}: HeaderProps) => {
  const { t } = useI18n("Common");
  return (
    <div className={`flex ${className ?? ""} flex-row pb-1 items-center`}>
      <div className={"mr-auto flex items-center"}>
        <img
          src={"/images/icons/search.svg"}
          alt={"Search"}
          className={"w-[14px]"}
        />
        <span className={"ml-2 text-primary"}>{t("Search")}</span>
      </div>
      <div className={"flex-end ml-auto search-header-button"}>
        {enableColumnToggler && (
          <Button
            icon={"/images/icons/settings.svg"}
            id={"toggle-search-settings"}
            onClick={onToggleSettings}
          />
        )}
        <Button
          icon={"/images/icons/collapse-left.svg"}
          className="button-collapse"
          onClick={onCollapse}
        />
      </div>
    </div>
  );
};
