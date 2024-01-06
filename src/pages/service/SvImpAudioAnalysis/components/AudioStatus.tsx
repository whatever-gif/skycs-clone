import { useI18n } from "@/i18n/useI18n";
import { memo } from "react";
import { match } from "ts-pattern";

interface AudioStatusProps {
  content: string;
}
export const AudioStatus = memo(function StatusBtn({
  content,
}: AudioStatusProps) {
  const { t } = useI18n("Common_AudioAnalysis");

  const color = match(content)
    .with("PROCESSING", () => "bg-[#E48203]")
    .with("PENDING", () => "bg-[#CFB929]")
    .with("SUCCESSED", () => "bg-[#298EF2]")
    .otherwise(() => "");

  return (
    <div
      className={
        "status-button max-h-[20px] h-[20px] justify-center rounded flex items-center text-white"
      }
      style={{ margin: "auto" }}
    >
      <div
        className={`px-[10px] py-[4px] flex-1 flex items-center justify-center rounded status-text ${color}`}
      >
        {t(content)}
      </div>
    </div>
  );
});
