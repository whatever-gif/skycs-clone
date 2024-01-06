import React from "react";

export default function StatusPost({ isActive }: any) {
  return (
    <div
      className={
        isActive === "PUBLISHED"
          ? `bg-[#008016] w-[90px] m-auto rounded-sm py-[4px] text-[white]`
          : "bg-orange-400 w-[70px] m-auto rounded-sm py-[4px] text-[white]"
      }
    >
      {isActive === "PUBLISHED" ? "Xuất bản" : "Bản nháp"}
    </div>
  );
}
