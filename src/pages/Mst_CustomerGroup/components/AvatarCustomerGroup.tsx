import React from "react";
export const getAvatarUrl = (avatarName: any) => {
  if (avatarName || avatarName === "") {
    return avatarName;
  } else {
    return "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180";
  }
};

export default function AvatarCustomerGroup({ data, key }: any) {
  return (
    <div key={key} className="flex justify-center">
      <div className="h-[90px] w-[90px] rounded-md overflow-hidden">
        <img
          src={getAvatarUrl(data.CustomerGrpImage)}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
