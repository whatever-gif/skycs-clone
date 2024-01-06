import { memo } from "react";

interface StatusButtonProps {
  status: string;
}
export const StatusUser = memo(function StatusBtn({
  status,
}: StatusButtonProps) {
  return (
    <div className="flex justify-center">
      <div
        className={"max-h-[20px] h-[20px] rounded flex items-center text-white"}
      >
        <div
          className={`px-[10px] py-[4px] flex-1 flex items-center justify-center rounded status-text ${
            status === "PENDING"
              ? "bg-[#CFB929]"
              : status === "APPROVE"
              ? "bg-[#0FBC2B]"
              : status === "PAUSED"
              ? "bg-[#D62D2D]"
              : status === "FINISH"
              ? "bg-[#298EF2]"
              : status === "CONTINUED"
              ? "bg-[#E48203]"
              : "bg-[#E48203]"
          }`}
        >{`${
          status === "PENDING"
            ? "Chờ duyệt"
            : status === "APPROVE"
            ? "Đã duyệt"
            : status === "PAUSED"
            ? "Tạm dừng"
            : status === "FINISH"
            ? "Kết thúc"
            : status === "CONTINUED"
            ? "Đang chạy"
            : "Đang chạy"
        }`}</div>
      </div>
    </div>
  );
});
