import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";

import { useI18n } from "@/i18n/useI18n";
import { toast } from "react-toastify";
import { PopupProfileAtom, dataIMGAtom, fileAtom } from "./store";
import { Icon } from "../icons";

export const getAvatarUrl = (avatarName: any) => {
  if (avatarName !== null) {
    return avatarName;
  } else {
    return "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180";
  }
};

export default function UploadAvatar({
  data,
  setAvt,
  formInstance,
  dataField,
}: any) {
  const imgRef = useRef<any>();
  const { t } = useI18n("Profile");
  const [file, setFile] = useAtom(fileAtom);
  const [dataImg, setDataImg] = useState<any>("");

  useEffect(() => {
    if (file !== "") {
      setDataImg(file ? URL.createObjectURL(file) : "");
    } else {
      setDataImg(data);
    }
  }, [file]);

  const handleUpload = () => {
    imgRef.current?.click();
  };
  const onFileChange = async (event: any) => {
    const fileFromLocal = event.target.files?.[0];
    if (
      fileFromLocal &&
      (fileFromLocal.size >= 5048576 || !fileFromLocal.type.includes("image"))
    ) {
      toast.error(`Dụng lượng file tối đa 5 MB. Định dạng:.JPEG, .PNG`);
    } else {
      setFile(fileFromLocal);
      formInstance.updateData(dataField, fileFromLocal);
      // setAvt(fileFromLocal);
    }
  };
  const handleDelete = () => {
    setDataImg(null);
    formInstance.updateData(dataField, null);
  };

  return (
    <>
      <div className="overflow-hidden h-[190px] w-[190px] rounded-full shadow-xl mt-3 ml-5">
        {dataImg !== null && (
          <div
            className="absolute bg-[#dadada] p-[5px] rounded-full cursor-pointer"
            onClick={handleDelete}
          >
            <Icon name="ClearX" size={12} className="pl-[1px]" />
          </div>
        )}

        <div className="h-full w-full">
          <img
            alt=""
            className="w-full h-full object-cover"
            src={getAvatarUrl(dataImg)}
          />
          <input type="file" ref={imgRef} hidden onChange={onFileChange} />
        </div>
      </div>
      <div className="mt-[24px] ml-[79px]">
        <span
          onClick={handleUpload}
          className=" text-[15px] px-2 py-1 rounded text-white bg-[#00703c] cursor-pointer"
        >
          {t("Chọn ảnh")}
        </span>
      </div>
    </>
  );
}
