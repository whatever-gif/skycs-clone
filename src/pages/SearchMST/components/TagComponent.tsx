import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function TagComponent({ dataTag, totalTag, nameTag }: any) {
  const [dataTagAll, setDataTag] = useState([]);
  const [dataTagBasic, setDataTagBasic] = useState([]);
  const [showNumber, setShowNumber] = useState(true);

  useEffect(() => {
    if (dataTag?.length > totalTag) {
      setDataTag(dataTag);
      const lessResult = dataTag?.slice(0, totalTag);
      setDataTagBasic(lessResult);
    } else {
      setDataTagBasic(dataTag);
    }
  }, [dataTag]);

  const handleshow = () => {
    setDataTagBasic(dataTag);
    setShowNumber(false);
  };

  return (
    <div className="flex gap-[4px] items-center flex-wrap">
      {dataTagBasic?.map((item: any) => {
        return (
          <div
            key={nanoid()}
            style={{
              background: getRandomColor(),
            }}
            className={`px-[10px] rounded-full py-[2px] text-white`}
          >
            {item[nameTag]}
          </div>
        );
      })}
      {dataTagAll?.length > totalTag && showNumber === true ? (
        <div
          className="px-[10px] cursor-pointer rounded-full py-[2px] bg-[#dbd6d6] text-green-700"
          onClick={handleshow}
        >
          +{dataTagAll?.length - dataTagBasic?.length}
        </div>
      ) : null}
    </div>
  );
}
